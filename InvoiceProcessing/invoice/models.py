from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone


def user_directory_path(instance, filename):
    # 文件将上传到 MEDIA_ROOT/user_<id>/<filename>
    return 'staticfiles/{0}/{1}'.format(instance.userid.id, filename)
    
# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Company Name')
    # logo = models.ImageField(upload_to='company_logo/', verbose_name='Company Logo')
    logo = models.ImageField(upload_to='staticfiles/avatar/', verbose_name='Aqstar',null=True, blank=True)
    phone_number = models.CharField(max_length=20, verbose_name='Company Phone Number')
    boss_id = models.OneToOneField('User', on_delete=models.CASCADE, related_name='employee', verbose_name='Company', null=True, blank=True)
    email = models.EmailField(verbose_name='Company Email')
    ABN = models.CharField(max_length=20, verbose_name='ABN')
    address = models.CharField(max_length=255, verbose_name='Company Address')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Create Date')
    update_date = models.DateTimeField(auto_now=True, verbose_name='Update Date')
    

    def __str__(self) -> str:
        return self.name
    
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)

    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD: username})
    
class User(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True, verbose_name='Username')
    password = models.CharField(max_length=255, verbose_name='Password')
    name = models.CharField(max_length=255, verbose_name='Name')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="employees",verbose_name='Company',null=True, blank=True)
    avatar = models.ImageField(upload_to="staticfiles/avatar/", verbose_name='Avatar',null=True, blank=True)
    email = models.EmailField(unique=True, verbose_name='Email')
    bio = models.TextField(verbose_name='Bio', default="Nothing")
    is_staff = models.BooleanField(default=False, verbose_name='Admin')
    reset_password_token = models.CharField(max_length=255, null=True, blank=True, verbose_name='Reset Password Token')
    reset_password_sent_at = models.DateTimeField(null=True, blank=True, verbose_name='Reset Password Sent At')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Create Date')
    update_date = models.DateTimeField(auto_now=True, verbose_name='Update Date')
    login_date = models.DateTimeField(auto_now=True, verbose_name='Login Date')  # 添加 login_date 字段
    join_company_date = models.DateTimeField(null=True, blank=True, verbose_name='Join Company Date')  # 添加 join_company_date 字段

    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

# use userid to bind user and file
class UpFile(models.Model):
    file = models.FileField(upload_to=user_directory_path)
    uuid = models.CharField(max_length=30)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,related_name="UserFiles",null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_validated = models.BooleanField(default=False)
    is_correct = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    create_date = models.DateTimeField(default=timezone.now, verbose_name='Create Date')
    validation_date = models.DateTimeField(verbose_name='Validation Date',null=True, blank=True)
    sending_date = models.DateTimeField(verbose_name='Validation Date',null=True, blank=True)
    email_receiver=models.CharField(max_length=30, default="", verbose_name='Email Receiver')
    
    class Meta:
        unique_together = ('userid', 'file')

class Order(models.Model):
    description = models.CharField(max_length=255,default="",null=True, blank=True)
    unit_price = models.CharField(max_length=20,default="",null=True, blank=True)
    quantity = models.IntegerField(default=0,null=True, blank=True)
    net = models.CharField(max_length=20,default="",null=True, blank=True)
    gst = models.CharField(max_length=10,default="",null=True, blank=True)
    amount = models.CharField(max_length=20,default="",null=True, blank=True)

    def __str__(self):
        return self.description
    def save(self, *args, **kwargs): 
        if self.unit_price and not self.unit_price.startswith('$'):
            self.unit_price = f"\u0024{self.unit_price}" 
        if self.net and not self.net.startswith('$'):
            self.net = f"\u0024{self.net}"   
        if self.amount and not self.amount.startswith('$'):
            self.amount = f"\u0024{self.amount}" 
            
        super().save(*args, **kwargs)
      
# 保存draft记录  
class Draft(models.Model):
    invoice_name = models.CharField(max_length=30,default="",null=True, blank=True)
    uuid = models.CharField(max_length=100,default="",null=True, blank=True)
    invoice_num = models.CharField(max_length=20,unique=True,null=True, blank=True)
    my_company_name = models.CharField(max_length=255,default="",null=True, blank=True)
    my_address = models.CharField(max_length=255,default="",null=True, blank=True)
    my_abn = models.CharField(max_length=20,default="",null=True, blank=True)
    my_email = models.EmailField(default="",null=True, blank=True)
    
    client_company_name = models.CharField(max_length=100,default="",null=True, blank=True)
    client_address = models.CharField(max_length=100,default="",null=True, blank=True)
    client_abn = models.CharField(max_length=100,default="",null=True, blank=True)
    client_email = models.EmailField(default="",null=True, blank=True)
    
    bank_name = models.CharField(max_length=255,default="",null=True, blank=True)
    currency = models.CharField(max_length=255,default="",null=True, blank=True)
    account_num = models.CharField(max_length=20,default="",null=True, blank=True)
    bsb_num = models.CharField(max_length=20,default="",null=True, blank=True)
    account_name = models.CharField(max_length=255,default="",null=True, blank=True)
    
    issue_date = models.DateField(default=None,blank=True, null=True)
    due_date = models.DateField(default=None,blank=True, null=True)
    

    subtotal = models.CharField(max_length=20,default="",null=True, blank=True)
    gst_total = models.CharField(max_length=20,default="",null=True, blank=True)
    total_amount = models.CharField(max_length=20,default="",null=True, blank=True)
    note = models.TextField(default="",null=True, blank=True)

    orders = models.ManyToManyField(Order,null=True, blank=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,related_name="GUIFileDraf",null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Create Date')
    update_date = models.DateTimeField(auto_now=True, verbose_name='Update Date')



    def save(self, *args, **kwargs):
        if not self.subtotal.startswith('$'):
            self.subtotal = f"\u0024{self.subtotal}"
        if not self.gst_total.startswith('$'):
            self.gst_total = f"\u0024{self.gst_total}"
        if not self.total_amount.startswith('$'):
            self.total_amount = f"\u0024{self.total_amount}"         
 
        super().save(*args, **kwargs)  
    
class GUIFile(models.Model):
    invoice_name = models.CharField(max_length=30)
    uuid = models.CharField(max_length=30)
    invoice_num = models.CharField(max_length=20)
    my_company_name = models.CharField(max_length=255)
    my_address = models.CharField(max_length=255)
    my_abn = models.CharField(max_length=20)
    my_email = models.EmailField()
    
    
    client_company_name = models.CharField(max_length=100)
    client_address = models.CharField(max_length=100)
    client_abn = models.CharField(max_length=100)
    client_email = models.EmailField(default="")
    
    bank_name = models.CharField(max_length=255)
    currency = models.CharField(max_length=255)
    account_num = models.CharField(max_length=20)
    bsb_num = models.CharField(max_length=20)
    account_name = models.CharField(max_length=255)
    
    issue_date = models.DateField()
    due_date = models.DateField()
    

    subtotal = models.CharField(max_length=20)
    gst_total = models.CharField(max_length=20)
    total_amount = models.CharField(max_length=20)
    note = models.TextField(default="")

    orders = models.ManyToManyField(Order)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,related_name="GUIFiles",null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['invoice_name', 'userid'], name='unique_file_user')
        ]

    def save(self, *args, **kwargs):
        if not self.subtotal.startswith('$'):
            self.subtotal = f"\u0024{self.subtotal}"
        if not self.gst_total.startswith('$'):
            self.gst_total = f"\u0024{self.gst_total}"
        if not self.total_amount.startswith('$'):
            self.total_amount = f"\u0024{self.total_amount}"         
 
        super().save(*args, **kwargs)