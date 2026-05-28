from django.db import models
from django.conf import settings

# Create your models here.
class Product(models.Model):
    UNIT_CHOICES = [
        ('sachet', 'Sachet'),
        ('bottle', 'Bottle'),
        ('bag', 'Bag'),
        ('kg', 'Kilogram'),
        ('g', 'Gram'),
        ('litre', 'Litre'),
        ('tin', 'Tin'),
        ('crate', 'Crate'),
        ('pack', 'Pack'),
        ('piece', 'Piece'),
        ('bunch', 'Bunch'),
        ('tuber', 'Tuber'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='products'
    )
    name = models.CharField(max_length=225)
    category = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    expiry_date = models.DateField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    unit = models.CharField(max_length=50, choices=UNIT_CHOICES)
    unit_custom = models.CharField(max_length=50, null=True, blank=True)
    low_stock_threshold = models.IntegerField(default=5)

    class Meta:
        db_table = 'products'

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.low_stock_threshold

    @property
    def is_deleted(self):
        return self.deleted_at is not None

    @property
    def display_unit(self):
        if self.unit == 'other' and self.unit_custom:
            return self.unit_custom
        return self.get_unit_display()


