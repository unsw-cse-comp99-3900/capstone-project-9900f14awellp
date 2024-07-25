#!/usr/bin/python3
# -*- coding:utf-8 -*-
# __author__ = "__Jack__"

from django.urls import path, include,re_path
from rest_framework_simplejwt.views import TokenRefreshView
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
    path('create-company/',views.CreateCompanyView.as_view(), name='create-company'),
    path('join-company/',views.JoinCompanyView.as_view(), name='join-company'),
    path('invoice-creation-upload/',views.UpFileAPIView.as_view(), name='invoice-creation-upload'),
    path('invoice-creation-gui/',views.GUIFileAPIView.as_view(), name='invoice-creation-gui'),
    path('invoice-deletion/',views.DeleteFileAPIView.as_view(),name='invoice-deletion'),
    path('invoice-validation/',views.FileValidationsAPIView.as_view(),name='invoice-validation'),
    path('invoice-sending/',views.SendInvoiceEmailAPIView.as_view(),name='invoice-sending'),
    path('invoice-info/',views.FileInfoAPIView.as_view(),name='invoice-info'),
    path('company-invoice-info/',views.CompanyFileInfoAPIView.as_view(),name='company-invoice-info'),
    path('company-info/',views.CompanyInfo.as_view(),name='company-info'),
    path('user-info/',views.UserInfo.as_view(),name='user-info'),
    path("user-delete/",views.DeleterUser.as_view(),name='user-delete'),
    path('password_reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]

