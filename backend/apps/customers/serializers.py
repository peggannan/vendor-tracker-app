from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    total_purchases = serializers.SerializerMethodField()
    outstanding_credit = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            'id',
            'name',
            'phone',
            'created_at',
            'total_purchases',
            'total_spent',
            'outstanding_credit',
        ]
        read_only_fields = ['id', 'created_at']

    def get_total_purchases(self, obj):
        return obj.sales.filter(
            status='completed'
        ).count()
    
    def get_outstanding_credit(self, obj):
        from apps.credits.models import Credit
        from django.db.models import Sum
        total = Credit.objects.filter(
            customer=obj,
            paid=False,
            deleted_at=None
        ).aggregate(total=Sum('amount_owed'))['total']
        return total or 0
    
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError('Name cannot be blank')
        return value
    
    def get_total_spent(self, obj):
        
        from django.db.models import Sum
        result = obj.sales.filter(
            status='completed'
        ).aggregate(total=Sum('sale_total'))['total']
        return result or 0
    

class CustomerDetailSerializer(serializers.ModelSerializer):
    purchases = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    outstanding_credit = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            'id',
            'name',
            'phone',
            'purchases',
            'total_spent',
            'outstanding_credit',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_purchases(self, obj):
        from apps.sales.models import Sale
        sales = Sale.objects.filter(
            customer=obj,
            status='completed'
        ).prefetch_related('items')

        result = []
        for sale in sales:
            items = []
            for item in sale.items.all():
                items.append({
                    'product_id': item.product_id,
                    'product_name': item.product_name,
                    'quantity': item.quantity,
                    'unit_price': str(item.unit_price),
                    'total': str(item.total)
                })
            result.append({
                'sale_id': sale.id,
                'date': sale.created_at,
                'payment_method': sale.payment_method,
                'items': items,
                'sale_total': str(sale.sale_total)

            })
        return result
    
    def get_total_spent(self, obj):
        from django.db.models import Sum

        result = obj.sales.filter(
            status='completed'
        ).aggregate(total=Sum('sale_total'))['total']
        return result or 0
    

    def get_outstanding_credit(self, obj):
        from apps.credits.models import Credit
        from django.db.models import Sum
        result = Credit.objects.filter(
            customer=obj,
            paid=False,
            deleted_at=None
        ).aggregate(total=Sum('amount_owed'))['total']
        return result or 0


