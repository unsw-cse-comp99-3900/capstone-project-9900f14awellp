from rest_framework import serializers,exceptions
from .models import Company, User, UpFile
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
    def validate_password(self, value):
        return value
    
    def validate_confirm_password(self, value):
        password = self.initial_data.get('password')
        if value != password:
            raise exceptions.ValidationError("Passwords do not match")
        return value
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'




class FileUploadSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)
    class Meta():
        model = UpFile
        fields = ('file', 'title', 'timestamp')
