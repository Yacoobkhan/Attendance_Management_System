from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields=[
            'id',
            'employee_id',
            'employee_name',
            'dob',
            'role',
            'phone',
            'mail',
            'joining_date',
            'is_active'
        ]