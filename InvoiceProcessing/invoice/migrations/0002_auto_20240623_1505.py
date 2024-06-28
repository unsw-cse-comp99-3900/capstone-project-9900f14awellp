# Generated by Django 3.0.6 on 2024-06-23 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='logo',
            field=models.URLField(blank=True, null=True, verbose_name='Company Logo'),
        ),
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.URLField(blank=True, null=True, verbose_name='Avatar'),
        ),
    ]