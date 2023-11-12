"""Pred URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from Predict import views
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('trainTemp/', views.trainTemp_view, name='temperature'),
    path('trainHum/', views.trainHum_view, name='humidite'),
    path('trainCom/', views.trainCom_view, name='com'),
    path('trainVol/', views.trainVol_view, name='voltage'),
    
    path('TestTemp/', views.test_temperature_model_view, name='Ttemp'),
    path('TestHum/', views.test_humidite_view, name='Thum'),
    path('TestCom/', views.test_Com_view, name='TCom'),
    path('TestVol/', views.test_voltage_view, name='Tvol'),

    path('PredTemp/', views.predict_temperature_view, name='Ptemp'),
    path('PredHum/', views.predict_humidity_view, name='Phum'),
    path('PredVol/', views.predict_voltage_view, name='Pvol'),
    path('PredCom/', views.predict_Com_view, name='Pvol'),
]
