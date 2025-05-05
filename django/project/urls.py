"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import ArtistViewSet, AgentViewSet, ConcertsByFiltersView, ConcertsPerArtistView, ConcertsPerLocationView, ConcertsPerOrganizerView, OrganizerViewSet, LocationViewSet, ConcertViewSet
from django.views.generic import RedirectView  # if using redirect

router = routers.DefaultRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'agents', AgentViewSet)
router.register(r'organizers', OrganizerViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'concerts', ConcertViewSet)

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('api/', include(router.urls)),
    path('api/concerts-per-artist/', ConcertsPerArtistView.as_view()),
    path('api/concert-report/', ConcertsByFiltersView.as_view()),
    path('api/concerts-per-organizer/', ConcertsPerOrganizerView.as_view()),
    path('api/concerts-per-location/', ConcertsPerLocationView.as_view()),
    path('', RedirectView.as_view(url='/api/', permanent=False)), # auto redirects to API, always use permanent=False
]