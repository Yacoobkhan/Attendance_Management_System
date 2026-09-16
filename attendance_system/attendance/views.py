from django.shortcuts import render
from .models import Attendance
from  .serializers import AttendanceSerializer
from rest_framework import generics

# Create your views here.

class AttendanceListView(generics.ListAPIView):
    queryset= Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceCreateView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceDetailView(generics.RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceUpdateView(generics.UpdateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceDestroyView(generics.DestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
