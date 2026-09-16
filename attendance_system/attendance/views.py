from django.shortcuts import render
from .models import Attendance
from  .serializers import AttendanceSerializers
from rest_framework import generics

# Create your views here.

class AttendanceListView(generics.ListAPIView):
    queryset= Attendance.objects.all()
    serializer_class = AttendanceSerializers

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
