from .models import Credit 
from apps.customers.models import Customer
from rest_framework import serializers
from apps.sales.models import Sale


class CreditSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    amount_remaining = serializers.ReadOnlyField()

    class Meta:
        model = Credit
        fields = [
            'id',
            'customer_id',
            'customer_name',
            'sale_id',
            'amount_owed',
            'amount_paid',
            'amount_remaining',
            'paid',
            'due_date',
            'paid_at',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'amount_remaining',
            'paid',
            'paid_at',
            'created_at',
        ]

    def get_customer_name(self, obj):
        return obj.customer.name
    
class CreditCreateSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField()
    sale_id = serializers.IntegerField(required=False, allow_null=True)
    amount_owed = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    due_date = serializers.DateField(required=False, allow_null=True)

    def validate(self, attrs):
        request = self.context.get('request')

        # validate customer exists and belongs to this vendor
        try:
            Customer.objects.get(
                pk=attrs['customer_id'],
                user=request.user,
                deleted_at=None
            )
        except Customer.DoesNotExist:
            raise serializers.ValidationError({
                'customer_id': 'Customer not found'
            })

        # validate sale exists and belongs to this vendor if provided
        if attrs.get('sale_id'):
            try:
                Sale.objects.get(
                    pk=attrs['sale_id'],
                    user=request.user
                )
            except Sale.DoesNotExist:
                raise serializers.ValidationError({
                    'sale_id': 'Sale not found'
                })

        return attrs
    
    

class CreditPaySerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero')
        return value
    