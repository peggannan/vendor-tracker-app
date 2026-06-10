from rest_framework import serializers
from .models import Sale, SaleItem
from apps.products.models import Product


class SaleItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    
    
    

class SaleCreateSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField(required=False, allow_null=True)
    payment_method = serializers.ChoiceField(choices=['cash', 'momo', 'card', 'credit'])
    items = SaleItemInputSerializer(many=True, allow_empty=False)

    
    

class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = [
            'product_id',
            'product_name',
            'quantity',
            'unit_price',
            'cost_price',
            'total',
        ]


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True, source='sale_items')
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = [
            'id',
            'customer_id',
            'customer_name',
            'payment_method',
            'sale_total',
            'status',
            'items',
            'created_at'
        ]
        read_only_fields = ['sale_total']

    def get_customer_name(self, obj):
        if obj.customer:
            return obj.customer.name
        return None
    

class SaleListSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    items = SaleItemSerializer(many=True, read_only=True, source='sale_items')

    class Meta:
        model = Sale
        fields = [
            'id',
            'customer_id',
            'customer_name',
            'payment_method',
            'sale_total',
            'status',
            'created_at',
            'items',
        ]

    def get_customer_name(self, obj):
        if obj.customer:
            return obj.customer.name
        return None




