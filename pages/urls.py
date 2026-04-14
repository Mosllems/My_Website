from django.urls import path
from . import views

app_name = 'pages' # we must write the apps'name here, because once the project get bigger calling the urls will be harder, and by app name we can distinguish them from eachother


urlpatterns = [
    path('', views.HomePageView.as_view(), name='home'),
    path('about/', views.AboutPageView.as_view(), name='about'),
    path('resume/', views.ResumePageView.as_view(), name='resume'),
    path('contact/', views.ContactPageView.as_view(), name='contact'),
]