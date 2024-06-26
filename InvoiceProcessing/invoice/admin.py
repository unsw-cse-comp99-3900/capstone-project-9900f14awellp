from django.contrib import admin
from .models import Company, User
# Register your models here.

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display=['name','email','phone_number']
    search_fields= list_display
    list_filter= list_display


class UserAdmin(admin.ModelAdmin):
    list_display=['name','email']
    list_filter=['name']
    
admin.site.register(User, UserAdmin)