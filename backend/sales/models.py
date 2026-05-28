from django.db import models
from django.conf import settings 
from apps.customers.models import Customer
from apps.products.models import Product

# Create your models here.
class Sale(models.Model):
    PAYMENT_CHOICES = [
        ('cash', 'Cash'),
        ('momo', 'Mobile Money'),
    ]
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sales'
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales'

    )
    payment_method = models.CharField(max_length=15, choices=PAYMENT_CHOICES)
    sale_total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='completed'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    cancelled_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = 'sales'

    def __str__(self):
        return f"Sale #{self.id} - {self.sale_total}"
    


class SaleItem(models.Model):
   
    sale = models.ForeignKey(
        Sale,
        on_delete=models.CASCADE,
        null=True,
        related_name='sale_items' 
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name='sale_items'
    )

    product_name = models.CharField(max_length=300)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)


    class Meta:
        db_table = 'sale_items'
    

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"


