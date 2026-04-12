from django.db import models



class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
    
    

class Skill(models.Model):
    ICON_TYPES = (
        ("devicon", "Devicon"),
        ("fa", "FontAwesome"),
    )

    class Meta:
        ordering = ['name']

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=150)
    icon_class = models.CharField(max_length=150, blank=True)
    icon_type = models.CharField(max_length=150, choices=ICON_TYPES, blank=True)

    def __str__(self):
        return self.name
