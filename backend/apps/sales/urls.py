from django.urls import path 
from .views import SaleListCreateView, SaleDetailView, SaleCancelView



urlpatterns = [
    path('', SaleListCreateView.as_view(), name='sale-list-create'),
    path('<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),
    path('<int:pk>/cancel/', SaleCancelView.as_view(), name='sale-cancel')
]