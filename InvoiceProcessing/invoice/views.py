from django.shortcuts import render
import json
import os
import base64
import hashlib
import requests
import subprocess
from time import sleep
from types import SimpleNamespace
import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime
import fitz  # PyMuPDF

from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.conf import settings
from django.db.models.signals import post_save # 用户已经建好了，才触发generate_token函数生成token
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.core.validators import validate_email, ValidationError
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import authenticate
from django.urls import reverse
from django.utils.timezone import now
from django.db import IntegrityError

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

#from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser

from .serializers import CompanySerializer,RegisterSerializer,\
                        FileUploadSerializer, FileGUISerializer, PasswordResetSerializer, InvoiceUpfileSerializer,\
                        UserInfoSerializer,UserUpdateSerializer,DraftGUISerializer, DraftRecording
from .models import Company, User, UpFile, GUIFile,Draft
from .converter import converter_xml
from .permission import IsAdminUser,CompanyWorker
# Create your views here.
user_directory = os.path.join(settings.STATICFILES_DIRS[0])

# 用户注册
class RegisterView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []
    
    @swagger_auto_schema(
        operation_summary='用户注册说明',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='User Name'
                ),
                'password': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='User Password'
                ),
                'name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Nick Name'
                ),
                'email': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='User Email'
                ),
                'confirm_password': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Confirm Password'
                ),
                'avatar': openapi.Schema(
                    type=openapi.TYPE_FILE,
                    description='User Avatar',
                    nullable=True
                ),
                'bio': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='User Bio',
                    nullable=True
                )
            }
        ),
        responses={
            201: openapi.Response(
                description="Register success",
                examples={
                    "application/json": {
                        "state": "Register success",
                        "username": "example_user",
                        "password": "hashed_password",
                        "userid": 1,
                        "token": "some-uuid-token"
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request",
                examples={
                    "application/json": {
                        "username": ["This field is required."],
                        "password": ["This field is required."],
                        "email": ["This field is required."],
                        "confirm_password": ["This field is required."]
                    }
                }
            )
        }
    )
    def post(self, request):
        ser = RegisterSerializer(data=request.data)

        if User.objects.filter(username=request.data.get('username')).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if request.data.get('password') != request.data.get('confirm_password'):
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_email(request.data.get('email'))
        except ValidationError:
            return Response({"error": "Please enter a valid email address."}, status=status.HTTP_400_BAD_REQUEST)
        
        if ser.is_valid():
            ser.validated_data.pop('confirm_password')
            ser.validated_data['password'] = make_password(ser.validated_data['password'])
            ser.save()
            instance = User.objects.filter(email=ser.validated_data.get('email')).first()
            refresh = RefreshToken.for_user(instance)
            os.makedirs(os.path.join(user_directory,str(instance.id)), exist_ok=True)
            return Response({"state":"Register success",
                            'username':instance.username,
                            'password':instance.password,
                            'userid':instance.id,
                            'bio':instance.bio,
                            'refresh': str(refresh),
                            'access': str(refresh.access_token)}, 
                            status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    
# 用户登录
class LoginView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []
    
    @swagger_auto_schema(
        operation_summary='用户登录说明',
        manual_parameters=[
            openapi.Parameter(
                'username', openapi.IN_QUERY, description="User Name", type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                'password', openapi.IN_QUERY, description="User Password", type=openapi.TYPE_STRING, required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="Login success",
                examples={
                    "application/json": {
                        "state": "Login success",
                        "userid": 1,
                        "token": "some-token-value"
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request",
                examples={
                    "application/json": {
                        "username": ["This field is required."],
                        "password": ["This field is required."]
                    }
                }
            ),
            401: openapi.Response(
                description="Unauthorized",
                examples={
                    "application/json": {
                        "error": "This user does not exist"
                    },
                    "application/json": {
                        "error": "Password does not match"
                    }
                }
            )
        }
    )
    def post(self, request):
        username = request.query_params.get('username')
        password = request.query_params.get('password')
        if not username or not password:
            return Response({'username': ['This field is required.'], 'password': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        
        if user is not None:
            user.login_date = datetime.now()
            user.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'state':"Login success",
                'userid':user.id,
                'company_id':user.company_id,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin':user.is_staff,
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'User not exists or password is wrong, please check your input.'}, status=status.HTTP_401_UNAUTHORIZED)
    

class UserInfo(APIView):
    authentication_classes = [JWTAuthentication]


    @swagger_auto_schema(
        operation_summary='获取用户信息',
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="用户 ID, not required, 如果标注id则会返回具体这个id对应的用户信息, 不标注则会返回当前用户",
                type=openapi.TYPE_INTEGER
            )
        ],
        responses={200: UserInfoSerializer}
    )
    def get(self, request):
        id = request.GET.get('id')
        if not id:
            user = request.user
        else:
            user = User.objects.filter(id=id).first()
        serializer = UserInfoSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        operation_summary='更新用户信息',
        request_body=UserUpdateSerializer,
        responses={
            200: UserInfoSerializer(),
            400: openapi.Response(
                description="Bad request",
                examples={"application/json": {"error": "Validation errors"}}
            )
        }
    )
    def post(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleterUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    
    @swagger_auto_schema(
        operation_summary='删除用户',
        operation_description='根据用户名删除用户',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='User Name')
            },
            required=['username']
        ),
        responses={
            200: openapi.Response(description='User deleted successfully', examples={
                'application/json': {'success': 'User deleted successfully'}
            }),
            400: openapi.Response(description='Bad request', examples={
                'application/json': {'error': 'username field is required'}
            }),
            404: openapi.Response(description='User not found', examples={
                'application/json': {'error': 'User does not exist'}
            })
        }
    )
    def post(self, request):
        username = request.data.get('username', None)
        if not username:
            return Response({'error': 'username field is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({'success': 'User deleted successfully'}, status=status.HTTP_200_OK)

    
class CreateCompanyView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    @swagger_auto_schema(
        operation_summary='用户创建公司说明(因为swagger无法上传file, 这里建议使用postman测试)',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Company Name'
                ),
                'phone_number': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Company Phone Number'
                ),
                'email': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Company Email'
                ),
                'ABN': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Company ABN'
                ),
                'address': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Company Address'
                ),
            }
        ),
        responses={
            201: openapi.Response(
                description="Company created successfully",
                examples={
                    "application/json": {
                        "name": "Example Company",
                        "phone_number": "123456789",
                        "email": "example@company.com",
                        "ABN": "12345678901",
                        "address": "123 Example Street"
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request",
                examples={
                    "application/json": {
                        "name": ["This field is required."],
                        "phone_number": ["This field is required."],
                        "email": ["This field is required."],
                        "ABN": ["This field is required."],
                        "address": ["This field is required."]
                    }
                }
            )
        }
    )

    def post(self, request):
        ser = CompanySerializer(data=request.data)
        if ser.is_valid() and not Company.objects.filter(name=request.data.get('name')).first():
            validated_data = ser.validated_data
            company = Company(
                name=validated_data['name'],
                phone_number=validated_data['phone_number'],
                email=validated_data['email'],
                ABN = validated_data['ABN'],
                address=validated_data['address'],
                boss_id=request.user,  # 将 boss_id 设置为当前用户
            )
            company.save()
            request.user.company = company
            request.user.join_company_date = datetime.now()
            request.user.is_staff = True
            request.user.save()

            return Response({"success": "Company created successfully"}, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyWorkersInfo(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, CompanyWorker]

    @swagger_auto_schema(
        operation_summary='获取公司员工信息',
        responses={
            200: openapi.Response(
                description="成功获取公司员工信息",
                schema=UserInfoSerializer(many=True)
            ),
            401: openapi.Response(
                description="未经授权",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                }
            ),
            403: openapi.Response(
                description="权限不足",
                examples={
                    "application/json": {
                        "detail": "You do not have permission to perform this action."
                    }
                }
            )
        }
    )
    def get(self,request):
        company_id = request.user.company_id
        workers = User.objects.filter(company_id=company_id)
        
        serializer = UserInfoSerializer(workers, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    @swagger_auto_schema(
        operation_summary='更新用户信息（提升或解雇）',
        manual_parameters=[
            openapi.Parameter(
                'id', openapi.IN_QUERY, description="用户 ID", type=openapi.TYPE_INTEGER, required=True
            ),
            openapi.Parameter(
                'promotion', openapi.IN_QUERY, description="提升用户为管理员（任何值表示提升）", type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                'fire', openapi.IN_QUERY, description="解雇用户（任何值表示解雇）", type=openapi.TYPE_STRING, required=False
            )
        ],
        responses={
            200: openapi.Response(
                description="用户信息更新成功",
                examples={
                    "application/json": {
                        "message": "User updated successfully"
                    }
                }
            ),
            400: openapi.Response(
                description="请求无效",
                examples={
                    "application/json": {
                        "error": "id field is required"
                    }
                }
            ),
            404: openapi.Response(
                description="用户不存在",
                examples={
                    "application/json": {
                        "error": "User does not exist"
                    }
                }
            )
        }
    )
    def post(self,request):
        userid = request.GET.get('id')
        promotion = request.GET.get('promotion')
        fire = request.GET.get('fire')
        if not userid:
            return Response({'error': 'id field is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(id=userid, company_id=request.user.company_id).first()
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        if promotion:
            user.is_staff = True
        elif fire:
            user.is_staff = False
            user.company_id = None
            Draft.objects.filter(userid=user.id).delete()
            
            
        user.save()
        return Response({'success': 'User updated successfully'}, status=status.HTTP_200_OK)

        
class JoinCompanyView(APIView):
    permission_classes = [IsAuthenticated,]
    # permission_classes = [IsAdminUser] # 判断 is_staff 是不是1
    authentication_classes = [JWTAuthentication]
    
    @swagger_auto_schema(
        operation_summary="获取所有公司的名称",
        operation_description="返回一个包含所有公司名称的列表",
        responses={
            200: openapi.Response(
                description="成功返回公司名称列表",
                examples={
                    "application/json": [
                        "Company A",
                        "Company B",
                        "Company C"
                    ]
                }
            ),
            401: openapi.Response(
                description="未授权",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                }
            ),
            500: openapi.Response(
                description="服务器内部错误",
                examples={
                    "application/json": {
                        "detail": "Internal server error."
                    }
                }
            )
        }
    )
    def get(self,request):

        company_names = Company.objects.values_list('name', flat=True)
        return Response(list(company_names), status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_summary='用户加入公司说明',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'company_name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Company Name'
                ),
            }
        ),
        responses={
            200: openapi.Response(
                description="成功加入公司",
                examples={
                    "application/json": {
                        "success": "Joined the company successfully"
                    }
                }
            ),
            400: openapi.Response(
                description="请求错误",
                examples={
                    "application/json": {
                        "error": "company_name field is required"
                    }
                }
            ),
            404: openapi.Response(
                description="公司不存在",
                examples={
                    "application/json": {
                        "error": "Company does not exist"
                    }
                }
            )
        }
    )
    def post(self, request):
        company_name = request.data.get('company_name')
        if not company_name:
            return Response({'error': 'company_name field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            company = Company.objects.get(name=company_name)
        except Company.DoesNotExist:
            return Response({'error': 'Company does not exist'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_staff:
            return Response({'error': 'You have created a company, you cannot join another company.'}, status=status.HTTP_400_BAD_REQUEST)
        # 暂时先不处理[重复加入公司的情况，用户后面再加上
        request.user.company = company
        request.user.join_company_date = datetime.now()
        request.user.save()
        return Response({'success': 'Joined the company successfully'}, status=status.HTTP_200_OK)

# for uploading and downloading files
class UpFileAPIView(APIView):
    # authentication_classes = [MyAhenAuthentication]
    authentication_classes = [JWTAuthentication]
    #parser_classes = (MultiPartParser, FormParser)

    @swagger_auto_schema(
        operation_summary='用户发票上传说明',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'file': openapi.Schema(
                    type=openapi.TYPE_FILE,
                    description='File Upload'
                ),
                'uuid': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='File ID'
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="File uploaded successfully",
                examples={
                    "application/json": {
                        "code": 0,
                        "msg": "success!",
                        "data": {
                            "file": "uploaded_file.pdf",
                            "uuid": "some-uuid"
                        }
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "File ID exists"
                    },
                    "application/json": {
                        "file": ["This field is required."],
                        "uuid": ["This field is required."]
                    }
                }
            )
        }
    )
    def post(self, request):
        if request.user.company == None:
            return Response({"code": 400, "msg": "Please create a company or join a company first."}, status=status.HTTP_400_BAD_REQUEST)
        file_serializer = FileUploadSerializer(data=request.data)
        if file_serializer.is_valid():
            uuid = file_serializer.validated_data.get('uuid')
            filename = file_serializer.validated_data.get('file')
            if UpFile.objects.filter(userid=request.user.id, file=f"staticfiles/{request.user.id}/{filename}").exists():
                return Response({
                    "code": 400,
                    "msg": "File name exists for this user",
                }, status=status.HTTP_400_BAD_REQUEST)

            if UpFile.objects.filter(uuid=uuid).exists():
                return Response({
                    "code": 400,
                    "msg": "File ID exists",
                }, status=status.HTTP_400_BAD_REQUEST)
            file_serializer.save(userid=request.user)
            
            # 上传的pdf文件直接转化为json和xml文件
            file = UpFile.objects.filter(userid=request.user, uuid=uuid).first()
            # 异步处理pdf文件
            # extract_pdf_data.delay(str(file.file),request.user.id)
            file_name = os.path.basename(str(file.file))
            file_stem = os.path.splitext(file_name)[0]
            
            # 1.将json文件转化为xml，for Later validation
            if str(file.file).endswith('.json'):
                    with open(str(file.file), 'r') as f:
                        data = json.load(f)
                        # json -> xml
                        xml_elem = json_to_xml(data)
                        xml_str = prettify(xml_elem)
                    with open(f"staticfiles/{request.user.id}/{file_stem}.xml", "w", encoding="utf-8") as f:
                        f.write(xml_str)
                    converter_xml(f"staticfiles/{request.user.id}/{file_stem}.xml")
            elif str(file.file).endswith('.pdf'):
                url = 'https://app.ezzydoc.com/EzzyService.svc/Rest'
                api_key = {'APIKey': 'aeff7b2f-3554-45ee-8d36-cc6fd5984c28'}
                payload = {'user': 'xxxx',
                        'pwd': 'Xxxx1234',
                        'APIKey': 'aeff7b2f-3554-45ee-8d36-cc6fd5984c28'}
                # 保留cookie
                r = requests.get(url + '/Login', params=payload)
                
                # 1.2 上传pdf文件
                with open(str(file.file), 'rb') as img_file:
                    img_name = f"{file_stem}.pdf"
                    data = img_file.read()
                    b = bytearray(data)
                    li = []
                    for i in b:
                        li.append(i)
                    raw_data = {"PictureName": img_name, "PictureStream": li}
                    json_data = json.dumps(raw_data)
                    r2 = requests.post("https://app.ezzydoc.com/EzzyService.svc/Rest/uploadInvoiceImage",
                                    data=json_data,
                                    cookies=r.cookies,
                                    params=api_key,
                                    headers={'Content-Type': 'application/json'})
                    invoiceID = str(r2.json().get("invoice_id"))
                # 1.3 获得传回的json数据
                payload2 = {'invoiceid':invoiceID,
                            'APIKey': 'aeff7b2f-3554-45ee-8d36-cc6fd5984c28'}
            
                sleep(60)
                r3 = requests.get(url + '/getFormData', cookies=r.cookies,params=payload2)
                r4 = requests.get(url + '/getInvoiceHeaderBlocks', cookies=r.cookies,params=payload2)

                if r3.status_code == 200:
                    form_data = r3.json().get('form_data', {})
                    invoiceForm = r4.json().get('invoiceForm', {})
                    table = r4.json().get('table', {})
                    combined_data = {
                        "form_data": form_data,
                        "invoiceForm": invoiceForm,
                        "table": table,

                    }

                    with open(f"staticfiles/{request.user.id}/{file_stem}.json", "w", encoding="utf-8") as f:
                        json.dump(combined_data, f, ensure_ascii=False, indent=4)
                        
                    xml_elem = json_to_xml(combined_data)
                    xml_str = prettify(xml_elem)
                    with open(f"staticfiles/{request.user.id}/{file_stem}.xml", "w", encoding="utf-8") as f:
                        f.write(xml_str)
                    converter_xml(f"staticfiles/{request.user.id}/{file_stem}.xml")
                    
            return Response({
                                "code": 0,
                                "msg": "success!",
                                "data": file_serializer.data
                            },
                            status=status.HTTP_200_OK
                            )
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary='获取用户上传的发票文件路径',
        manual_parameters=[
            openapi.Parameter(
                name='uuid',
                in_=openapi.IN_QUERY,
                description='File ID',
                type=openapi.TYPE_STRING
            )
        ],
        responses={
            200: openapi.Response(
                description="成功获取文件路径",
                examples={
                    "application/json": {
                        "file_url": "http://example.com/media/uploaded_file.pdf"
                    }
                }
            ),
            400: openapi.Response(
                description="请求错误",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "File ID is required"
                    }
                }
            ),
            404: openapi.Response(
                description="文件未找到",
                examples={
                    "application/json": {
                        "code": 404,
                        "msg": "file not found"
                    }
                }
            )
        }
    )
    def get(self,request):
        uuid = request.GET.get('uuid')
        if not uuid:
            return Response({
                                "code": 400,
                                "msg": "File ID is required",
                            },
                            status=status.HTTP_400_BAD_REQUEST)
        
        file = UpFile.objects.filter(userid=request.user, uuid=uuid).first()
        if file is None or file.file is None :
            return Response({
                                "code": 404,
                                "msg": "file not found",
                            },
                            status=status.HTTP_404_NOT_FOUND
                            )
        file_url = file.file.url
        # 把pdf内容当成乱码返回
        """response = FileResponse(file_iterator(str(file.file)))
        response['Content-Type'] = 'application/octet-stream'
        # Content-Disposition就是当用户想把请求所得的内容存为一个文件的时候提供一个默认的文件名
        response['Content-Disposition'] = f'attachment; filename="{file.file.name}"'"""
        return JsonResponse({'file_url': file_url})
        """return Response({
            "code":200,
            "msg":"success",
        })"""
        
        
        


def pdf_to_png(pdf_path, output_dir):
    # 打开PDF文件
    pdf_document = fitz.open(pdf_path)
    for page_number in range(len(pdf_document)):
        # 获取页面
        page = pdf_document.load_page(page_number)
        # 将页面转换为图像
        pix = page.get_pixmap()
        # 保存图像为PNG文件
        image_path = os.path.join(output_dir)
        pix.save(image_path)
    pdf_document.close()


class GUIFileAPIView(APIView):
    # authentication_classes = [MyAhenAuthentication]
    authentication_classes = [JWTAuthentication]
    permission_classes = [CompanyWorker]
    @swagger_auto_schema(
        operation_summary='创建新的用户发票GUI文件',
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="发票id,不是uuid, 用于删除draft记录,",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                'date',
                openapi.IN_QUERY,
                description="文件的创建日期 (2024-07-31 20:56:26.798927),不填则默认为当前时间",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'invoice_name': openapi.Schema(type=openapi.TYPE_STRING, description='发票名称'),
                'uuid': openapi.Schema(type=openapi.TYPE_STRING, description='UUID'),
                'invoice_num': openapi.Schema(type=openapi.TYPE_STRING, description='发票编号'),
                'my_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='公司名称'),
                'my_address': openapi.Schema(type=openapi.TYPE_STRING, description='公司地址'),
                'my_abn': openapi.Schema(type=openapi.TYPE_STRING, description='公司ABN'),
                'my_email': openapi.Schema(type=openapi.TYPE_STRING, description='公司邮箱'),
                'client_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='客户公司名称'),
                'client_address': openapi.Schema(type=openapi.TYPE_STRING, description='客户地址'),
                'client_abn': openapi.Schema(type=openapi.TYPE_STRING, description='客户ABN'),
                'client_email': openapi.Schema(type=openapi.TYPE_STRING, description='客户邮箱'),
                'bank_name': openapi.Schema(type=openapi.TYPE_STRING, description='银行名称'),
                'currency': openapi.Schema(type=openapi.TYPE_STRING, description='货币种类'),
                'account_num': openapi.Schema(type=openapi.TYPE_STRING, description='账户号码'),
                'bsb_num': openapi.Schema(type=openapi.TYPE_STRING, description='BSB号码'),
                'account_name': openapi.Schema(type=openapi.TYPE_STRING, description='账户名称'),
                'issue_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='发行日期'),
                'due_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='到期日期'),
                'subtotal': openapi.Schema(type=openapi.TYPE_STRING, description='小计'),
                'gst_total': openapi.Schema(type=openapi.TYPE_STRING, description='GST总计'),
                'total_amount': openapi.Schema(type=openapi.TYPE_STRING, description='总金额'),
                'note': openapi.Schema(type=openapi.TYPE_STRING, description='备注'),
                'orders': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_OBJECT, properties={
                        'description': openapi.Schema(type=openapi.TYPE_STRING, description='描述'),
                        'unit_price': openapi.Schema(type=openapi.TYPE_STRING, description='单价'),
                        'quantity': openapi.Schema(type=openapi.TYPE_INTEGER, description='数量'),
                        'net': openapi.Schema(type=openapi.TYPE_STRING, description='净价'),
                        'gst': openapi.Schema(type=openapi.TYPE_STRING, description='GST'),
                        'amount': openapi.Schema(type=openapi.TYPE_STRING, description='总价'),
                    }),
                    description='订单列表'
                ),
            },
            required=["invoice_name","uuid", "invoice_num", 
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
            "orders"]
            )
        )
    def post(self, request):
        create_date = request.query_params.get('date', None)
        file_serializer = FileGUISerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.validated_data['userid'] = request.user
            filename = file_serializer.validated_data.get('invoice_name')
            uuid = file_serializer.validated_data.get('uuid')
            
            # 用于删除draft记录
            file_id = request.GET.get('id',None)
            
            # 检查同一个用户下filename是否一样
            if GUIFile.objects.filter(userid=request.user, invoice_name=filename).exists() or UpFile.objects.filter(userid=request.user, file=filename).exists():
                return Response({
                    "code": 400,
                    "msg": "File name exists for this user",
                }, status=status.HTTP_400_BAD_REQUEST)
            # 检查uuid是否已存在
            if UpFile.objects.filter(uuid=uuid).exists() or GUIFile.objects.filter(uuid=uuid).exists():
                return Response({
                    "code": 400,
                    "msg": "File UUID exists",
                }, status=status.HTTP_400_BAD_REQUEST)
                    
            # 将数据保存在数据库的同时，创建json文件并保存进去
            file_instance = file_serializer.save(userid=request.user)
            file_path = f"staticfiles/{request.user.id}/{filename}.json"
            file_path_pdf = f"staticfiles/{request.user.id}/{filename}.pdf"
            
            # 将数据保存到 Invoice_upfile 表中
            if create_date:
                UpFile.objects.create(
                    file=file_path_pdf,
                    uuid=file_instance.uuid,
                    userid=file_instance.userid,
                    create_date=create_date,
                )
            else:
                    UpFile.objects.create(
                    file=file_path_pdf,
                    uuid=file_instance.uuid,
                    userid=file_instance.userid,
                    create_date=create_date,
                )

            if file_id != None:
                draft = Draft.objects.filter(userid=request.user, id=file_id).first()
                if draft == None:
                    return Response({
                        "code": 400,
                        "msg": "File id not exist",
                    },
                    status=status.HTTP_400_BAD_REQUEST)

                draft.delete()
            

            
            file_data = FileGUISerializer(file_instance).data
            # 把title和userid pop掉，存到文件中
            #file_data.pop('id', None)
            file_data.pop('uuid', None)
            file_data.pop('userid', None)

            if os.path.isfile(f"staticfiles/{request.user.id}/{request.user.id}_preview.json"):
                os.remove(f"staticfiles/{request.user.id}/{request.user.id}_preview.json")
                os.remove(f"staticfiles/{request.user.id}/{request.user.id}_preview.pdf")
                
            with open(file_path, "w", encoding='utf-8') as f:
                json.dump(file_data, f, ensure_ascii=False, indent=4)
            xml_elem = json_to_xml(file_data)
            xml_str = prettify(xml_elem)
            
            with open(f"staticfiles/{request.user.id}/{filename}.xml", "w", encoding="utf-8") as f:
                f.write(xml_str)
            """output_dir = f"staticfiles/{request.user.id}"
            options = SimpleNamespace(output=output_dir, longformat=False, saverml=False, showBoundary=False)

            gen_invoice.generate_pdf(f"staticfiles/{request.user.id}/{filename}.json",options)"""
            
            subprocess.run(
                    ['python', 'gen_invoice.py', "--output",f"staticfiles/{request.user.id}",file_path],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
            
            
            pdf_path = f"staticfiles/{request.user.id}/{filename}.pdf"

            pdf_to_png(pdf_path, f"staticfiles/{request.user.id}/{filename}.png")
            
            
            return Response({
                                "code": 0,
                                "msg": "success!",
                                "data": file_serializer.data
                            },
                            status=status.HTTP_200_OK
                            )
        else:
            return Response({
                                "code": 400,
                                "msg": "bad request",
                                "data": file_serializer.errors
                            },
                            status=status.HTTP_400_BAD_REQUEST)

            
class GUIFilePreview(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[CompanyWorker]
    @swagger_auto_schema(
        operation_summary='用户发票GUI preview',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'invoice_name': openapi.Schema(type=openapi.TYPE_STRING, description='发票名称'),
                'uuid': openapi.Schema(type=openapi.TYPE_STRING, description='UUID'),
                'invoice_num': openapi.Schema(type=openapi.TYPE_STRING, description='发票编号'),
                'my_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='公司名称'),
                'my_address': openapi.Schema(type=openapi.TYPE_STRING, description='公司地址'),
                'my_abn': openapi.Schema(type=openapi.TYPE_STRING, description='公司ABN'),
                'my_email': openapi.Schema(type=openapi.TYPE_STRING, description='公司邮箱'),
                'client_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='客户公司名称'),
                'client_address': openapi.Schema(type=openapi.TYPE_STRING, description='客户地址'),
                'client_abn': openapi.Schema(type=openapi.TYPE_STRING, description='客户ABN'),
                'client_email': openapi.Schema(type=openapi.TYPE_STRING, description='客户邮箱'),
                'bank_name': openapi.Schema(type=openapi.TYPE_STRING, description='银行名称'),
                'currency': openapi.Schema(type=openapi.TYPE_STRING, description='货币种类'),
                'account_num': openapi.Schema(type=openapi.TYPE_STRING, description='账户号码'),
                'bsb_num': openapi.Schema(type=openapi.TYPE_STRING, description='BSB号码'),
                'account_name': openapi.Schema(type=openapi.TYPE_STRING, description='账户名称'),
                'bank_branch': openapi.Schema(type=openapi.TYPE_STRING, description='银行分行'),
                'issue_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='发行日期'),
                'due_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='到期日期'),
                'subtotal': openapi.Schema(type=openapi.TYPE_STRING, description='小计'),
                'gst_total': openapi.Schema(type=openapi.TYPE_STRING, description='GST总计'),
                'total_amount': openapi.Schema(type=openapi.TYPE_STRING, description='总金额'),
                'note': openapi.Schema(type=openapi.TYPE_STRING, description='备注'),
                'orders': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_OBJECT, properties={
                        'description': openapi.Schema(type=openapi.TYPE_STRING, description='描述'),
                        'unit_price': openapi.Schema(type=openapi.TYPE_STRING, description='单价'),
                        'quantity': openapi.Schema(type=openapi.TYPE_INTEGER, description='数量'),
                        'net': openapi.Schema(type=openapi.TYPE_STRING, description='净价'),
                        'gst': openapi.Schema(type=openapi.TYPE_STRING, description='GST'),
                        'amount': openapi.Schema(type=openapi.TYPE_STRING, description='总价'),
                    }),
                    description='订单列表'
                ),
            },
            )
        )
    def post(self,request):
        file_serializer = DraftGUISerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.validated_data['userid'] = request.user
            
            # 创建临时发票文档
            file_path = f"staticfiles/{request.user.id}/{request.user.id}_preview.json"
            file_path_pdf = f"staticfiles/{request.user.id}/{request.user.id}_preview.pdf"
            
            file_data = DraftGUISerializer(request.data).data
            # 把title和userid pop掉，存到文件中
            #file_data.pop('id', None)
            file_data.pop('invoice_name', None)
            file_data.pop('uuid', None)
            file_data.pop('userid', None)    

            # 如果存在的话就删除，避免用户重复preview出错
            if os.path.isfile(file_path):
                os.remove(file_path)
                os.remove(file_path_pdf)
                
            with open(file_path, "w", encoding='utf-8') as f:
                json.dump(file_data, f, ensure_ascii=False, indent=4)

            subprocess.run(
                    ['python', 'gen_invoice.py', "--output",f"staticfiles/{request.user.id}",file_path],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
            
            return Response({
                                "code": 0,
                                "msg": "success!",
                                "pdf_url": file_path_pdf
            },
                            status=status.HTTP_201_CREATED
                            )
        else:
            return Response({
                                "code": 400,
                                "msg": "bad request",
                                "data": file_serializer.errors
                            },
                            status=status.HTTP_400_BAD_REQUEST)

class GUIFileDraft(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[CompanyWorker]
    @swagger_auto_schema(
        operation_summary='用户发票GUI Draft创建',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'invoice_name': openapi.Schema(type=openapi.TYPE_STRING, description='发票名称'),
                'uuid': openapi.Schema(type=openapi.TYPE_STRING, description='UUID'),
                'invoice_num': openapi.Schema(type=openapi.TYPE_STRING, description='发票编号'),
                'my_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='公司名称'),
                'my_address': openapi.Schema(type=openapi.TYPE_STRING, description='公司地址'),
                'my_abn': openapi.Schema(type=openapi.TYPE_STRING, description='公司ABN'),
                'my_email': openapi.Schema(type=openapi.TYPE_STRING, description='公司邮箱'),
                'client_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='客户公司名称'),
                'client_address': openapi.Schema(type=openapi.TYPE_STRING, description='客户地址'),
                'client_abn': openapi.Schema(type=openapi.TYPE_STRING, description='客户ABN'),
                'client_email': openapi.Schema(type=openapi.TYPE_STRING, description='客户邮箱'),
                'bank_name': openapi.Schema(type=openapi.TYPE_STRING, description='银行名称'),
                'currency': openapi.Schema(type=openapi.TYPE_STRING, description='货币种类'),
                'account_num': openapi.Schema(type=openapi.TYPE_STRING, description='账户号码'),
                'bsb_num': openapi.Schema(type=openapi.TYPE_STRING, description='BSB号码'),
                'account_name': openapi.Schema(type=openapi.TYPE_STRING, description='账户名称'),
                'bank_branch': openapi.Schema(type=openapi.TYPE_STRING, description='银行分行'),
                'issue_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='发行日期'),
                'due_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='到期日期'),
                'subtotal': openapi.Schema(type=openapi.TYPE_STRING, description='小计'),
                'gst_total': openapi.Schema(type=openapi.TYPE_STRING, description='GST总计'),
                'total_amount': openapi.Schema(type=openapi.TYPE_STRING, description='总金额'),
                'note': openapi.Schema(type=openapi.TYPE_STRING, description='备注'),
                'orders': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_OBJECT, properties={
                        'description': openapi.Schema(type=openapi.TYPE_STRING, description='描述'),
                        'unit_price': openapi.Schema(type=openapi.TYPE_STRING, description='单价'),
                        'quantity': openapi.Schema(type=openapi.TYPE_INTEGER, description='数量'),
                        'net': openapi.Schema(type=openapi.TYPE_STRING, description='净价'),
                        'gst': openapi.Schema(type=openapi.TYPE_STRING, description='GST'),
                        'amount': openapi.Schema(type=openapi.TYPE_STRING, description='总价'),
                    }),
                    description='订单列表'
                ),
            },
            )
        )
    def post(self,request):
        file_serializer = DraftGUISerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.validated_data['userid'] = request.user
            
            # draft不需要考虑数据完整性，直接创建 或者 更新，通过id作区分
            # 创建和更新的逻辑？
            try: 
                file_serializer.save(userid=request.user)
                return Response({
                                    "code": 200,
                                    "msg": "success",
                                    "data": file_serializer.data
                                },
                )
            except IntegrityError as e:
                return Response({
                                    "code": 400,
                                    "msg": "invoice_num is duplicate", 
                })
        else:
            return Response({
                    "code": 400,
                    "msg": "bad request",
                    "data": file_serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST)
            
    @swagger_auto_schema(
        operation_summary='获取草稿报告',
        manual_parameters=[
            openapi.Parameter(
                'id', openapi.IN_QUERY, description="draft id, 填写的话就返回目标draft的详细信息, 不填写的话则返回该user的全部draft记录", type=openapi.TYPE_INTEGER, required=False
            )
        ],
        responses={
            200: openapi.Response(
                description="成功获取草稿报告",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "success",
                        "data": [
                            {
                                "id": 1,
                                "name": "Draft 1",
                                "content": "Some content"
                            },
                            {
                                "id": 2,
                                "name": "Draft 2",
                                "content": "Some content"
                            }
                        ]
                    },
                    "application/json": {
                        "code": 200,
                        "msg": "success",
                        "data": {
                            "id": 1,
                            "name": "Draft 1",
                            "content": "Some content"
                        }
                    }
                }
            ),
            400: openapi.Response(
                description="请求无效",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "Invalid request"
                    }
                }
            )
        }
    )
    def get(self,request):
        fileid = request.GET.get('id')
        if not fileid:
            draft = Draft.objects.filter(userid=request.user)
            serializer = DraftRecording(draft,many=True)
            
            return Response({
                                "code": 200,
                                "msg": "success",
                                "data": serializer.data
                            },
                            status=status.HTTP_200_OK
                            )
            
        file = Draft.objects.filter(userid=request.user, id=fileid).first()
        file_data = DraftGUISerializer(file).data
        return Response({
                            "code": 200,
                            "msg": "success",
                            "data": file_data
                        },
                        status=status.HTTP_200_OK
                        )
    
    @swagger_auto_schema(
        operation_summary="部分更新发票数据",
        operation_description="根据发票ID部分更新发票数据。",
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="发票id",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'invoice_name': openapi.Schema(type=openapi.TYPE_STRING, description='发票名称'),
                'uuid': openapi.Schema(type=openapi.TYPE_STRING, description='UUID'),
                'invoice_num': openapi.Schema(type=openapi.TYPE_STRING, description='发票编号'),
                'my_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='公司名称'),
                'my_address': openapi.Schema(type=openapi.TYPE_STRING, description='公司地址'),
                'my_abn': openapi.Schema(type=openapi.TYPE_STRING, description='公司ABN'),
                'my_email': openapi.Schema(type=openapi.TYPE_STRING, description='公司邮箱'),
                'client_company_name': openapi.Schema(type=openapi.TYPE_STRING, description='客户公司名称'),
                'client_address': openapi.Schema(type=openapi.TYPE_STRING, description='客户地址'),
                'client_abn': openapi.Schema(type=openapi.TYPE_STRING, description='客户ABN'),
                'client_email': openapi.Schema(type=openapi.TYPE_STRING, description='客户邮箱'),
                'bank_name': openapi.Schema(type=openapi.TYPE_STRING, description='银行名称'),
                'currency': openapi.Schema(type=openapi.TYPE_STRING, description='货币种类'),
                'account_num': openapi.Schema(type=openapi.TYPE_STRING, description='账户号码'),
                'bsb_num': openapi.Schema(type=openapi.TYPE_STRING, description='BSB号码'),
                'account_name': openapi.Schema(type=openapi.TYPE_STRING, description='账户名称'),
                'bank_branch': openapi.Schema(type=openapi.TYPE_STRING, description='银行分行'),
                'issue_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='发行日期'),
                'due_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='到期日期'),
                'subtotal': openapi.Schema(type=openapi.TYPE_STRING, description='小计'),
                'gst_total': openapi.Schema(type=openapi.TYPE_STRING, description='GST总计'),
                'total_amount': openapi.Schema(type=openapi.TYPE_STRING, description='总金额'),
                'note': openapi.Schema(type=openapi.TYPE_STRING, description='备注'),
                'orders': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_OBJECT, properties={
                        'description': openapi.Schema(type=openapi.TYPE_STRING, description='描述'),
                        'unit_price': openapi.Schema(type=openapi.TYPE_STRING, description='单价'),
                        'quantity': openapi.Schema(type=openapi.TYPE_INTEGER, description='数量'),
                        'net': openapi.Schema(type=openapi.TYPE_STRING, description='净价'),
                        'gst': openapi.Schema(type=openapi.TYPE_STRING, description='GST'),
                        'amount': openapi.Schema(type=openapi.TYPE_STRING, description='总价'),
                    }),
                    description='订单列表'
                ),
            },
        )
    )
    def patch(self,request):
        fileid = request.GET.get('id')
        if not fileid:
            return Response({
                                "code": 400,
                                "msg": "File id is required",
                            },
            )
        file = Draft.objects.filter(userid=request.user, id=fileid).first()
        if not file:
            return Response({
                                "code": 404,
                                "msg": "File not found",
                            },
            )
        file_serializer = DraftGUISerializer(file,data=request.data,partial=True)
        if file_serializer.is_valid():
            try: 
                file_serializer.save()
                return Response({
                                    "code": 200,
                                    "msg": "success",
                                    "data": file_serializer.data
                                },
                )
            except IntegrityError as e:
                return Response({
                                    "code": 400,
                                    "msg": "invoice_num is duplicate", 
                })
        else:
            return Response({
                                "code": 400,
                                "msg": "bad request",
                                "data": file_serializer.errors
                            },
            )



    @swagger_auto_schema(
        operation_summary="删除一个或多个发票",
        operation_description="根据发票ID列表删除一个或多个发票。",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'ids': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_STRING),
                    description='发票ID列表'
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="删除成功",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "success",
                        "data": "Files have been deleted"
                    }
                }
            ),
            400: openapi.Response(
                description="请求错误",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "IDs are required"
                    }
                }
            ),
            404: openapi.Response(
                description="未找到文件",
                examples={
                    "application/json": {
                        "code": 404,
                        "msg": "Some files not found"
                    }
                }
            ),
        }
    )
    def delete(self, request):
        ids = request.data.get('ids')
        if not ids:
            return Response({
                                "code": 400,
                                "msg": "IDs are required",
                            },
                            status=status.HTTP_400_BAD_REQUEST)
        
        not_found_ids = []
        for draftid in ids:
            file = Draft.objects.filter(userid=request.user, id=draftid).first()
            if not file:
                not_found_ids.append(draftid)
            else:
                file.delete()

        if not_found_ids:
            return Response({
                                "code": 404,
                                "msg": "Some files not found",
                                "not_found_ids": not_found_ids
                            },
                            status=status.HTTP_404_NOT_FOUND)
        
        return Response({
                            "code": 200,
                            "msg": "success",
                            "data": "Files have been deleted"
                        },
                        status=status.HTTP_200_OK)

class FileReport(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [CompanyWorker]
    
    @swagger_auto_schema(
        operation_summary='获取文件报告',
        manual_parameters=[
            openapi.Parameter(
                'uuid', openapi.IN_QUERY, description="文件 UUID", type=openapi.TYPE_STRING, required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="成功获取文件报告",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "success",
                        "data": "staticfiles/1/file_report.json"
                    }
                }
            ),
            400: openapi.Response(
                description="请求无效",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "File id is required"
                    },
                    "application/json": {
                        "code": 400,
                        "msg": "File is not validated"
                    }
                }
            ),
            404: openapi.Response(
                description="文件未找到",
                examples={
                    "application/json": {
                        "code": 404,
                        "msg": "File not found"
                    },
                    "application/json": {
                        "code": 404,
                        "msg": "Report file not found"
                    }
                }
            )
        }
    )
    def get(self,request):
        fileid = request.GET.get('uuid')
        if not fileid:
            return Response({
                                "code": 400,
                                "msg": "File id is required",
                            },
                            status=status.HTTP_400_BAD_REQUEST)
        
        file = UpFile.objects.filter(userid=request.user.id, uuid=fileid).first()
        if not file:
            return Response({
                                "code": 404,
                                "msg": "File not found",
                            },
                            status=status.HTTP_404_NOT_FOUND
                            )
        if file.is_validated == 0:
            return Response({
                                "code": 400,
                                "msg": "File is not validated",
                            },
                            status=status.HTTP_400_BAD_REQUEST
                            )
            
        file_name = os.path.basename(str(file.file))
        file_stem = os.path.splitext(file_name)[0]
        
        file_path = f"staticfiles/{request.user.id}/{file_stem}_report.json"
        if not os.path.isfile(file_path):
            return Response({
                                "code": 404,
                                "msg": "Report file not found",
                            },
                            status=status.HTTP_404_NOT_FOUND
                            )
        return Response({
                            "code": 200,
                            "msg": "success",
                            "data": file_path
                        },
                        status=status.HTTP_200_OK
                        )

class DeleteFileAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    @swagger_auto_schema(
        operation_summary='管理员删除公司发票文件',
        manual_parameters=[
            openapi.Parameter('uuid', openapi.IN_QUERY, description="File UUID", type=openapi.TYPE_STRING)
        ],
        responses={
            200: openapi.Response(
                description="Invoice file has been successfully removed",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "Invoice file has been successfully removed!"
                    }
                }
            ),
            400: openapi.Response(
                description="File ID is required",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "File ID is required"
                    }
                }
            ),
            404: openapi.Response(
                description="File not found",
                examples={
                    "application/json": {
                        "code": 404,
                        "msg": "file not found"
                    }
                }
            )
        }
    )
    
    def post(self,request):
        uuid = request.query_params.get('uuid')
        if not uuid:
            return Response({
                                "code": 400,
                                "msg": "File ID is required",
                            },
                            status=status.HTTP_400_BAD_REQUEST)
        
        file = UpFile.objects.filter(uuid=uuid).first()
        if file is None:
            return Response({
                                "code": 404,
                                "msg": "file not found",
                            },
                            status=status.HTTP_404_NOT_FOUND
                            )
        file_gui = GUIFile.objects.filter(uuid=file.uuid).first()

        if file_gui is not None:
            file_gui.delete()

                
        # 删除发票目录下的该发票，防止下次上传时文件重复存在
        file_name = os.path.basename(str(file.file))
        file_stem = os.path.splitext(file_name)[0]
        if os.path.isfile(f"staticfiles/{request.user.id}/{file_stem}.pdf"):
            os.remove(f"staticfiles/{request.user.id}/{file_stem}.pdf")
        if os.path.isfile(f"staticfiles/{request.user.id}/{file_stem}.json"):
            os.remove(f"staticfiles/{request.user.id}/{file_stem}.json")
        if os.path.isfile(f"staticfiles/{request.user.id}/{file_stem}.xml"):
            os.remove(f"staticfiles/{request.user.id}/{file_stem}.xml")
        if os.path.isfile(f"staticfiles/{request.user.id}/{file_stem}_report.json"):
            os.remove(f"staticfiles/{request.user.id}/{file_stem}_report.json")
        if os.path.isfile(f"staticfiles/{request.user.id}/{file_stem}_report.png"):
            os.remove(f"staticfiles/{request.user.id}/{file_stem}_report.png")
            
        file.delete()
        return Response({
                            "code": 200,
                            "msg": "Invoice file has been successfly removed!",
                        },
                        status=status.HTTP_200_OK
                        )

class FileInfoAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    @swagger_auto_schema(
        operation_summary="获取用户的发票文件信息",
        operation_description="获取当前登录用户的所有发票文件信息",
        responses={
            200: openapi.Response(
                description="成功返回发票文件信息",
                examples={
                    "application/json": [
                        {
                            "id": 1,
                            "timestamp": "2024-07-10T12:34:56Z",
                            "userid": 1,
                            "uuid": "some-uuid",
                            "file": "path/to/file.pdf",
                            "supplier": "Supplier Name",
                            "total": 100.0,
                            "state": "已通过",
                            "creation_method": "upload"
                        },
                        {
                            "id": 2,
                            "timestamp": "2024-07-11T12:34:56Z",
                            "userid": 1,
                            "uuid": "another-uuid",
                            "file": "path/to/another_file.pdf",
                            "supplier": "Another Supplier",
                            "total": 200.0,
                            "state": "未验证",
                            "creation_method": "gui"
                        }
                    ]
                }
            ),
            401: openapi.Response(
                description="未授权",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                }
            ),
            500: openapi.Response(
                description="服务器内部错误",
                examples={
                    "application/json": {
                        "detail": "Internal server error."
                    }
                }
            )
        }
    )
    def get(self, request):
        invoices = UpFile.objects.filter(userid=request.user.id)
        serializer = InvoiceUpfileSerializer(invoices, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class FileNumber(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [CompanyWorker]
    @swagger_auto_schema(
        operation_summary="获取发票统计信息",
        operation_description="返回数据库中发票的各种统计信息，包括总数量、未验证数量、成功数量、失败数量以及按日期划分的总数和已发送数量。",
        responses={
            200: openapi.Response(
                description="成功",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "success",
                        "total_files": 100,
                        "unvalidated_files": 20,
                        "successful_files": 60,
                        "failed_files": 20,
                        "total_invoice_timebase": [
                            {"create_date": "2024-07-29", "count": 2},
                            {"create_date": "2024-07-30", "count": 1},
                            {"create_date": "2024-07-31", "count": 4}
                        ],
                        "sent_invoice_timebase": [
                            {"create_date": "2024-07-29", "count": 1},
                            {"create_date": "2024-07-31", "count": 3}
                        ]
                    }
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'code': openapi.Schema(type=openapi.TYPE_INTEGER, description='响应代码'),
                        'msg': openapi.Schema(type=openapi.TYPE_STRING, description='响应消息'),
                        'total_files': openapi.Schema(type=openapi.TYPE_INTEGER, description='发票总数量'),
                        'unvalidated_files': openapi.Schema(type=openapi.TYPE_INTEGER, description='未验证发票数量'),
                        'successful_files': openapi.Schema(type=openapi.TYPE_INTEGER, description='成功发票数量'),
                        'failed_files': openapi.Schema(type=openapi.TYPE_INTEGER, description='失败发票数量'),
                        'total_invoice_timebase': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Items(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'create_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='创建日期'),
                                    'count': openapi.Schema(type=openapi.TYPE_INTEGER, description='数量')
                                }
                            )
                        ),
                        'sent_invoice_timebase': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Items(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'create_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='创建日期'),
                                    'count': openapi.Schema(type=openapi.TYPE_INTEGER, description='数量')
                                }
                            )
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="请求错误",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "请求参数错误"
                    }
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'code': openapi.Schema(type=openapi.TYPE_INTEGER, description='响应代码'),
                        'msg': openapi.Schema(type=openapi.TYPE_STRING, description='响应消息')
                    }
                )
            ),
            500: openapi.Response(
                description="服务器错误",
                examples={
                    "application/json": {
                        "code": 500,
                        "msg": "服务器内部错误"
                    }
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'code': openapi.Schema(type=openapi.TYPE_INTEGER, description='响应代码'),
                        'msg': openapi.Schema(type=openapi.TYPE_STRING, description='响应消息')
                    }
                )
            )
        }
    )
    def get(self,request):
        total_files = UpFile.objects.all().count()
        unvalidated_files = UpFile.objects.filter(is_validated=0).count()
        successful_files = UpFile.objects.filter(is_validated=1,is_correct=1).count()
        failed_files = UpFile.objects.filter(is_validated=1,is_correct=0).count()
        
        sent_invoice_counts = UpFile.objects.filter(is_sent=1).annotate(date=TruncDate('create_date')).values('date').annotate(count=Count('id')).order_by('date')
        sent_invoice_timebase = [
            {"create_date": item['date'], "count": item['count']}
            for item in sent_invoice_counts
        ]
        
        invoice_counts = UpFile.objects.annotate(date=TruncDate('create_date')).values('date').annotate(count=Count('id')).order_by('date')
        total_invoice_timebase = [
            {"create_date": item['date'], "count": item['count']}
            for item in invoice_counts
        ]
        
        return Response({
            "code": 200,
            "msg": "success",
            "total_files": total_files,
            "unvalidated_files": unvalidated_files,
            "successful_files": successful_files,
            "failed_files": failed_files,
            "total_invoice_timebase": total_invoice_timebase,
            "send_invoice_timebase": sent_invoice_timebase
        }, status=status.HTTP_200_OK)
    

class CompanyFileInfoAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    @swagger_auto_schema(
        operation_summary="获取公司所有用户的发票文件信息",
        operation_description="获取当前登录管理员用户所在公司的所有用户的发票文件信息",
        responses={
            200: openapi.Response(
                description="成功返回发票文件信息",
                examples={
                    "application/json": [
                        {
                            "id": 1,
                            "timestamp": "2024-07-10T12:34:56Z",
                            "userid": 1,
                            "uuid": "some-uuid",
                            "file": "path/to/file.pdf",
                            "supplier": "Supplier Name",
                            "total": 100.0,
                            "state": "已通过",
                            "creation_method": "upload"
                        },
                        {
                            "id": 2,
                            "timestamp": "2024-07-11T12:34:56Z",
                            "userid": 1,
                            "uuid": "another-uuid",
                            "file": "path/to/another_file.pdf",
                            "supplier": "Another Supplier",
                            "total": 200.0,
                            "state": "未验证",
                            "creation_method": "gui"
                        }
                    ]
                }
            ),
            401: openapi.Response(
                description="未授权",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                }
            ),
            403: openapi.Response(
                description="禁止访问",
                examples={
                    "application/json": {
                        "detail": "You do not have permission to perform this action."
                    }
                }
            ),
            500: openapi.Response(
                description="服务器内部错误",
                examples={
                    "application/json": {
                        "detail": "Internal server error."
                    }
                }
            )
        }
    )
    def get(self, request):
        company = request.user.company
        # 这句可以连接到user表上 去对应user.company找到公司
        invoices = UpFile.objects.filter(userid__company=company)
        serializer = InvoiceUpfileSerializer(invoices, many=True)
        return Response(serializer.data)

class CompanyInfo(APIView):
    authentication_classes = [JWTAuthentication]
    @swagger_auto_schema(
        operation_summary="获取公司的详细信息",
        operation_description="获取当前登录用户所属公司的详细信息",
        responses={
            200: openapi.Response(
                description="成功返回公司详细信息",
                examples={
                    "application/json": {
                        "id": 1,
                        "name": "Company Name",
                        "address": "Company Address",
                        "phone": "123-456-7890",
                        "email": "company@example.com",
                        "ABN": "string",
                    }
                }
            )})
    def get(self, request):
        company = request.user.company
        serializer = CompanySerializer(company)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
        
    
def json_to_xml(json_obj, line_padding=""):
    elem = ET.Element('root')
    
    def build_element(parent, key, value):
        if isinstance(value, dict):
            subelem = ET.SubElement(parent, key)
            for subkey, subvalue in value.items():
                build_element(subelem, subkey, subvalue)
        elif isinstance(value, list):
            for subvalue in value:
                subelem = ET.SubElement(parent, key)
                build_element(subelem, 'item', subvalue)
        else:
            subelem = ET.SubElement(parent, key)
            subelem.text = str(value) if value is not None else ''

    for key, value in json_obj.items():
        build_element(elem, key, value)
    
    return elem


def prettify(elem):
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

class FileValidationsAPIView(APIView):
    # authentication_classes = [MyAhenAuthentication]
    authentication_classes = [JWTAuthentication]
    @swagger_auto_schema(
        operation_summary="发票文件验证",
        operation_description="Validate uploaded JSON or PDF file against specific rules",
        manual_parameters=[
            openapi.Parameter('uuid', openapi.IN_QUERY, description="File UUID", type=openapi.TYPE_STRING),
            openapi.Parameter(
                'rules', 
                openapi.IN_QUERY, 
                description="Validation Rules (comma-separated values for multiple selections)",
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(
                    type=openapi.TYPE_STRING,
                    enum=[
                        "AUNZ_PEPPOL_1_0_10",
                        "AUNZ_PEPPOL_SB_1_0_10",
                        "AUNZ_UBL_1_0_10",
                        "FR_EN16931_CII_1_3_11",
                        "FR_EN16931_UBL_1_3_11",
                        "RO_RO16931_UBL_1_0_8_EN16931",
                        "RO_RO16931_UBL_1_0_8_CIUS_RO",
                    ]
                )
            )
        ],
        responses={
            200: openapi.Response(
                description="Validation success!",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "Validation success!",
                        "validation_report": {
                            # Example validation report data here
                        }
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "File ID and Validation Rule is required"
                    }
                }
            ),
            404: openapi.Response(
                description="File not found",
                examples={
                    "application/json": {
                        "code": 404,
                        "msg": "file not found"
                    }
                }
            ),
            500: openapi.Response(
                description="Internal Server Error",
                examples={
                    "application/json": {
                        "code": 500,
                        "msg": "Validation failed",
                        "details": "Error details here"
                    }
                }
            )
        }
    )
    def post(self, request):
        uuid = request.query_params.get('uuid')
        rule = request.query_params.getlist('rules')
        if not uuid or not rule:
            return Response({
                                "code": 400,
                                "msg": "File ID and Validation Rule is required",
                            },
                            status=status.HTTP_400_BAD_REQUEST)
        
        
        file = UpFile.objects.filter(userid=request.user, uuid=uuid).first()
        if file is None:
            return Response({
                                "code": 404,
                                "msg": "file not found",
                            },
                            status=status.HTTP_404_NOT_FOUND
                            )
        # 提取出文件名字，不带pdf和json后缀
        # invoices_files/retrospective_A.pdf = retrospective_A
        file_name = os.path.basename(str(file.file))
        file_stem = os.path.splitext(file_name)[0]
                      
        # 2. 将xml内容转化为base64的content
        with open(f'staticfiles/{request.user.id}/{file_stem}.xml', 'rb') as xml_file:
            xml_bytes = xml_file.read()
            # 使用Base64编码字节
        base64_bytes = base64.b64encode(xml_bytes)

            # 将Base64编码的字节转换为字符串
        content = base64_bytes.decode('utf-8')
        
        # 3. 计算content的checksum
        checkSum = hashlib.md5(content.encode()).hexdigest()
        
        # 4. 获得token
        def token():
            url = 'https://dev-eat.auth.eu-central-1.amazoncognito.com/oauth2/token'
            headers = {
                'content-type': 'application/x-www-form-urlencoded'
            }
            data = {
                'grant_type': 'client_credentials',
                'client_id': '7d30bi87iptegbrf2bp37p42gg',
                'client_secret': '880tema3rvh3h63j4nquvgoh0lgts11n09bq8597fgrkvvd62su',
                'scope': 'eat/read'
            }

            response = requests.post(url, headers=headers, data=data)
            response_data = response.json()
            access_token = response_data.get('access_token')
            return access_token

        # https://services.ebusiness-cloud.com/ess-schematron/v1/api/validate?rules=AUNZ_UBL_1_0_10&customer=COMPANY
        # 请求api做validation
        url = "https://services.ebusiness-cloud.com/ess-schematron/v1/api/validate"
        payload = {"rules":rule,
                   "customer":request.user.username}
        body_data = {"filename":f"{file_stem}.xml",
                     "content":content,
                     "checksum":checkSum}

        validation_response = requests.post(url, json=body_data, 
                                            params=payload, 
                                            headers={"Authorization": f"Bearer {token()}", "Accept-Language":"en"})
        # 处理验证响应

        if validation_response.status_code == 200:
            validate_data = validation_response.json()

            
            file.is_validated = True
            if validate_data.get('successful'):
                file.is_correct = True
                file.validation_date = datetime.now()
            file.save()
            
            report = validate_data.get('report')
            if report:
                # 保存report到数据库
                # 将 report 字段内容保存到 JSON 文件中
                json_file_path = f'staticfiles/{request.user.id}/{file_stem}_report.json'  # 请更改为实际的文件路径

                try:
                    with open(json_file_path, 'w', encoding='utf-8') as json_file:
                        json.dump(report, json_file, ensure_ascii=False, indent=4)
                except Exception as e:
                    return JsonResponse({"code": 500, "msg": f"Failed to save report: {str(e)}"}, status=500)
                
            return Response({
                                "code": 200,
                                "msg": "Validation success!",
                                "validation_report": validate_data
                            },
                            status=status.HTTP_200_OK)
        else:
            return Response({
                                "code": validation_response.status_code,
                                "msg": "Validation failed",
                                "details": validation_response.text
                            },
                            status=validation_response.status_code)

class SendInvoiceEmailAPIView(APIView):
    # authentication_classes = [MyAhenAuthentication]
    authentication_classes = [JWTAuthentication]
    @swagger_auto_schema(
        operation_summary="发票邮件发送功能",
        operation_description="Send the invoice file to the client's email",
        manual_parameters=[
            openapi.Parameter(
                'uuids', openapi.IN_QUERY, 
                description="File UUIDs", 
                type=openapi.TYPE_ARRAY, 
                items=openapi.Items(type=openapi.TYPE_STRING)
            ),
            openapi.Parameter('email', openapi.IN_QUERY, description="Client Email", type=openapi.TYPE_STRING),
            
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING, description='Custom Message')
            },
        ),
        responses={
            200: openapi.Response(
                description="Email sent successfully",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "Email sent successfully"
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request",
                examples={
                    "application/json": {
                        "code": 400,
                        "msg": "File ID and client email are required"
                    }
                }
            ),
            404: openapi.Response(
                description="File not found",
                examples={
                    "application/json": {
                        "code": 404,
                        "msg": "file not found"
                    },
                    "application/json": {
                        "code": 404,
                        "msg": "file not found on server"
                    }
                }
            ),
            500: openapi.Response(
                description="Internal Server Error",
                examples={
                    "application/json": {
                        "code": 500,
                        "msg": "Failed to send email: error message"
                    }
                }
            )
        }
    )
    def post(self, request):
        uuids = request.query_params.getlist('uuids')
        client_email = request.query_params.get('email')
        custom_message = request.data.get('message') 
        if not uuids or not client_email:
            return Response({
                                "code": 400,
                                "msg": "File ID and client email are required",
                            },
                            status=status.HTTP_400_BAD_REQUEST)
            
            
        uuids = uuids[0].split(',')
        # 格式化 UUID 列表
        uuids = [str(uuid).strip() for uuid in uuids]
        files = UpFile.objects.filter(userid=request.user.id, uuid__in=uuids)
        if not files.exists():
            return Response({
                                "code": 404,
                                "msg": "No files found",
                            },
                            status=status.HTTP_404_NOT_FOUND)

        files.update(sending_date=datetime.now(), email_receiver=client_email)
        email_body = f"{custom_message}\n\nPlease find attached your invoice."  # 将自定义消息添加到邮件正文中
        email = EmailMessage(
            'Your Invoice',
            email_body,
            to=[client_email]
        )
        for file in files:
            file_name = os.path.basename(str(file.file))
            file_stem = os.path.splitext(file_name)[0]
            
            file_path = str(file.file)

            if os.path.exists(file_path):
                # 未验证
                if not file.is_validated:
                    email.attach_file(file_path)
                # 验证通过
                elif file.is_correct:
                    email.attach_file(file_path)
                    email.attach_file(f"staticfiles/{request.user.id}/{file_stem}_report.json")
                # 验证失败
                elif not file.is_correct:
                    email.attach_file(f"staticfiles/{request.user.id}/{file_stem}_report.json")
            else:
                return Response({
                                    "code": 404,
                                    "msg": "file not found on server",
                                },
                                status=status.HTTP_404_NOT_FOUND)
        try:
            email.send()
            file.is_sent = True
            file.save()
            return Response({
                                "code": 200,
                                "msg": "Email sent successfully",
                            },
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                                "code": 500,
                                "msg": f"Failed to send email: {str(e)}",
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     

class TimeOfInvoice(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[CompanyWorker]
    @swagger_auto_schema(
        operation_summary="获取发票文件的创建时间、验证时间、发送时间和接收邮件的地址",
        operation_description="根据UUID获取文件的时间点。",
        manual_parameters=[
            openapi.Parameter(
                'uuid',
                openapi.IN_QUERY,
                description="文件的UUID",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="用户ID（可选），如果不填默认是该用户",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        responses={
            200: openapi.Response(
                description="成功",
                examples={
                    "application/json": {
                        "code": 200,
                        "msg": "success",
                        "create_date": "2024-01-01T00:00:00Z",
                        "validation_date": "2024-01-02T00:00:00Z",
                        "send_date": "2024-01-03T00:00:00Z",
                        "email_receiver": "example@example.com"
                    }
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'code': openapi.Schema(type=openapi.TYPE_INTEGER, description='响应代码'),
                        'msg': openapi.Schema(type=openapi.TYPE_STRING, description='响应消息'),
                        'create_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, description='创建日期'),
                        'validation_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, description='验证日期'),
                        'send_date': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, description='发送日期'),
                        'email_receiver': openapi.Schema(type=openapi.TYPE_STRING, description='接收邮件的地址'),
                    }
                )
            ),
            404: openapi.Response(
                description="文件未找到",
                examples={
                    "application/json": {
                        "code": 404,
                        "msg": "file not found"
                    }
                },
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'code': openapi.Schema(type=openapi.TYPE_INTEGER, description='响应代码'),
                        'msg': openapi.Schema(type=openapi.TYPE_STRING, description='响应消息')
                    }
                )
            )
        }
    )
    def get(self, request):
        uuid = request.GET.get('uuid')
        userid = request.GET.get('id')
        name = request.user.name
        
        if userid:
            file = UpFile.objects.filter(userid=userid, uuid=uuid).first()
            user = User.objects.filter(id=userid).first()
            if user is None:
                return JsonResponse({"code": 404, "msg": "user not found"}, status=status.HTTP_404_NOT_FOUND)
            name = user.name
            
        else:
            file = UpFile.objects.filter(userid=request.user, uuid=uuid).first()
        if file is None:
            return JsonResponse({"code": 404, "msg": "file not found"}, status=status.HTTP_404_NOT_FOUND)
        create_date = file.create_date
        validation_date = file.validation_date
        sending_date = file.sending_date
        email_receiver = file.email_receiver
        return JsonResponse({
            "code": 200,
            "msg": "success",
            "user_name":name,
            "create_date": create_date,
            "validation_date": validation_date,
            "send_date":sending_date,
            "email_receiver":email_receiver
        }, status=status.HTTP_200_OK)
    
class PasswordResetRequestView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []
    
    @swagger_auto_schema(
        operation_summary='用户密码重置说明',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='User Name'
                ),
                'email': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='User Email'
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Password reset link sent",
                examples={
                    "application/json": {
                        "message": "Password reset link sent"
                    }
                }
            ),
            400: openapi.Response(
                description="Bad request",
                examples={
                    "application/json": {
                        "username": ["This field is required."],
                        "email": ["This field is required."]
                    }
                }
            ),
            404: openapi.Response(
                description="User not found",
                examples={
                    "application/json": {
                        "error": "User with this email does not exist"
                    }
                }
            )
        }
    )
    def post(self, request):
        ser = PasswordResetSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get('email')
        username = request.data.get('username')

        try:
            user = User.objects.get(email=email,username=username)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = request.build_absolute_uri(reverse('password_reset_confirm', args=[uid, token]))

        user.reset_password_token = token
        user.reset_password_sent_at = now()
        user.save()

        send_mail(
            'Password Reset',
            f'Use the link to reset your password: {reset_url}',
            'from@example.com',
            [email],
            fail_silently=False,
        )
        
        return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []
    @swagger_auto_schema(auto_schema=None)  # 隐藏此方法的 Swagger 文档 
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            if not new_password:
                return render(request, 'password_reset_confirm.html', {
                    'uid': uidb64, 'token': token, 'error': 'New password is required'
                })

            user.set_password(new_password)
            user.reset_password_token = None
            user.reset_password_sent_at = None
            user.save()
            return render(request, 'password_reset_confirm.html', {
                'message': 'Password has been reset successfully'
            })
        else:
            return render(request, 'password_reset_confirm.html', {
                'uid': uidb64, 'token': token, 'error': 'Invalid token or user ID'
            })
    @swagger_auto_schema(auto_schema=None)  # 隐藏此方法的 Swagger 文档
    def get(self, request, uidb64, token):
        return render(request, 'password_reset_confirm.html', {'uid': uidb64, 'token': token})


    
    
