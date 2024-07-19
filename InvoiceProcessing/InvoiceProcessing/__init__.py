# InvoiceProcessing/__init__.py
from __future__ import absolute_import, unicode_literals

# 这将确保 Django 在 Celery 加载时会加载应用程序配置
from .celery import app as celery_app

__all__ = ('celery_app',)
