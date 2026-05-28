from django.urls import path 
from .views import ProductListCreateView, ProductDetailView, RestockView


urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('<int:pk>/restock/', RestockView.as_view(), name='product-restock'),
]