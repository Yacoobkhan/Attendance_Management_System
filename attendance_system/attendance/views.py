from django.shortcuts import render
from .models import Attendance
from  .serializers import AttendanceSerializers, DailyAttendanceReportSerializer, MonthlyAttendanceReportSerializer
from rest_framework import generics
from employees.models import Employee
from datetime import datetime,date
import calendar

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

class MonthlyAttendanceReportView(generics.ListAPIView):

    serializer_class = MonthlyAttendanceReportSerializer

    def get_queryset(self):

        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')

        if not year or not month:
            return []

        year = int(year)
        month = int(month)

        number_of_days = calendar.monthrange(year, month)[1]

        employees = Employee.objects.filter(
            is_active=True
        ).order_by('employee_id')

        report = []

        for employee in employees:

            attendance_data = {}

            working_days = 0
            paid_holidays = 0
            absent_days = 0
            total_days = 0
            holidays = 0
            half_absent_days = 0
            na_days = 0
            extra_days = 0
            wfh = 0

            for day in range(1, number_of_days + 1):

                attendance_date = date(year, month, day)

                attendance = Attendance.objects.filter(
                    employee=employee,
                    date=attendance_date
                ).first()

                # Before joining date
                if attendance_date < employee.joining_date:

                    attendance_data[str(day)] = 'NA'
                    na_days += 1

                # Sunday
                elif attendance_date.weekday() == 6:

                    attendance_data[str(day)] = 'L'
                    paid_holidays += 1

                # Attendance exists
                elif attendance:

                    status = attendance.status

                    attendance_data[str(day)] = status

                    if status == 'X':

                        working_days += 1

                    elif status == 'WFH':

                        working_days += 1
                        wfh += 1

                    elif status in ['SL', 'CL']:

                        absent_days += 1

                    elif status in ['0.5SL', '0.5CL']:

                        half_absent_days += 0.5

                    elif status == 'NA':

                        na_days += 1

                # After joining but attendance not marked
                else:

                    attendance_data[str(day)] = ''

            report.append({

                'employee': employee.id,

                'employee_name': employee.employee_name,

                'employee_type': employee.get_employee_type_display(),

                'reporting_person': (
                    employee.reporting_person.employee_name
                    if employee.reporting_person
                    else None
                ),

                'attendance': attendance_data,

                'working_days': working_days,

                'paid_holidays': paid_holidays,

                'absent_days': absent_days,

                'total_days': total_days,

                'holidays': holidays,

                'half_absent_days': half_absent_days,

                'na_days': na_days,

                'extra_days': extra_days,

                'wfh': wfh,

                'remarks': '',
            })

        return report