# Generated by Django 3.0.6 on 2024-06-25 10:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0007_upfile'),
    ]

    operations = [
        migrations.AddField(
            model_name='upfile',
            name='userid',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='UserFiles', to='invoice.User'),
        ),
    ]