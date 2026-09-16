from django.urls import path 
from . import views

urlpatterns = [
    path('', views.LeaveListView.as_view(), name='leave-list'),
    path('create/',views.LeaveCreateView.as_view(), name='leave-create'),
    path('<int:pk>/detail/',views.LeaveDetailView.as_view(), name='leave-detail'),
    path('<int:pk>/update/',views.LeaveUpdateView.as_view(), name='leave-update'),
    path('<int:pk>/destroy/', views.LeaveDestroyView.as_view(), name='leave-destroy'),
]
