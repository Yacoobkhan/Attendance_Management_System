from django.db import models
from employees.models import Employee

# Create your models here.
class Attendance(models.Model):

    STATUS_CHOICES = [
        ('X','Present'),
        ('SL','Sick Leave'),
        ('L','Leave'),
        ('NA','Not Available'),
        ('WFH','Work From Home'),
        ('CL','Casual Leave'),
        ('0.5SL','Half day Sick Leave'),
        ('0.5CL', 'Half day Casual Leave'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    day = models.CharField(max_length=10)
    check_in_time = models.TimeField(null = True, blank = True)
    check_out_time = models.TimeField(null = True, blank = True)
    status = models.CharField(max_length = 20, choices = STATUS_CHOICES)
    remarks = models.TextField(blank = True)


    def __str__(self):
        return f"{self.employee.employee_name} - {self.date}"
    

