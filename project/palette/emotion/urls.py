from django.urls import path
from . import views

app_name = 'emotion'

urlpatterns = [
   path('total/', views.total),
   path('search/', views.search),
   
   path('calendar/', views.calendar),

   path('save/', views.save),
   path('text/', views.text),
   path('result/', views.result),
   path('qr/', views.qr),
   path('mk/', views.mk)
]