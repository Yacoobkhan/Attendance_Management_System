# from django.shortcuts import render
from rest_framework import generics  
from .models import Employee, Team, Location, ReportingManager
from .serializers import EmployeeSerializer, TeamSerializer, LocationSerializer, ReportingManagerSerializer


class ReportingListCreateView(generics.ListCreateAPIView):
    queryset = ReportingManager.objects.filter(is_active=True)
    serializer_class = ReportingManagerSerializer

class ReportingUpdateView(generics.UpdateAPIView):
    queryset = ReportingManager.objects.all()
    serializer_class = ReportingManagerSerializer

class ReportingDeleteView(generics.DestroyAPIView):
    queryset = ReportingManager.objects.all()
    serializer_class = ReportingManagerSerializer

class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Team.objects.filter(is_active=True)
    serializer_class = TeamSerializer

class TeamUpdateView(generics.UpdateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class TeamDeleteView(generics.DestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class LocationUpdateView(generics.UpdateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer    

class LocationDeleteView(generics.DestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer 

class LocationListCreateView(generics.ListCreateAPIView):
    queryset = Location.objects.filter(is_active=True)
    serializer_class = LocationSerializer

class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class EmployeeDetailView(generics.RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

# class EmployeeUpdateView(generics.UpdateAPIView):
#     queryset = Employee.objects.all()
#     serializer_class = EmployeeSerializer

class EmployeeUpdateView(generics.UpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def update(self, request, *args, **kwargs):
        print("REQUEST DATA:", request.data)

        response = super().update(request, *args, **kwargs)

        employee = self.get_object()

        print("SAVED REPORTING PERSON:", employee.reporting_person_id)
        print("SAVED EMPLOYEE:", EmployeeSerializer(employee).data)

        return response

class EmployeeDestroyView(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
