from django.db import models



class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Interest(models.Model):
    name = models.CharField(max_length=150)
    icon_class = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    

class Education(models.Model):
    major = models.CharField(max_length=150)
    degree = models.CharField(max_length=150)
    gpa = models.FloatField()
    institution = models.CharField(max_length=150)
    location = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(blank=True , null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.degree} from {self.institution}"
    

class Experience(models.Model):
    position = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=150)
    responsibilities = models.JSONField(default=list)
    skills = models.ManyToManyField(Skill, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True , null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.position} at {self.company}"


class ContactForm(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=150)
    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name}"
