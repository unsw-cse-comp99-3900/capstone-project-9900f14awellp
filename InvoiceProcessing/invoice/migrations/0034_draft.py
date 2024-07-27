# Generated by Django 4.2.13 on 2024-07-26 20:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0033_rename_gross_order_amount_remove_guifile_bank_branch"),
    ]

    operations = [
        migrations.CreateModel(
            name="Draft",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("invoice_name", models.CharField(default="", max_length=30)),
                ("uuid", models.CharField(default="", max_length=30)),
                ("invoice_num", models.CharField(default="", max_length=20)),
                ("my_company_name", models.CharField(default="", max_length=255)),
                ("my_address", models.CharField(default="", max_length=255)),
                ("my_abn", models.CharField(default="", max_length=20)),
                ("my_email", models.EmailField(default="", max_length=254)),
                ("client_company_name", models.CharField(default="", max_length=100)),
                ("client_address", models.CharField(default="", max_length=100)),
                ("client_abn", models.CharField(default="", max_length=100)),
                ("client_email", models.EmailField(default="", max_length=254)),
                ("bank_name", models.CharField(default="", max_length=255)),
                ("currency", models.CharField(default="", max_length=255)),
                ("account_num", models.CharField(default="", max_length=20)),
                ("bsb_num", models.CharField(default="", max_length=20)),
                ("account_name", models.CharField(default="", max_length=255)),
                ("issue_date", models.DateField()),
                ("due_date", models.DateField()),
                ("subtotal", models.CharField(default="", max_length=20)),
                ("gst_total", models.CharField(default="", max_length=20)),
                ("total_amount", models.CharField(default="", max_length=20)),
                ("note", models.TextField(default="")),
                ("orders", models.ManyToManyField(to="invoice.order")),
                (
                    "userid",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="GUIFileDraft",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
