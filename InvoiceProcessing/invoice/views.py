from django.shortcuts import render
import json
from django.http import JsonResponse
from .models import Company, User, UpFile, GUIFile
from django.conf import settings
from django.db.models.signals import post_save # 用户已经建好了，才触发generate_token函数生成token
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.timezone import now
import uuid
from .authentication import MyAhenAuthentication


#from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CompanySerializer,RegisterSerializer,LoginSerializer, FileUploadSerializer, FileGUISerializer
# Create your views here.


# 用户注册
class RegisterView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []
    def post(self, request):
        ser = RegisterSerializer(data=request.data)

        if ser.is_valid():
            ser.validated_data.pop('confirm_password')
            token =str(uuid.uuid4())
            ser.validated_data['password'] = make_password(ser.validated_data['password'])
            ser.validated_data['token'] = token
            ser.save()
            instance = User.objects.filter(**ser.validated_data).first()
            return Response({
                    'username':instance.username,
                    'password':instance.password,
                    'userid':instance.id,
                    'token':instance.token,
                }, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# 用户登录
class LoginView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []
    def post(self, request):
        ser = LoginSerializer(data=request.data)

        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        

        instance = User.objects.filter(username=ser.validated_data['username']).first()

        if not instance:
            return Response({'error': 'This user does not exist'}, status=status.HTTP_401_UNAUTHORIZED)
        # token, created = Token.objects.get_or_create(user=instance)
        elif not check_password(ser.validated_data['password'], instance.password):
            return Response({'error': 'Password does not match'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"state":"Login success",
                         'userid':instance.id,
                        'token': instance.token}, 
                        status=status.HTTP_200_OK)
    
class CreateCompanyView(APIView):
    # permission_classes = [IsAuthenticated]
    authentication_classes = [MyAhenAuthentication]

    def post(self, request, userid):
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
            request.user.is_admin = True
            request.user.save()

            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class JoinCompanyView(APIView):
    # permission_classes = [IsAuthenticated]

    
    authentication_classes = [MyAhenAuthentication]
    
    def get(self,request,userid):

        companies = Company.objects.all()
        return Response({'companies': [company.name for company in companies]}, status=status.HTTP_200_OK)
        
        
    def post(self, request, userid):

        company_name = request.data.get('company_name')
        if not company_name:
            return Response({'error': 'company_name field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            company = Company.objects.get(name=company_name)
        except Company.DoesNotExist:
            return Response({'error': 'Company does not exist'}, status=status.HTTP_404_NOT_FOUND)

        request.user.company = company
        request.user.save()
        return Response({'success': 'Joined the company successfully'}, status=status.HTTP_200_OK)
        
    
def file_iterator(file_path, chunk_size=512):
    """
    文件读取迭代器
    :return:
    """
    with open(file_path, 'rb') as target_file:
        while True:
            chunk = target_file.read(chunk_size)
            if chunk:
                yield chunk
            else:
                break

# for uploading and downloading files
class UpFileAPIView(APIView):
    authentication_classes = [MyAhenAuthentication]
    #parser_classes = (MultiPartParser, FormParser)

    def post(self, request, userid):
        file_serializer = FileUploadSerializer(data=request.data)
        if file_serializer.is_valid():
            uuid = file_serializer.validated_data.get('uuid')
            if UpFile.objects.filter(userid=request.user, uuid=uuid).exists():
                return Response({
                    "code": 400,
                    "msg": "ID exists for this user",
                }, status=status.HTTP_400_BAD_REQUEST)
            file_serializer.save(userid=request.user)
            return Response({
                                "code": 0,
                                "msg": "success!",
                                "data": file_serializer.data
                            },
                            status=status.HTTP_200_OK
                            )
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # 返回文件的目录
    def get(self,request,userid):
        uuid = request.GET.get('uuid')
        if not uuid:
            return Response({
                                "code": 400,
                                "msg": "title is required",
                            },
                            status=status.HTTP_400_BAD_REQUEST)
        
        file = UpFile.objects.filter(userid=userid, uuid=uuid).first()
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
        
class GUIFileAPIView(APIView):
    authentication_classes = [MyAhenAuthentication]
    
    def post(self, request, userid):
        file_serializer = FileGUISerializer(data=request.data)
        if file_serializer.is_valid():
            title = file_serializer.validated_data.get('title')
            if GUIFile.objects.filter(userid=request.user, title=title).exists():
                    return Response({
                    "code": 400,
                    "msg": "Title already exists for this user",
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            # 将数据保存在数据库的同时，创建json文件并保存进去
            file_instance = file_serializer.save(userid=request.user)
            file_data = FileGUISerializer(file_instance).data
            # 把title和userid pop掉，存到文件中
            file_data.pop('id', None)
            file_data.pop('title', None)
            file_data.pop('userid', None)
            
            with open(f"invoices_files/{title}.json", "w", encoding='utf-8') as f:
                json.dump(file_data, f, ensure_ascii=False, indent=4)
                
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
            
class PasswordResetRequestView(APIView):
    authentication_classes = []  # 禁用认证
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
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

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            if not new_password:
                return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.reset_password_token = None
            user.reset_password_sent_at = None
            user.save()
            return Response({"message": "Password has been reset"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token or user ID"}, status=status.HTTP_400_BAD_REQUEST)

        
    
    
