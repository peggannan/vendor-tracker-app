from django.db import models
from django.conf import settings 
from apps.customers.models import Customer
from apps.sales.models import Sale


# Create your models here.

class Credit(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_credits'
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='credit'
    )

    amount_owed = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.BooleanField(default=False)
    due_date = models.DateField()
    paid_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'credits'
 

    def __str__(self):
        return f"Credit #{self.id} - {self.customer.name}"
    

    @property
    def amount_remaining(self):
        return self.amount_owed - self.amount_paid
    
    @property
    def is_deleted(self):
        return self.deleted_at is not None


