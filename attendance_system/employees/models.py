from django.db import models

# Create your models here.
class Employee(models.Model):

    EMPLOYEE_TYPE_CHOICES = [
        ('EMPLOYEE', 'Employee'),
        ('INTERN', 'Intern'),
    ]

    employee_id = models.IntegerField(unique=True)
    employee_name = models.CharField(max_length = 100)
    dob = models.DateField()
    role = models.CharField(max_length = 100)
    phone = models.CharField(max_length = 15)
    mail = models.EmailField(unique=True)
    joining_date = models.DateField()
    is_active = models.BooleanField(default=True)

    employee_type = models.CharField(max_length=20,choices=EMPLOYEE_TYPE_CHOICES)

    reporting_person = models.ForeignKey('self', on_delete=models.SET_NULL, null=True,blank=True, related_name='reporting_employees')

    def __str__(self):
        return f"{self.employee_id} - {self.employee_name}"
    

