# Generated by Django 4.2 on 2024-09-19 16:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0015_cartorderitem_coupon'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cartorderitem',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='store.cartorder'),
        ),
    ]
