from django.shortcuts import render
from django.views import generic
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy

from pages.models import Category, ContactForm, Interest, Education
from pages.forms import Contact



User = get_user_model()


class HomePageView(generic.TemplateView):
    template_name = "home.html"


class AboutPageView(generic.TemplateView):
    template_name = "about.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['me'] = User.objects.get(username='moslem')
        context['categories'] = Category.objects.prefetch_related("skills").all()
        context['interests'] = Interest.objects.all()
        context['education'] = Education.objects.order_by('-created_at').first()
                
        return context


class ResumePageView(generic.TemplateView):
    template_name = "resume.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['me'] = User.objects.get(username='moslem')
        context['education'] = Education.objects.all()

        return context
    

class ContactPageView(generic.FormView):
    template_name = "contact.html"
    form_class = Contact
    success_url = reverse_lazy("pages:contact")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['me'] = User.objects.get(username='moslem')
        
        return context
    
    def form_valid(self, form):

        form.save()
        
        return super().form_valid(form)
