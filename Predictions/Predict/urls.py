# yourappname/urls.py
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^trainTemp/$', views.trainSensor_view, name='temperature'),
]
