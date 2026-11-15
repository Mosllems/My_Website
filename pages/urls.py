from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter    


router = DefaultRouter()

router.register("categories", views.CategoryViewSet, basename="category")
router.register("skills", views.SkillViewSet, basename="skill")
router.register("interests", views.InterestViewSet, basename="interest")
router.register("education", views.EducationViewSet, basename="education")
router.register("experience", views.ExperienceViewSet, basename="experience")
router.register("contact", views.ContactFormViewSet, basename="contact")
router.register("projects", views.ProjectViewSet, basename="project")


urlpatterns = router.urls
