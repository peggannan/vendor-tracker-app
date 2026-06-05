from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.ReadOnlyField()
    display_unit = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'image',
            'selling_price',
            'cost_price',
            'stock_quantity',
            'unit',
            'unit_custom',
            'category',
            'low_stock_threshold',
            'expiry_date',
            'is_low_stock',
            'display_unit',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        # fall back to existing values on PATCH
        selling_price = attrs.get('selling_price') or (self.instance.selling_price if self.instance else None)
        cost_price = attrs.get('cost_price') or (self.instance.cost_price if self.instance else None)

        # unit is other but no custom unit provided
        if attrs.get('unit') == 'other' and not attrs.get('unit_custom'):
            raise serializers.ValidationError({
            'unit_custom': 'Please specify a custom unit when selecting other'
        })

        # selling price cannot be less than cost price
        if selling_price and cost_price:
            if selling_price < cost_price:
                raise serializers.ValidationError({
                    'selling_price': 'Selling price cannot be less than cost price'
            })

        # stock quantity cannot be negative
        if attrs.get('stock_quantity') is not None:
            if attrs['stock_quantity'] < 0:
                raise serializers.ValidationError({
                    'stock_quantity': 'Stock quantity cannot be negative'
            })

        return attrs



class RestockSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
    cost_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False
    )
