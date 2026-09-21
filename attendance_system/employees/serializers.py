from rest_framework import serializers
from .models import Employee, Team, Location, ReportingManager

class EmployeeSerializer(serializers.ModelSerializer):

    reporting_person_name = serializers.CharField(source='reporting_person.name',read_only=True)

    class Meta:
        model = Employee
        fields=[
            'id',
            'employee_id',
            'employee_name',
            'dob',
            'role',
            'team',
            'location',
            'phone',
            'mail',
            'joining_date',
            'employee_type',
            'reporting_person',
            'reporting_person_name',
            'is_active',
        ]

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields=[
            'id',
            'name',
            'is_active',
        ]

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields=[
            'id',
            'name',
            'is_active',
        ]

class ReportingManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManager
        fields =[
            'id',
            'name',
            'is_active',
        ]