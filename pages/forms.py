from django import forms

from .models import ContactForm


class Contact(forms.ModelForm):
    class Meta:
        model = ContactForm
        fields = ['name', 'subject', 'email', 'message']
