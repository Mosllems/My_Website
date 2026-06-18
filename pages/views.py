from django.shortcuts import render
from django.views import generic
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.throttling import AnonRateThrottle


class ContactThrottle(AnonRateThrottle):
    scope = 'contact'

from pages.models import Category, ContactForm, Interest, Education, Skill, Experience
from pages.forms import Contact
from .serializers import CategorySerializer, SkillSerializer, InterestSerializer, EducationSerializer, ExperienceSerializer, ContactFormSerializer
from .permissions import IsAdminOrReadOnly

# User = get_user_model()


#------------ API Views ------------

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class SkillViewSet(ModelViewSet):
    queryset = Skill.objects.select_related("category").all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]

    
class InterestViewSet(ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [IsAdminOrReadOnly]


class EducationViewSet(ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminOrReadOnly]


class ExperienceViewSet(ModelViewSet):
    queryset = Experience.objects.prefetch_related("skills").all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminOrReadOnly]


class ContactFormViewSet(ModelViewSet):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_throttles(self):
        if self.action == 'create':
            return [ContactThrottle()]
        return []


# ------------ Template Views ------------

# class HomePageView(generic.TemplateView):
#     template_name = "home.html"


# class AboutPageView(generic.TemplateView):
#     template_name = "about.html"

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['me'] = User.objects.get(username='moslem')
#         context['categories'] = Category.objects.prefetch_related("skills").all()
#         context['interests'] = Interest.objects.all()
#         context['education'] = Education.objects.order_by('-created_at').first()
                
#         return context


# class ResumePageView(generic.TemplateView):
#     template_name = "resume.html"

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['me'] = User.objects.get(username='moslem')
#         context['education'] = Education.objects.all()

#         return context
    

# class ContactPageView(generic.FormView):
#     template_name = "contact.html"
#     form_class = Contact
#     success_url = reverse_lazy("pages:contact")

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['me'] = User.objects.get(username='moslem')
        
#         return context
    
#     def form_valid(self, form):

#         form.save()
        
#         return super().form_valid(form)
