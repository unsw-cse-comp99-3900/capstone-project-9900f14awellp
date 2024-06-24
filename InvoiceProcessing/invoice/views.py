from django.shortcuts import render
import json
from django.http import JsonResponse
from .models import Company, User
from django.conf import settings
from django.db.models.signals import post_save # 用户已经建好了，才触发generate_token函数生成token
from django.dispatch import receiver
from django.db import models
import uuid
from .authentication import MyAhenAuthentication

from rest_framework import generics, viewsets
from rest_framework import status
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CompanySerializer,RegisterSerializer,LoginSerializer
# Create your views here.


# 用户注册
class RegisterView(APIView):
    
    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        if ser.is_valid():
            ser.validated_data.pop('confirm_password')
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# 用户登录
class LoginView(APIView):
    def post(self, request):
        ser = LoginSerializer(data=request.data)

        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        
        instance = User.objects.filter(**ser.validated_data).first()

        if not instance:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        # token, created = Token.objects.get_or_create(user=instance)
        
        token =str(uuid.uuid4())
        instance.token = token
        instance.save()
        
        return Response({'token': token}, status=status.HTTP_200_OK)
    
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



    def post(self, request, userid):
        company_name = request.data.get('name')
        print(company_name)
        if not company_name:
            return Response({'error': 'Company name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            company = Company.objects.get(name=company_name)
        except Company.DoesNotExist:
            return Response({'error': 'Company does not exist'}, status=status.HTTP_404_NOT_FOUND)

        request.user.company = company
        request.user.save()
        return Response({'success': 'Joined the company successfully'}, status=status.HTTP_200_OK)
        
    


        
    
