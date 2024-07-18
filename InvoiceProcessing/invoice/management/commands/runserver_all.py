import os
from django.core.management.commands.runserver import Command as RunserverCommand
from multiprocessing import Process
import subprocess

def start_redis():
    subprocess.run(['redis-server'])

def start_celery_worker():
    subprocess.run(['celery', '-A', 'InvoiceProcessing', 'worker', '--loglevel=info'])

class Command(RunserverCommand):
    def handle(self, *args, **options):
        # 启动 Redis 服务器
        redis_process = Process(target=start_redis)
        redis_process.start()

        # 启动 Celery worker
        celery_process = Process(target=start_celery_worker)
        celery_process.start()

        # 启动 Django 开发服务器
        super().handle(*args, **options)

        # 停止子进程
        redis_process.terminate()
        celery_process.terminate()
