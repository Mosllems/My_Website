from django.shortcuts import render
from django.views import generic
from django.contrib.auth import get_user_model
from pages.models import Category, Interest


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
                
        return context


