from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Company Name')
    # logo = models.ImageField(upload_to='company_logo/', verbose_name='Company Logo')
    logo = models.URLField(verbose_name='Company Logo',null=True, blank=True)
    phone_number = models.CharField(max_length=20, verbose_name='Company Phone Number')
    email = models.EmailField(verbose_name='Company Email')
    address = models.CharField(max_length=255, verbose_name='Company Address')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Create Date')
    update_date = models.DateTimeField(auto_now=True, verbose_name='Update Date')

    def __str__(self) -> str:
        return self.name
    
class User(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True, verbose_name='Username')
    password = models.CharField(max_length=255, verbose_name='Password')
    name = models.CharField(max_length=255, verbose_name='Name')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="employees",verbose_name='Company',null=True, blank=True)
    avatar = models.URLField(verbose_name='Avatar',null=True, blank=True)
    email = models.EmailField(unique=True, verbose_name='Email')
    token = models.CharField(max_length=255, verbose_name='Token',null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Create Date')
    update_date = models.DateTimeField(auto_now=True, verbose_name='Update Date')
    
    
    def __str__(self) -> str:
        return self.name