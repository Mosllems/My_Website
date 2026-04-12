from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # You can add additional fields here if needed
    age = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(blank=True)
    website = models.URLField(max_length=250, blank=True) 
    github = models.URLField(max_length=250, blank=True)
    linkedin = models.URLField(max_length=250, blank=True)
    bio = models.TextField(blank=True)


    def __str__(self):
        return self.username
