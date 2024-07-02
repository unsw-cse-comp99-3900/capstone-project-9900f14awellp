#!/usr/bin/python3
# -*- coding:utf-8 -*-
# __author__ = "__Jack__"

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from invoice import views


urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('create-company/<int:userid>/',views.CreateCompanyView.as_view(), name='create-company'),
    path('join-company/<int:userid>/',views.JoinCompanyView.as_view(), name='join-company'),
    path('invoice-creation-upload/<int:userid>/',views.UpFileAPIView.as_view(), name='invoice-creation-upload'),
    path('invoice-creation-gui/<int:userid>/',views.GUIFileAPIView.as_view(), name='invoice-creation-gui'),
    path('password_reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    ]
path

