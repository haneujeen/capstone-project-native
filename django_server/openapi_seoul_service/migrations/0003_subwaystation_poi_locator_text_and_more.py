# Generated by Django 4.2.3 on 2023-08-01 22:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('openapi_seoul_service', '0002_subwaystationinformation'),
    ]

    operations = [
        migrations.AddField(
            model_name='subwaystation',
            name='POI_locator_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='subwaystation',
            name='accessibility_information_text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
