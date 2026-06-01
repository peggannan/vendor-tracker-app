from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Credit
from .serializers import CreditSerializer, CreditCreateSerializer, CreditPaySerializer
from apps.customers.models import Customer
from apps.sales.models import Sale

# Create your views here.
class CreditListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        credits = Credit.objects.filter(
            user=request.user,
            deleted_at=None
        ).order_by('-created_at')

        # filter by paid status
        paid = request.query_params.get('paid')
        if paid is not None:
            credits = credits.filter(paid=paid.lower() == 'true')

        # filter by customer
        customer_id = request.query_params.get('customer_id')
        if customer_id:
            credits = credits.filter(customer_id=customer_id)

        serializer = CreditSerializer(credits, many=True)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CreditCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data

        customer = Customer.objects.get(
            pk=validated_data['customer_id'],
            user=request.user
        )

        sale = None
        if validated_data.get('sale_id'):
            sale = Sale.objects.get(
                pk=validated_data['sale_id'],
                user=request.user
            )

        credit = Credit.objects.create(
            user=request.user,
            customer=customer,
            sale=sale,
            amount_owed=validated_data['amount_owed'],
            amount_paid=0,
            due_date=validated_data.get('due_date'),
        )

        return Response({
            'data': CreditSerializer(credit).data
        }, status=status.HTTP_201_CREATED)


class CreditDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Credit.objects.get(
                pk=pk,
                user=user,
                deleted_at=None
            )
        except Credit.DoesNotExist:
            return None

    def get(self, request, pk):
        credit = self.get_object(pk, request.user)
        if not credit:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Credit not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = CreditSerializer(credit)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        credit = self.get_object(pk, request.user)
        if not credit:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Credit not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        credit.deleted_at = timezone.now()
        credit.save()

        return Response({
            'data': {
                'message': 'Credit deleted'
            }
        }, status=status.HTTP_200_OK)


class CreditPayView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            credit = Credit.objects.get(
                pk=pk,
                user=request.user,
                deleted_at=None
            )
        except Credit.DoesNotExist:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Credit not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        if credit.paid:
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Credit is already fully paid'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = CreditPaySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        amount = serializer.validated_data['amount']

        # amount being paid cannot exceed what is remaining
        if amount > credit.amount_remaining:
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': f'Amount exceeds remaining balance of {credit.amount_remaining}'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        credit.amount_paid += amount

        # check if fully paid
        if credit.amount_paid >= credit.amount_owed:
            credit.paid = True
            credit.paid_at = timezone.now()

        credit.save()

        return Response({
            'data': CreditSerializer(credit).data
        }, status=status.HTTP_200_OK)


class CreditOverdueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        credits = Credit.objects.filter(
            user=request.user,
            paid=False,
            deleted_at=None,
            due_date__lt=today
        ).order_by('due_date')

        serializer = CreditSerializer(credits, many=True)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)
