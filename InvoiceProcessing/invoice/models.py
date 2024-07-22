from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


    
# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Company Name')
    # logo = models.ImageField(upload_to='company_logo/', verbose_name='Company Logo')
    logo = models.ImageField(upload_to='aqstar/', verbose_name='Aqstar',null=True, blank=True)
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
    aqstar = models.ImageField(upload_to='aqstar/', verbose_name='Aqstar',null=True, blank=True)
    email = models.EmailField(unique=True, verbose_name='Email')
    is_staff = models.BooleanField(default=False, verbose_name='Admin')
    reset_password_token = models.CharField(max_length=255, null=True, blank=True, verbose_name='Reset Password Token')
    reset_password_sent_at = models.DateTimeField(null=True, blank=True, verbose_name='Reset Password Sent At')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Create Date')
    update_date = models.DateTimeField(auto_now=True, verbose_name='Update Date')

    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

def user_directory_path(instance, filename):
    # 文件将上传到 MEDIA_ROOT/user_<id>/<filename>
    return 'staticfiles/{0}/{1}'.format(instance.userid.id, filename)
# use userid to bind user and file
class UpFile(models.Model):
    file = models.FileField(upload_to=user_directory_path)
    uuid = models.CharField(max_length=30)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,related_name="UserFiles",null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_validated = models.BooleanField(default=False)
    is_correct = models.BooleanField(default=False)
    
    
    class Meta:
        unique_together = ('userid', 'file')



class Order(models.Model):
    description = models.CharField(max_length=255)
    price = models.CharField(max_length=20)
    quantity = models.IntegerField()
    net = models.CharField(max_length=20)
    qst = models.CharField(max_length=10)
    gross = models.CharField(max_length=20)

    def __str__(self):
        return self.description
    def save(self, *args, **kwargs): 
        if not self.price.startswith('$'):
            self.price = f"\u0024{self.price}" 
        if not self.qst.startswith('$'):
            self.qst = f"\u0024{self.qst}"  
        if not self.net.startswith('$'):
            self.net = f"\u0024{self.net}"   
        if not self.gross.startswith('$'):
            self.gross = f"\u0024{self.gross}" 
               
        super().save(*args, **kwargs)
class GUIFile(models.Model):
    filename = models.CharField(max_length=30)
    uuid = models.CharField(max_length=30)
    file_id = models.CharField(max_length=20)
    company_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    country_name = models.CharField(max_length=100)
    
    bank = models.CharField(max_length=255)
    bank_branch = models.CharField(max_length=255)
    account_num = models.CharField(max_length=20)
    bsb_num = models.CharField(max_length=20)
    account_name = models.CharField(max_length=255)
    
    issue_date = models.DateField()
    due_date = models.DateField()
    terms = models.CharField(max_length=100)
    ABN = models.CharField(max_length=20)
    purchase_id = models.CharField(max_length=100)
    subtotal = models.CharField(max_length=20)
    qst_total = models.CharField(max_length=20)
    total_price = models.CharField(max_length=20)
    important_text = models.TextField()
    items = models.JSONField(default=list)
    orders = models.ManyToManyField(Order)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,related_name="GUIFiles",null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['file_id', 'userid'], name='unique_file_user')
        ]
        
    def __str__(self):
        return self.company_name

    def save(self, *args, **kwargs):
        if not self.subtotal.startswith('$'):
            self.subtotal = f"\u0024{self.subtotal}"
        if not self.qst_total.startswith('$'):
            self.qst_total = f"\u0024{self.qst_total}"
        if not self.total_price.startswith('$'):
            self.total_price = f"\u0024{self.total_price}"         
 
        super().save(*args, **kwargs)

