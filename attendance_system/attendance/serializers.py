from rest_framework import serializers
from .models import Attendance

class AttendanceSerializers(serializers.ModelSerailizer):
    class Meta:
        model = Attendance
        fields=[
            'id',
            'employee',
            'date',
            'day',
            'check_in_time',
            'check_out_time',
            'status',
            'remarks'
        ]