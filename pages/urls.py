from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter    

# app_name = 'pages' # we must write the apps'name here, because once the project gets bigger calling the urls will be harder, and by app name we can distinguish them from eachother

router = DefaultRouter()

router.register("categories", views.CategoryViewSet, basename="category")
router.register("skills", views.SkillViewSet, basename="skill")
router.register("interests", views.InterestViewSet, basename="interest")
router.register("education", views.EducationViewSet, basename="education")
router.register("experience", views.ExperienceViewSet, basename="experience")
router.register("contact", views.ContactFormViewSet, basename="contact")


urlpatterns = router.urls



# urlpatterns = [
#     path('', views.HomePageView.as_view(), name='home'),
#     path('about/', views.AboutPageView.as_view(), name='about'),
#     path('resume/', views.ResumePageView.as_view(), name='resume'),
#     path('contact/', views.ContactPageView.as_view(), name='contact'),
# ]