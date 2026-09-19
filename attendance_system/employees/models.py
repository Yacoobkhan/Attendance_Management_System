from django.db import models

# Create your models here.
class Employee(models.Model):

    EMPLOYEE_TYPE_CHOICES = [
        ('EMPLOYEE', 'Employee'),
        ('INTERN', 'Intern'),
    ]

    employee_id = models.IntegerField(unique=True,blank=True,null=True)
    employee_name = models.CharField(max_length = 100)
    dob = models.DateField()
    role = models.CharField(max_length = 100)
    phone = models.CharField(max_length = 15)
    mail = models.EmailField(unique=True)
    joining_date = models.DateField()
    is_active = models.BooleanField(default=True)

    employee_type = models.CharField(max_length=20,choices=EMPLOYEE_TYPE_CHOICES)

    reporting_person = models.CharField( max_length=100, blank=True, null=True)


    def save(self,*args,**kwargs):

        if not self.employee_id:
            last_employee = Employee.objects.order_by('-employee_id').first()

            if last_employee:
                self.employee_id = last_employee.employee_id + 1
            else:
                self.employee_id = 1001

        super().save(*args,**kwargs)

    def __str__(self):
        return f"{self.employee_id} - {self.employee_name}"
    

