from django.db import models

# Create your models here.
class Employee(models.Model):
    employee_id = models.IntegerField(unique=True)
    employee_name = models.CharField(max_length = 100)
    dob = models.DateField()
    role = models.CharField(max_length = 100)
    phone = models.CharField(max_length = 15)
    mail = models.EmailField(unique=True)
    joining_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.employee_id} - {self.employee_name}"
    

