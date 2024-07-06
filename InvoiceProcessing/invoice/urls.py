#!/usr/bin/python3
# -*- coding:utf-8 -*-
# __author__ = "__Jack__"

from django.urls import path, include,re_path
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from invoice import views

schema_view = get_schema_view(
    openapi.Info(
        title="Invoice System API",
        default_version='v1',
        description="API documentation for the Invoice System",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="641737796@qq.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('create-company/<int:userid>',views.CreateCompanyView.as_view(), name='create-company'),
    path('join-company/<int:userid>',views.JoinCompanyView.as_view(), name='join-company'),
    path('invoice-creation-upload/<int:userid>',views.UpFileAPIView.as_view(), name='invoice-creation-upload'),
    path('invoice-creation-gui/<int:userid>',views.GUIFileAPIView.as_view(), name='invoice-creation-gui'),
    path('invoice-deletion/<int:userid>',views.DeleteFileAPIView.as_view(),name='invoice-deletion'),
    path('invoice-validation/<int:userid>',views.FileValidationsAPIView.as_view(),name='invoice-validation'),
    path('invoice-sending/<int:userid>',views.SendInvoiceEmailAPIView.as_view(),name='invoice-sending'),
    path('password_reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]

