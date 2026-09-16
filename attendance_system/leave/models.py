from django.db import models
from employees.models import Employee
# Create your models here.
class Leave(models.Model):

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

    employee = models.ForeignKey(Employee,on_delete=models.CASCADE)
    leave = models.CharField(max_length=50, choices = STATUS_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.employee.employee_name} - {self.leave}"
    