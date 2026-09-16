from django.urls import path 
from . import views

urlpatterns=[
    path('',views.EmployeeListCreateView.as_view(),name='employee-list-create'),
    path('<int:pk>/detail/',views.EmployeeDetailView.as_view(),name='employee-detail'),
    path('<int:pk>/update/',views.EmployeeUpdateView.as_view(),name='employee-update'),
    path('<int:pk>/destroy/',views.EmployeeDestroyView.as_view(),name='employee-destroy')
]