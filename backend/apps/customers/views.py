from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import Customer
from .serializers import CustomerSerializer, CustomerDetailSerializer

# Create your views here.
class CustomerListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customers = Customer.objects.filter(
            user=request.user,
            deleted_at=None
        )

        #searching by name 
        search = request.query_params.get('search')
        if search:
            customers = customers.filter(name__icontains=search)

        #searching by phone 
        phone = request.query_params.get('phone')
        if phone:
            customers = customers.filter(phone__icontains=phone)

        customers = customers.order_by('created_at')

        serializer = CustomerSerializer(customers, many=True)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
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
    


class CustomerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Customer.objects.get(
                pk=pk,
                user=user,
                deleted_at=None
            )
        except Customer.DoesNotExist():
            return None
        
    def get(self, request, pk):
        customer = self.get_object(pk, request.user)
        if not customer:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Customer cannot be found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomerDetailSerializer(customer)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        customer = self.get_object(pk, request.user)
        if not customer:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Customer not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomerSerializer(
            customer,
            data=request.data,
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
        customer = self.get_object(pk, request.user)
        if not customer:
            return Response({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Customer not found'
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        #soft deleting 
        customer.deleted_at = timezone.now()
        customer.save()

        return Response({
            'data': {
                'message': 'Customer successfully deleted'
            }
        }, status=status.HTTP_200_OK)

