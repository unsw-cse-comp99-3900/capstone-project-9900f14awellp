from rest_framework import serializers,exceptions
from .models import Company, User, UpFile, GUIFile,Order
import json
from datetime import datetime
import os

class InvoiceUpfileSerializer(serializers.ModelSerializer):
    supplier = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    creation_method = serializers.SerializerMethodField()
    files_name = serializers.SerializerMethodField()
    invoice_number = serializers.SerializerMethodField()
    invoice_date = serializers.SerializerMethodField()
    due_date = serializers.SerializerMethodField()
    class Meta:
        model = UpFile
        fields = ['id', 'timestamp', 'userid', 'uuid', 'file','files_name','supplier','invoice_date','due_date',"invoice_number","total","state","creation_method"]
    
    
    def get_files_name(self, obj):
        # 返回自定义的 file 字段
        # 这里你可以根据需求返回你想要的内容，例如文件的 URL，文件内容的哈希，或其他自定义数据
        file_name = os.path.basename(str(obj.file))
        file_stem = os.path.splitext(file_name)[0]
        return file_stem
    
    def parse_date(self, date_str):
        # 提取时间戳
        if not date_str:
            raise ValueError("The date string is empty or None")

        timestamp = int(date_str.strip('/Date()').split('+')[0])
        
        # 转换为datetime对象
        return datetime.utcfromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')
    
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
        nested_form_data = data.get('invoiceForm', {})
        return self.parse_date(nested_form_data.get('invoiceDate', 'N/A'))
        
    def get_due_date(self,obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('invoiceForm', {})
        return self.parse_date(nested_form_data.get('paymentDate', 'N/A'))

    def get_invoice_number(self, obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('form_data', {})
        return nested_form_data.get('invoiceNumber', 'N/A') 
    
    def get_supplier(self, obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('form_data', {})
        return nested_form_data.get('company_invoiced', 'N/A')
    
    def get_total(self, obj):
        data = self.get_file_data(obj)
        nested_form_data = data.get('form_data', {})
        return nested_form_data.get('total', 'N/A')
    
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
    
class CompanySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Company
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    # company = serializers.ReadOnlyField(source='company.name') # 外键字段 只读
    
    class Meta:
        model = User
        fields = ['username','password','name','email',"confirm_password"]
        extra_kwargs = {
            "id": {"read_only": True,},
            'password': {'write_only': True},
        }
        
        
        """
        自定义验证方法 validate_<field_name> 会在调用 is_valid() 方法时自动被调用。
        """
    def validate_password(self, value):
        return value
    
    """
    value：在 validate_confirm_password 方法中value 是用户输入的 confirm_password 字段的值。
    因为这个方法的命名规则是 validate_<field_name>，DRF 会自动将 confirm_password 字段的值传递给 validate_confirm_password 方法。
    """
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
        fields = ['description', 'price', 'quantity', 'net', 'vat', 'gross']
               

class FileGUISerializer(serializers.ModelSerializer):
    filename = serializers.CharField(required=True)
    uuid = serializers.CharField(required=True)
    userid = serializers.PrimaryKeyRelatedField(read_only=True)  # 设置为只读
    orders = OrderSerializer(many=True)
    class Meta:
        model = GUIFile
        fields = ["filename","uuid","userid",'id', 'customer_name', 'address', 'country_name', 'manager', 'issue_date', 'terms', 'vat_number', 'purchase_id', 'subtotal', 'vat_total', 'total_price', 'important_text', 'items', 'orders']


    def create(self, validated_data):
        orders_data = validated_data.pop('orders')
        guifile = GUIFile.objects.create(**validated_data)
        for order_data in orders_data:
            order = Order.objects.create(**order_data)
            guifile.orders.add(order)
        return guifile

    def update(self, instance, validated_data):
        orders_data = validated_data.pop('orders')
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.address = validated_data.get('address', instance.address)
        instance.country_name = validated_data.get('country_name', instance.country_name)
        instance.manager = validated_data.get('manager', instance.manager)
        instance.issue_date = validated_data.get('issue_date', instance.issue_date)
        instance.terms = validated_data.get('terms', instance.terms)
        instance.vat_number = validated_data.get('vat_number', instance.vat_number)
        instance.purchase_id = validated_data.get('purchase_id', instance.purchase_id)
        instance.subtotal = validated_data.get('subtotal', instance.subtotal)
        instance.vat_total = validated_data.get('vat_total', instance.vat_total)
        instance.total_price = validated_data.get('total_price', instance.total_price)
        instance.important_text = validated_data.get('important_text', instance.important_text)
        instance.items = validated_data.get('items', instance.items)
        instance.save()

        """for order_data in orders_data:
            order = Order.objects.get(id=order_data['id'])
            order.description = order_data.get('description', order.description)
            order.price = order_data.get('price', order.price)
            order.quantity = order_data.get('quantity', order.quantity)
            order.net = order_data.get('net', order.net)
            order.vat = order_data.get('vat', order.vat)
            order.gross = order_data.get('gross', order.gross)
            order.save()"""
            
        instance.orders.clear()
        for order_data in orders_data:
            order = Order.objects.create(**order_data)
            instance.orders.add(order)
        
        return instance

class FileDeletionSerializer(serializers.Serializer):
    file_name = serializers.CharField(required=True)
    uuid = serializers.CharField(required=True)