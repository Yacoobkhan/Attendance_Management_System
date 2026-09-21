from django.urls import path 
from . import views

urlpatterns=[
    path('',views.EmployeeListCreateView.as_view(),name='employee-list-create'),
    path('teams/', views.TeamListCreateView.as_view(), name='team-list-create'),
    path('locations/', views.LocationListCreateView.as_view(), name='location-list-create'),
    path('reporting/',views.ReportingListCreateView.as_view(), name='reporting-list-create'),
    path('reporting/<int:pk>/update/', views.ReportingUpdateView.as_view(), name='reporting-update'),
    path('reporting/<int:pk>/delete/', views.ReportingDeleteView.as_view(),name='reporting-delete'),
    path('teams/<int:pk>/update/',views.TeamUpdateView.as_view(),name='team-update'),
    path('teams/<int:pk>/destroy/',views.TeamDeleteView.as_view(),name='team-delete'),
    path('locations/<int:pk>/update/',views.LocationUpdateView.as_view(),name='location-update'),
    path('locations/<int:pk>/destroy/',views.LocationDeleteView.as_view(),name='location-delete'),
    path('<int:pk>/detail/',views.EmployeeDetailView.as_view(),name='employee-detail'),
    path('<int:pk>/update/',views.EmployeeUpdateView.as_view(),name='employee-update'),
    path('<int:pk>/destroy/',views.EmployeeDestroyView.as_view(),name='employee-destroy')
]