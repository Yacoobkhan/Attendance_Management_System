from django.urls import path 
from . import views

urlpatterns = [
    path('',views.AttendanceListView.as_view(),name='attendance-list'),
    path('create/',views.AttendanceCreateView.as_view(),name='attendance-create'),
    path('report/daily/',views.DailyAttendanceReportView.as_view(), name='attendance-daily-report'),
    path('report/monthly/',views.MonthlyAttendanceReportView.as_view(),name='attendance-monthly-report'),
    path('<int:pk>/detail/',views.AttendanceDetailView.as_view(),name='attendance-detail'),
    path('<int:pk>/update/',views.AttendanceUpdateView.as_view(),name='attendance-update'),
    path('<int:pk>/destroy/',views.AttendanceDestroyView.as_view(),name='attendance-destroy'),
]
