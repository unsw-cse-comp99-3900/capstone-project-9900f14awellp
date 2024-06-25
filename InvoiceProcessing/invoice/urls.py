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
    path('invoice-creation/<int:userid>/',views.UpFileAPIView.as_view(), name='invoice-creation'),
    ]

