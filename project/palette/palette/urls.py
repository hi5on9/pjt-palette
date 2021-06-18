from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from emotion import views
urlpatterns = [
   path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('emotion/', include('emotion.urls')),
    path('', views.apk)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
