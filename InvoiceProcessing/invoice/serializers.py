from rest_framework import serializers,exceptions
from .models import Company, User, UpFile, GUIFile,Order,Draft
import json
from datetime import datetime
import os
import re

class InvoiceUpfileSerializer(serializers.ModelSerializer):
    supplier = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    creation_method = serializers.SerializerMethodField()
    files_name = serializers.SerializerMethodField()
    file_png = serializers.SerializerMethodField()
    invoice_number = serializers.SerializerMethodField()
    invoice_date = serializers.SerializerMethodField()
    due_date = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    class Meta:
        model = UpFile
        fields = ['id', 'timestamp', 'userid', 'uuid', "avatar","email","name",'file', "file_png",'files_name','supplier','invoice_date','due_date',"invoice_number","total","state","creation_method"]
    
    def get_file_png(self, obj):
        # 获取 file 字段的值
        file_path = obj.file.name
        # 修改文件扩展名为 .png
        if file_path.endswith('.pdf'):
            file_png_path = file_path[:-4] + '.png'
        else:
            file_png_path = file_path
        return file_png_path
    
    def get_files_name(self, obj):
        # 返回自定义的 file 字段
        # 这里你可以根据需求返回你想要的内容，例如文件的 URL，文件内容的哈希，或其他自定义数据
        file_name = os.path.basename(str(obj.file))
        file_stem = os.path.splitext(file_name)[0]
        return file_stem
    
    def get_avatar(self, obj):
        return obj.userid.avatar.url if obj.userid and obj.userid.avatar else None
    def get_email(self, obj):
        return obj.userid.email if obj.userid else None
    def get_name(self, obj):
        return obj.userid.name if obj.userid else None

    def parse_date(self, date_str):
        if not date_str:
            return ""

        # 使用正则表达式匹配 /Date(XXX)/ 格式
        match = re.match(r'/Date\((\d+)\+\d+\)/', date_str)
        if match:
            # 提取时间戳并转换为datetime对象
            timestamp = int(match.group(1))
            return datetime.utcfromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')
        else:
            try:
                # 处理 YYYY-MM-DD 格式的日期字符串
                return datetime.strptime(date_str, '%Y-%m-%d').strftime('%Y-%m-%d')
            except ValueError:
                raise ValueError("The date string format is not recognized")
        
    def get_file_data(self, obj):
        file_name = os.path.basename(str(obj.file))
        file_stem = os.path.splitext(file_name)[0]
        try:
            with open(f"staticfiles/{obj.userid.id}/{file_stem}.json", 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
        
    def get_invoice_date(self, obj): 
        data = self.get_file_data(obj)
        nested_form_data = data.get('invoiceForm', {}).get('invoiceDate', "")
        if not nested_form_data:
            nested_form_data = data.get('issue_date', "")
        return self.parse_date(nested_form_data)
        
    def get_due_date(self,obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('invoiceForm', {}).get('paymentDate', "")
        if not nested_form_data:
            nested_form_data = data.get('due_date', "")
        return self.parse_date(nested_form_data)

    def get_invoice_number(self, obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('form_data', {}).get('invoiceNumber', "")
        if not nested_form_data:
            nested_form_data = data.get('invoice_num', "")
        return nested_form_data
    
    def get_supplier(self, obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('form_data', {}).get('company_invoiced', {})
        if not nested_form_data:
            nested_form_data = data.get('client_company_name', "")
        return nested_form_data
    
    def get_total(self, obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('form_data', {}).get('total', {})
        if not nested_form_data:
            nested_form_data = data.get('total_amount', {})
        return nested_form_data
    
    def get_state(self, obj):
        if not obj.is_validated:
            return "unvalidated"
        if obj.is_validated and not obj.is_correct:
            return "Failed"
        if obj.is_validated and obj.is_correct:
            return "Passed"
        return "Unknown"  # 如果有其他状态可以添加此行作为默认值

    def get_creation_method(self, obj):
        if GUIFile.objects.filter(userid=obj.userid, uuid=obj.uuid).exists():
            return "gui"
        return "upload"

class DraftRecording(serializers.ModelSerializer):
    prograss = serializers.SerializerMethodField()
    class Meta:
        model = Draft
        fields = ['id','invoice_num','create_date','update_date','prograss']
    
    def get_prograss(self, obj):
        # 全部字段数量
        all_fields = [field.name for field in Draft._meta.get_fields()]
        total_fields = len(all_fields)
        
        # 为空的字段数量
        non_empty_fields = [field for field in all_fields if getattr(obj, field)]
        non_empty_count = len(non_empty_fields)
        # 计算百分比
        empty_percentage = (non_empty_count / total_fields) * 100
        return f"{empty_percentage:.2f}"
    
class UserInfoSerializer(serializers.ModelSerializer):
    # 你需要将company字段重定义为SerializerMethodField，而不是直接使用模型字段。这将确保在序列化时调用你定义的get_company方法。以下是修改后的代码：
    company = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'company', 'avatar', 'bio', 'is_staff', 'create_date', 'update_date',"login_date","join_company_date"]
        
    def get_company(self, obj):
            return obj.company.name if obj.company else None
        
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'avatar', 'bio']
        # extra_kwargs 设置各字段为可选。
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
            'name': {'required': False},
            'avatar': {'required': False},
            'bio': {'required': False}
        }
        
    # update 方法循环更新实例的每个字段并保存。
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class CompanySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Company
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    # company = serializers.ReadOnlyField(source='company.name') # 外键字段 只读
    
    class Meta:
        model = User
        fields = ['username','password','name','avatar','email',"confirm_password",'bio']
        extra_kwargs = {
            "id": {"read_only": True,},
            'password': {'write_only': True},
        }

    def validate_confirm_password(self, value):
        password = self.initial_data.get('password')
        if value != password:
            raise exceptions.ValidationError("Passwords do not match")
        return value
    
class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
      
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

# only data of uploading files need to be serialized
class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpFile
        fields = ['file','uuid']
"""    def create(self, validated_data):
        # Set is_validated to True when creating a new UpFile instance
        validated_data['is_validated'] = True
        return super().create(validated_data)"""
 
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['description', 'unçit_price', 'quantity', 'net', 'gst', 'amount']
               
class DraftGUISerializer(serializers.ModelSerializer):
    #invoice_name = serializers.CharField(required=True)
    invoice_num = serializers.CharField(required=True)
    userid = serializers.PrimaryKeyRelatedField(read_only=True)  # 设置为只读
    orders = OrderSerializer(many=True,required=False)
    issue_date = serializers.DateField(required=False,allow_null=True)
    due_date = serializers.DateField(required=False,allow_null=True)
    class Meta:
        # 使用draft而不是model
        model = Draft
        # fields = ["filename","uuid","userid",'invoice_num', 'company_name', 'address', 'country_name',"bank","bank_branch","account_num","bsb_num","account_name",'issue_date', "due_date",'terms', 'ABN', 'purchase_id', 'subtotal', 'qst_total', 'total_price', 'important_text', 'items', 'orders']
        fields = [
            "id",
            "invoice_name",  # 对应filename
            "uuid", 
            "userid", 
            "invoice_num", 
            "my_company_name",  # 对应company_name
            "my_address",  # 对应address
            "my_abn",
            "my_email",
            # "country_name",  # 模型中无对应字段
            "client_company_name",
            "client_address",
            "client_abn",
            "client_email",
            
            "bank_name",  # 对应bank
            "currency", 
            "account_num", 
            "bsb_num", 
            "account_name", 
            "issue_date", 
            "due_date", 

            "subtotal", 
            "gst_total",  # 对应qst_total
            "total_amount",  # 对应total_price
            "note",  # 对应important_text
            # "items",  # 模型中无对应字段
            "orders"
        ]
    def to_internal_value(self, data):
        if data.get('issue_date') == "":
            data['issue_date'] = None
        if data.get('due_date') == "":
            data['due_date'] = None
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        orders_data = validated_data.pop('orders', [])  # 如果 orders 不存在，设置为空列表
        guifile = Draft.objects.create(**validated_data)
        for order_data in orders_data:
            order = Order.objects.create(**order_data)
            guifile.orders.add(order)
        return guifile

    def update(self, instance, validated_data):
        orders_data = validated_data.pop('orders')
        instance.invoice_name = validated_data.get('invoice_name', instance.invoice_name)
        instance.uuid = validated_data.get('uuid', instance.uuid)
        instance.invoice_num = validated_data.get('invoice_num', instance.invoice_num)
        instance.my_company_name = validated_data.get('my_company_name', instance.my_company_name)
        instance.my_address = validated_data.get('my_address', instance.my_address)
        instance.my_email = validated_data.get('my_email', instance.my_email)
        instance.my_abn = validated_data.get('my_abn', instance.my_abn)
        
        instance.client_company_name = validated_data.get('client_company_name', instance.client_company_name)
        instance.client_abn = validated_data.get('client_abn', instance.client_abn)
        instance.client_address = validated_data.get('client_address', instance.client_address)
        instance.client_email = validated_data.get('client_email', instance.client_email)

        instance.bank_name = validated_data.get('bank_name', instance.bank_name) 
        instance.currency = validated_data.get('currency', instance.currency)
        instance.account_num = validated_data.get('account_num', instance.account_num)
        instance.bsb_num = validated_data.get('bsb_num', instance.bsb_num)
        instance.account_name = validated_data.get('account_name', instance.account_name)
            
        instance.issue_date = validated_data.get('issue_date', instance.issue_date)
        instance.due_date = validated_data.get('due_date', instance.due_date)



        instance.subtotal = validated_data.get('subtotal', instance.subtotal)
        instance.gst_total = validated_data.get('gst_total', instance.gst_total)
        instance.total_amount = validated_data.get('total_amount', instance.total_amount)
        instance.note = validated_data.get('note', instance.note)

        instance.save()

            
        instance.orders.clear()
        for order_data in orders_data:
            order = Order.objects.create(**order_data)
            instance.orders.add(order)
        
        return instance
    
class FileGUISerializer(serializers.ModelSerializer):
    invoice_name = serializers.CharField(required=True)
    uuid = serializers.CharField(required=True)
    userid = serializers.PrimaryKeyRelatedField(read_only=True)  # 设置为只读
    orders = OrderSerializer(many=True)
    class Meta:
        model = GUIFile
        # fields = ["filename","uuid","userid",'invoice_num', 'company_name', 'address', 'country_name',"bank","bank_branch","account_num","bsb_num","account_name",'issue_date', "due_date",'terms', 'ABN', 'purchase_id', 'subtotal', 'qst_total', 'total_price', 'important_text', 'items', 'orders']
        fields = [
            "invoice_name",  # 对应filename
            "uuid", 
            "userid", 
            "invoice_num", 
            "my_company_name",  # 对应company_name
            "my_address",  # 对应address
            "my_abn",
            "my_email",
            # "country_name",  # 模型中无对应字段
            "client_company_name",
            "client_address",
            "client_abn",
            "client_email",
            
            "bank_name",  # 对应bank
            "currency", 
            "account_num", 
            "bsb_num", 
            "account_name", 
            "issue_date", 
            "due_date", 

            "subtotal", 
            "gst_total",  # 对应qst_total
            "total_amount",  # 对应total_price
            "note",  # 对应important_text
            # "items",  # 模型中无对应字段
            "orders"
        ]



    def create(self, validated_data):
        orders_data = validated_data.pop('orders')
        guifile = GUIFile.objects.create(**validated_data)
        for order_data in orders_data:
            order = Order.objects.create(**order_data)
            guifile.orders.add(order)
        return guifile

    def update(self, instance, validated_data):
        orders_data = validated_data.pop('orders')
        instance.my_company_name = validated_data.get('my_company_name', instance.my_company_name)
        instance.my_address = validated_data.get('my_address', instance.my_address)
        instance.my_email = validated_data.get('my_email', instance.my_email)
        instance.my_abn = validated_data.get('my_abn', instance.my_abn)
        
        instance.client_company_name = validated_data.get('client_company_name', instance.client_company_name)
        instance.client_abn = validated_data.get('client_abn', instance.client_abn)
        instance.client_address = validated_data.get('client_address', instance.client_address)
        instance.client_email = validated_data.get('client_email', instance.client_email)

        instance.banbank_namek = validated_data.get('bank_name', instance.bank_name) 
        instance.currency = validated_data.get('currency', instance.currency)
        instance.account_num = validated_data.get('account_num', instance.account_num)
        instance.bsb_num = validated_data.get('bsb_num', instance.bsb_num)
        instance.account_name = validated_data.get('account_name', instance.account_name)
            
        instance.issue_date = validated_data.get('issue_date', instance.issue_date)
        instance.due_date = validated_data.get('due_date', instance.due_date)



        instance.subtotal = validated_data.get('subtotal', instance.subtotal)
        instance.gst_total = validated_data.get('gst_total', instance.gst_total)
        instance.total_amount = validated_data.get('total_amount', instance.total_amount)
        instance.note = validated_data.get('note', instance.note)

        instance.save()

            
        instance.orders.clear()
        for order_data in orders_data:
            order = Order.objects.create(**order_data)
            instance.orders.add(order)
        
        return instance

class FileDeletionSerializer(serializers.Serializer):
    file_name = serializers.CharField(required=True)
    uuid = serializers.CharField(required=True)  