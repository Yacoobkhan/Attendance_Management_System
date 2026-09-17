from django.shortcuts import render
from .models import Attendance
from  .serializers import AttendanceSerializers
from rest_framework import generics

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
