from django.utils.text import Truncator
from rest_framework import serializers

from .models import Category, Skill, Interest, Education, Experience, ContactForm, Project, ProjectImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        read_only_fields = ['id']


class SkillSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'icon_class', 'icon_type']
        read_only_fields = ['id']


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name', 'icon_class']
        read_only_fields = ['id']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'degree', 'major', 'gpa', 'institution', 'location', 'start_date', 'end_date', 'is_current', 'description']
        read_only_fields = ['id']


class SkillMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']
        read_only_fields = ['id']


class ExperienceSerializer(serializers.ModelSerializer):
    skills = SkillMiniSerializer(many=True, read_only=True)

    class Meta:
        model = Experience
        fields = ['id', 'position', 'company', 'location', 'responsibilities', 'skills', 'start_date', 'end_date', 'is_current', 'description']
        read_only_fields = ['id']


class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = ['id', 'name', 'email', 'subject', 'message']
        read_only_fields = ['id']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'order']
        read_only_fields = ['id']


class ProjectListSerializer(serializers.ModelSerializer):
    short_description = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'short_description', 'cover_image',
            'language', 'tags', 'repository_url', 'website_url', 'is_featured',
        ]
        read_only_fields = fields

    def get_short_description(self, obj):
        return Truncator(obj.description).words(12)

    def get_cover_image(self, obj):
        image = obj.images.first()
        if not image:
            return None
        return self.context["request"].build_absolute_uri(image.image.url)


class ProjectDetailSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'language', 'tags', 'stars', 'pushed_at',
            'repository_url', 'website_url', 'is_featured', 'images',
        ]
        read_only_fields = fields

