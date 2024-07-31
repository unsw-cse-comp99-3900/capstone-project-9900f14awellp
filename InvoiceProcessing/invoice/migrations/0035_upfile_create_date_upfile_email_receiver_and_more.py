# Generated by Django 4.2.13 on 2024-07-27 17:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0034_draft"),
    ]

    operations = [
        migrations.AddField(
            model_name="upfile",
            name="create_date",
            field=models.DateTimeField(
                auto_now_add=True, default="2000-01-01", verbose_name="Create Date"
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="upfile",
            name="email_receiver",
            field=models.CharField(
                default="", max_length=30, verbose_name="Email Receiver"
            ),
        ),
        migrations.AddField(
            model_name="upfile",
            name="sending_date",
            field=models.DateTimeField(
                default="2000-01-01", verbose_name="Validation Date"
            ),
        ),
        migrations.AddField(
            model_name="upfile",
            name="validation_date",
            field=models.DateTimeField(
                default="2000-01-01", verbose_name="Validation Date"
            ),
        ),
        migrations.AlterField(
            model_name="draft",
            name="userid",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="GUIFileDraf",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="account_name",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="account_num",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="bank_name",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="bsb_num",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="client_abn",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="client_address",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="client_company_name",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="currency",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="gst_total",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="invoice_name",
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="invoice_num",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="my_abn",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="my_address",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="my_company_name",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="my_email",
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="subtotal",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="total_amount",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="guifile",
            name="uuid",
            field=models.CharField(max_length=30),
        ),
    ]