# Generated by Django 4.2.3 on 2023-07-16 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('openapi_seoul_service', '0002_subwaystation_next_station'),
    ]

    operations = [
        migrations.AddField(
            model_name='subwaystation',
            name='station_id',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='subwaystation',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='subwaystation',
            name='next_station',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterUniqueTogether(
            name='subwaystation',
            unique_together={('station_id', 'direction')},
        ),
    ]