from rest_framework import serializers,exceptions
from .models import Company, User, UpFile, GUIFile
from django import forms

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
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
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
        fields = '__all__'
        
class FileGUISerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    class Meta:
        model = GUIFile
        fields = '__all__'
