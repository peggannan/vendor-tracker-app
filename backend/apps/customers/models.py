from django.db import models
from django.conf import settings


# Create your models here.
class Customer(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customers'
    )
    name = models.CharField(max_length=225)
    phone = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'customers'

    def __str__(self):
        return self.name
    
    @property
    def is_deleted(self):
        return self.deleted_at is not None
