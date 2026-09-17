from django.shortcuts import render
from .models import Attendance
from  .serializers import AttendanceSerializers,  DailyAttendanceReportSerializer
from rest_framework import generics
from employees.models import Employee
from datetime import datetime

# Create your views here.

class AttendanceListView(generics.ListAPIView):
    # queryset= Attendance.objects.all()
    serializer_class = AttendanceSerializers

    def get_queryset(self):
        queryset = Attendance.objects.all().order_by('-date')

        employee = self.request.query_params.get('employee')
        date = self.request.query_params.get('date')

        if employee:
            queryset = queryset.filter(employee_id = employee)

        if date:
            queryset = queryset.filter(date = date)

        return queryset

class AttendanceCreateView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializers

class AttendanceDetailView(generics.RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializers

class AttendanceUpdateView(generics.UpdateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializers

class AttendanceDestroyView(generics.DestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializers

class DailyAttendanceReportView(generics.ListAPIView):
    serializer_class =  DailyAttendanceReportSerializer

    def get_queryset(self):
        attendance_date = self.request.query_params.get('date')

        if not attendance_date:
            return []

        report_date = datetime.strptime(attendance_date, '%Y-%m-%d').date()

        report_day = report_date.strftime('%A')

        employees = Employee.objects.filter(is_active=True).order_by('employee_id')

        report = []

        for employee in employees:
            attendance = Attendance.objects.filter(employee=employee,date = attendance_date).first()
            
            if attendance:
                attendance_data = AttendanceSerializers(attendance).data

                report.append({
                    'employee': employee.id,
                    'employee_name': employee.employee_name,
                    'status': attendance.get_status_display(),
                    'date': attendance.date,
                    'day': attendance.day,
                    'check_in_time': attendance.check_in_time,
                    'check_out_time': attendance.check_out_time,
                    'late_minutes': attendance_data['late_minutes'],
                    'early_checkout_minutes': attendance_data['early_checkout_minutes'],
                    'remarks': attendance.remarks,
                })

            else:

                report.append({
                    'employee': employee.id,
                    'employee_name': employee.employee_name,
                    'status': 'Not Marked',
                    'date': report_date,
                    'day': report_day,
                    'check_in_time': None,
                    'check_out_time': None,
                    'late_minutes': 0,
                    'early_checkout_minutes': 0,
                    'remarks': 'Attendance not marked',
                })
        
        return report
