from rest_framework import serializers

from .models import Category, Skill, Interest, Education, Experience, ContactForm


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
