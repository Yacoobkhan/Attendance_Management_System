from rest_framework import serializers
from .models import Leave

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields=[
            'id',
            'employee',
            'leave',
            'start_date',
            'end_date',
            'reason',
            'approved'
        ]