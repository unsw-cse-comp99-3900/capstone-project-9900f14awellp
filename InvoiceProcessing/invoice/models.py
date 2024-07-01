from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Company Name')
    # logo = models.ImageField(upload_to='company_logo/', verbose_name='Company Logo')
    logo = models.ImageField(upload_to='avatar/', verbose_name='Avatar',null=True, blank=True)
    phone_number = models.CharField(max_length=20, verbose_name='Company Phone Number')
    boss_id = models.OneToOneField('User', on_delete=models.CASCADE, related_name='employee', verbose_name='Company', null=True, blank=True)
    email = models.EmailField(verbose_name='Company Email')
    ABN = models.CharField(max_length=20, verbose_name='ABN')
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
    avatar = models.ImageField(upload_to='avatar/', verbose_name='Avatar',null=True, blank=True)
    email = models.EmailField(unique=True, verbose_name='Email')
    is_admin = models.BooleanField(default=False, verbose_name='Admin')
    token = models.CharField(max_length=255, verbose_name='Token',null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Create Date')
    update_date = models.DateTimeField(auto_now=True, verbose_name='Update Date')


# use userid to bind user and file
class UpFile(models.Model):
    file = models.FileField(upload_to="invoices_files/",blank=True, null=False)
    title = models.CharField(max_length=30)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,related_name="UserFiles",null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
class GUIFile(models.Model):
    title = models.CharField(max_length=30)
    abn = models.CharField(max_length=20, verbose_name='ABN')
    additional_request = models.CharField(max_length=255, verbose_name='Additional Request',null=True, blank=True)
    approver = models.CharField(max_length=255, verbose_name='Additional Request',null=True, blank=True) # 审批人，当前为空，表示没有指定审批人。
    approver_email = models.EmailField(verbose_name='Approver Email',null=True, blank=True)
    bPayRef = models.CharField(max_length=255, verbose_name='bPay Reference',null=True, blank=True)# BPay参考号码，当前为空，BPay是澳大利亚的一个电子支付系统。
    bPaycode = models.CharField(max_length=255, verbose_name='bPay Code',null=True, blank=True)# BPay代码，当前为空。
    bankAccount = models.CharField(max_length=255, verbose_name='Bank Account',null=True, blank=True)
    bankBranch = models.CharField(max_length=255, verbose_name='Bank Branch',null=True, blank=True)
    bank_details = models.CharField(max_length=255, verbose_name='Bank Details',null=True, blank=True)
    changed = models.BooleanField(default=True, verbose_name='Changed')
    charge = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Charge', default=0.0)
    company_invoiced = models.CharField(max_length=255, verbose_name='Company Invoiced',null=True, blank=True) # 开票公司，当前为空字符串，表示没有指定开票公司。
    delivery_to = models.CharField(max_length=255, verbose_name='Delivery To',null=True, blank=True) # 送达对象，当前为空，表示没有指定送达对象。
    delivery_to_address = models.CharField(max_length=255, verbose_name='Delivery To Address',null=True, blank=True) # 送达地址，当前为空，表示没有指定送达地址。
    description = models.CharField(max_length=255, verbose_name='Description',null=True, blank=True)
    document_subtype = models.IntegerField(verbose_name='Document Subtype',default=1)
    email = models.EmailField(verbose_name='Email',null=True, blank=True)
    email_to = models.EmailField(verbose_name='Email',null=True, blank=True)
    expense_claim = models.CharField(max_length=255, verbose_name='Expense Claim',null=True, blank=True) # 报销声明，当前为空。
    from_email = models.EmailField(verbose_name='From Email',null=True, blank=True)
    glcode_option = models.CharField(max_length=255, verbose_name='GL Code Option',null=True, blank=True) # 总账代码选项，当前为空。
    glcode_text = models.CharField(max_length=255, verbose_name='GL Code Text',null=True, blank=True) # 总账代码文本，当前为空。
    invoiceDate = models.DateTimeField(verbose_name='Invoice Date',null=True, blank=True) # 发票日期，以时间戳格式表示。这里的时间戳表示2024年7月1日。
    invoiceNumber = models.CharField(max_length=255, verbose_name='Invoice Number',null=True, blank=True) # 发票号码，当前为空。
    invoice_to = models.CharField(max_length=255, verbose_name='Invoice To',null=True, blank=True) # 发票收款方，当前为空。
    invoice_to_address = models.CharField(max_length=255, verbose_name='Invoice To Address',null=True, blank=True) # 发票收款方地址，当前为空。
    location = models.CharField(max_length=255, verbose_name='Location',null=True, blank=True) # 地点，当前为空。
    purchaseOrder = models.CharField(max_length=255, verbose_name='Purchase Order',null=True, blank=True) # 采购订单，当前为空。
    require_bank_details = models.BooleanField(default=False, verbose_name='Require Bank Details')
    require_email = models.BooleanField(default=False, verbose_name='Require Email')
    supplier = models.CharField(max_length=255, verbose_name='Supplier',null=True, blank=True) # 供应商，当前为空。
    supplier_address = models.CharField(max_length=255, verbose_name='Supplier Address',null=True, blank=True) # 供应商地址，当前为空。
    supplier_id = models.CharField(max_length=255, verbose_name='Supplier ID',null=True, blank=True) # 供应商ID，当前为空。
    tax = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Tax', default=0.0)
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Total', default=0.0)
    tracking = models.CharField(max_length=255, verbose_name='Tracking',null=True, blank=True) # 跟踪号码，当前为空。
    tracking_option = models.CharField(max_length=255, verbose_name='Tracking Option',null=True, blank=True) # 跟踪号码选项，当前为空。
    userid = models.ForeignKey(User, on_delete=models.CASCADE,related_name="GUIFiles",null=True, blank=True)

    pass