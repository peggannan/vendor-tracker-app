from django.shortcuts import render
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import Sale, SaleItem
from .serializers import (
    SaleCreateSerializer,
    SaleSerializer,
    SaleListSerializer
)

from apps.products.models import Product
from apps.customers.models import Customer
from apps.credits.models import Credit


# Create your views here.

class SaleListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sales = Sale.objects.filter(
            user=request.user
        ).prefetch_related('sale_items').order_by('created_at')

        

        #filtering the date
        date = request.query_params.get('date')
        if date:
            sales = sales.filter(created_at__date=date)

        #filtering date by range 
        from_date = request.query_params.get('from')
        to_date = request.query_params.get('to')
        if from_date and to_date:
            sales = sales.filter(
                created_at__date__gte=from_date,
                created_at__date__lte=to_date
            )
        
        #filtering by payment method 
        payment_method = request.query_params.get('payment_method')
        if payment_method:
            sales = sales.filter(payment_method=payment_method)

        #filtering by customer
        customer_id = request.query_params.get('customer_id')
        if customer_id:
            sales = sales.filter(customer_id=customer_id)
        
        serializer = SaleListSerializer(sales, many=True)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = SaleCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        items_data = validated_data['items']
        customer_id = validated_data.get('customer_id')
        payment_method = validated_data['payment_method']


        #validating if the customer acc exists and belongs to this vendor
        customer = None
        if customer_id:
            try:
                customer = Customer.objects.get(
                    pk=customer_id,
                    user=request.user,
                    deleted_at=None
                )
            except Customer.DoesNotExist:
                return Response({
                    'error': {
                        'code': 'NOT_FOUND',
                        'message': 'Customer not found'
                    }
                }, status=status.HTTP_404_NOT_FOUND)
        elif payment_method == 'credit':
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': {'customer_id': ['Customer is required for credit sales']}
                }
            }, status=status.HTTP_400_BAD_REQUEST)
            
        #validating all products before touching the db
        products = []
        for item in items_data:
            try:
                product = Product.objects.get(
                    pk=item['product_id'],
                    user=request.user,
                    deleted_at=None
                )
            except Product.DoesNotExist:
                return Response({
                    'error': {
                        'code': 'NOT_FOUND',
                        'message': f'Product with id {item["product_id"]} cannot be found'
                    }
                }, status=status.HTTP_404_NOT_FOUND)

            if item['quantity'] > product.stock_quantity:
                return Response({
                    'error': {
                        'code': 'INSUFFICIENT_STOCK',
                        'message': f'Not enough stock for {product.name}. Available: {product.stock_quantity}'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            products.append((product, item['quantity']))

        # NOW write to db — outside the for loop
        try:
            with transaction.atomic():
                sale_total = sum(
                    product.selling_price * quantity
                    for product, quantity in products
                )

                sale = Sale.objects.create(
                    user=request.user,
                    customer=customer,
                    payment_method=payment_method,
                    sale_total=sale_total,
                    status='completed'
                )

                for product, quantity in products:
                    SaleItem.objects.create(
                        sale=sale,
                        product=product,
                        product_name=product.name,
                        unit_price=product.selling_price,
                        cost_price=product.cost_price,
                        quantity=quantity,
                        total=product.selling_price * quantity
                    )
                    product.stock_quantity -= quantity
                    product.save()

                if payment_method == 'credit' and customer:
                    Credit.objects.create(
                        user=request.user,
                        customer=customer,
                        sale=sale,
                        amount_owed=sale_total,
                        amount_paid=0,
                    )

        except Exception as e:
            return Response({
                'error': {
                    'code': 'SERVER_ERROR',
                    'message': 'Something went wrong while recording the sale'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        sale_serializer = SaleSerializer(sale)
        return Response({
            'data': sale_serializer.data
        }, status=status.HTTP_201_CREATED)
        

class SaleDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Sale.objects.get(
                pk=pk,
                user=user
            )
        except Sale.DoesNotExist:
            return None
        
    def get(self, request, pk):
        sale = self.get_object(pk, request.user)
        if  not sale:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Sale not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        serializer = SaleSerializer(sale)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        sale = self.get_object(pk, request.user)
        if not sale:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Sale not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status', '').lower()
        allowed_statuses = {'completed', 'pending', 'cancelled'}
        if new_status not in allowed_statuses:
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': {'status': ['Status must be completed, pending, or cancelled']}
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        if sale.status == new_status:
            return Response({'data': SaleSerializer(sale).data}, status=status.HTTP_200_OK)

        try:
            with transaction.atomic():
                sale_items = list(sale.items.select_related('product').all())

                if sale.status != 'cancelled' and new_status == 'cancelled':
                    for item in sale_items:
                        if item.product:
                            item.product.stock_quantity += item.quantity
                            item.product.save()

                if sale.status == 'cancelled' and new_status != 'cancelled':
                    for item in sale_items:
                        if not item.product:
                            continue
                        if item.product.stock_quantity < item.quantity:
                            return Response({
                                'error': {
                                    'code': 'VALIDATION_ERROR',
                                    'message': f'Not enough stock to restore {item.product_name}'
                                }
                            }, status=status.HTTP_400_BAD_REQUEST)
                        item.product.stock_quantity -= item.quantity
                        item.product.save()

                sale.status = new_status
                sale.cancelled_at = timezone.now() if new_status == 'cancelled' else None
                sale.save()
        except Exception:
            return Response({
                'error': {
                    'code': 'SERVER_ERROR',
                    'message': 'Something went wrong while updating the sale'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = SaleSerializer(sale)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)
    

class SaleCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            sale = Sale.objects.get(
                pk=pk,
                user=request.user
            )
        except Sale.DoesNotExist:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Sale not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        if sale.status == 'cancelled':
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Sale is already cancelled'

                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                #returning each stock for each item
                for item in sale.items.all():
                    if item.product:
                        item.product.stock_quantity += item.quantity
                        item.product.save()
                sale.status = 'cancelled'
                sale.cancelled_at = timezone.now()
                sale.save()
        except Exception as e:
            return Response({
                'error': {
                    'code': 'SERVER_ERROR',
                    'message': 'something went wrong while cancelling this sale'
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({
            'data': {
                'message': 'Sale cancelled',
                'sale_id': sale.id
                } 
            }, status=status.HTTP_200_OK)
                    



