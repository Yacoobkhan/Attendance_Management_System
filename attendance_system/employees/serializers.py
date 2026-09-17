from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):

    reporting_person = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        allow_null=True,
        required=False
    )

    reporting_person_name = serializers.SerializerMethodField()
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
            'employee_type',
            'reporting_person',
            'reporting_person_name',
            'is_active',
        ]

    def get_reporting_person_name(self, obj):
        if obj.reporting_person:
            return obj.reporting_person.employee_name
        return None