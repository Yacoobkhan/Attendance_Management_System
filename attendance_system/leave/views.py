from django.shortcuts import render
from rest_framework import generics 
from .models import Leave
from .serializers import LeaveSerializer
# Create your views here.


class LeaveListView(generics.ListAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

class LeaveCreateView(generics.CreateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

class LeaveDetailView(generics.RetrieveAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

class LeaveUpdateView(generics.UpdateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

class LeaveDestroyView(generics.DestroyAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer