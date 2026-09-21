from django.contrib import admin
from .models import Employee, ReportingManager,Team, Location

# Register your models here.
admin.site.register(Employee)
admin.site.register(ReportingManager)
admin.site.register(Team)
admin.site.register(Location)
