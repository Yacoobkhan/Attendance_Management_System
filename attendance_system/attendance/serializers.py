from rest_framework import serializers
from .models import Attendance
from datetime import date,time, datetime

class AttendanceSerializers(serializers.ModelSerializer):

    late_minutes = serializers.SerializerMethodField()
    early_checkout_minutes = serializers.SerializerMethodField()
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
            'remarks',
            'late_minutes',
            'early_checkout_minutes',
        ]

    def validate(self,attrs):
        check_in = attrs.get('check_in_time', getattr(self.instance,'check_in_time',None))
        check_out = attrs.get('check_out_time',getattr(self.instance,'check_out_time',None))

        attendance_date = attrs.get('date',getattr(self.instance,'date',None))

        day = attrs.get('day',getattr(self.instance,'day',None))

        #status = attrs.get('status', getattr(self.instance, 'status', None))

        if check_in and check_out and check_out < check_in:
            raise serializers.ValidationError(
                "Check-out time cannot be earlier than check-in time."
            )

        if attendance_date and attendance_date > date.today():
            raise serializers.ValidationError(
                "Attendance date cannot be in future"
            )

        if attendance_date and  day:
            actual_day = attendance_date.strftime('%A')

            if day != actual_day:
                raise serializers.ValidationError(
                    f'Day does not match the date. {attendance_date} is a {actual_day}'
                )

        # statuses_requiring_time = ['X', 'WFH', '0.5SL', '0.5CL']

        # statuses_not_requiring_time = ['L', 'SL', 'CL', 'NA']

        # if status in statuses_requiring_time:
        #     if not check_in:
        #         raise serializers.ValidationError(
        #             "Check-in time is required for this attendance status."
        #         )

        #     if not check_out:
        #         raise serializers.ValidationError(
        #             "Check-out time is required for this attendance status."
        #         )

        # if status in statuses_not_requiring_time:
        #     if check_in or check_out:
        #         raise serializers.ValidationError(
        #             "Check-in and check-out times should be empty for this attendance status."
        #         )

        

        return attrs

    def get_late_minutes(self,obj):
        office_start = time(9,0)

        if obj.check_in_time and obj.check_in_time > office_start:
            check_in = datetime.combine(obj.date,obj.check_in_time)
            office_time = datetime.combine(obj.date,office_start)

            difference = check_in - office_time

            return int(difference.total_seconds() / 60)
        return 0

    def get_early_checkout_minutes(self,obj):
        office_end = time(18,0)

        if obj.check_out_time and obj.check_out_time  < office_end:
            check_out = datetime.combine(obj.date,obj.check_out_time)
            office_time = datetime.combine(obj.date,office_end)

            difference = office_time - check_out

            return int(difference.total_seconds() / 60)

        return 0

class DailyAttendanceReportSerializer(serializers.ModelSerializer):

    employee = serializers.IntegerField()
    attendance_id = serializers.IntegerField(allow_null=True)
    employee_id = serializers.IntegerField()
    employee_name = serializers.CharField()
    reporting_person = serializers.CharField(allow_null=True,allow_blank=True)
    team = serializers.CharField(allow_null=True,allow_blank=True)
    location = serializers.CharField(allow_null=True,allow_blank=True)
    status = serializers.CharField()
    date = serializers.DateField()
    day = serializers.CharField(allow_blank=True)
    remarks = serializers.CharField(allow_blank=True)

    class Meta:
        model = Attendance
        fields = [
            'employee',
            'attendance_id',
            'employee_id',
            'employee_name',
            'reporting_person',
            'team',
            'location',
            'status',
            'date',
            'day',
            'remarks'
        ]

class MonthlyAttendanceReportSerializer(serializers.Serializer):

    employee = serializers.IntegerField()
    employee_name = serializers.CharField()
    employee_type = serializers.CharField()
    reporting_person = serializers.CharField(allow_null=True)

    attendance = serializers.DictField()

    working_days = serializers.FloatField()
    paid_holidays = serializers.IntegerField()
    absent_days = serializers.FloatField()
    total_days = serializers.FloatField()
    holidays = serializers.IntegerField()
    half_absent_days = serializers.FloatField()
    na_days = serializers.IntegerField()
    extra_days = serializers.FloatField()
    wfh = serializers.IntegerField()

    remarks = serializers.CharField(allow_blank=True)