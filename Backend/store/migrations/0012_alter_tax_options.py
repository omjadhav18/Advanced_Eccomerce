# Generated by Django 4.2 on 2024-08-24 11:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0011_tax'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tax',
            options={'ordering': ['country'], 'verbose_name_plural': 'Taxes'},
        ),
    ]
