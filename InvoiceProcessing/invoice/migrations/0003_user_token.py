# Generated by Django 3.0.6 on 2024-06-23 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0002_auto_20240623_1505'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='token',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Token'),
        ),
    ]
