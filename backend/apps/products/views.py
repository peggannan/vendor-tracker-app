from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product

 
from .serializers import ProductSerializer, RestockSerializer

# Create your views here.

class ProductListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(
            user=request.user,
            deleted_at=None
        )

        #searching by name 
        search = request.query_params.get('search')
        if search:
            products = products.filter(name__icontains=search)

        #filtering by category 
        category = request.query_params.get('category')
        if category:
            products = products.filter(category__iexact=category)

        #sorting 
        sort = request.query_params.get('sort', 'created_at')
        order = request.query_params.get('order', 'desc')

        allowed_sort_fields = [
            'name', 'selling_price', 'cost_price',
            'stock_quantity', 'created_at'
        ]

        if sort not in allowed_sort_fields:
            sort = 'created_at' 
        
        if order =='desc':
            sort = f'-{sort}'

        products = products.order_by(sort)

        serializer = ProductSerializer(products, many=True)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                'data': serializer.data

            }, status=status.HTTP_201_CREATED)
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)
    

class ProductDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Product.objects.get(
                pk=pk,
                user=user,
                deleted_at=None
            )
        except Product.DoesNotExist:
            return None
        
    def get(self, request, pk):
        product = self.get_object(pk, request.user)
        if not product:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Product not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProductSerializer(product)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    

    def patch(self, request, pk):
        product = self.get_object(pk, request.user)
        if not product:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Product not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        #removing the stock_quantity from payload if present
        #stock quantity is only updated through the restock endpoint 
        data = request.data.copy()
        data.pop('stock_quantity', None)

        serializer = ProductSerializer(
            product, 
            data=data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        product = self.get_object(pk, request.user)
        if not product:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Product not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        #soft delete
        product.deleted_at = timezone.now()
        product.save()

        return Response({
            'data': {
                'message': 'Product deleted'
            }
        }, status=status.HTTP_200_OK)
    


class RestockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            product = Product.objects.get(
                pk=pk,
                user=request.user,
                deleted_at=None
            )
        except Product.DoesNotExist:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Product not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RestockSerializer(data=request.data)
        if serializer.is_valid():
            quantity = serializer.validated_data['quantity']
            cost_price = serializer.validated_data.get('cost_price')

            #adding to existing stock 
            product.stock_quantity += quantity

            #updating the cp if provided 
            if cost_price is not None:
                product.cost_price = cost_price
            
            product.save()

            return Response({
                'data': {
                    'id': product.id,
                    'name': product.name,
                    'stock_quantity': product.stock_quantity,
                    'restock': {
                        'quantity_added': quantity,
                        'cost_price': cost_price,
                        'date': timezone.now()
                    }

                }
            }, status=status.HTTP_200_OK)
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)
        



        
