# Generated by Django 4.2.13 on 2024-06-28 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoice", "0010_alter_company_id_alter_upfile_id_alter_user_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="company",
            name="ABN",
            field=models.CharField(default="000", max_length=20, verbose_name="ABN"),
        ),
    ]