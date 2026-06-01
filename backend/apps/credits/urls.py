from django.urls import path
from .views import CreditListCreateView, CreditDetailView, CreditPayView, CreditOverdueView

urlpatterns = [
    path('', CreditListCreateView.as_view(), name='credit-list-create'),
    path('<int:pk>/', CreditDetailView.as_view(), name='credit-detail'),
    path('<int:pk>/pay/', CreditPayView.as_view(), name='credit-pay'),
    path('overdue/', CreditOverdueView.as_view(), name='credit-overdue'),
]
