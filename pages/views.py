from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.throttling import AnonRateThrottle
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination


class ContactThrottle(AnonRateThrottle):
    scope = 'contact'

from pages.models import Category, ContactForm, Interest, Education, Skill, Experience, Project
from .serializers import CategorySerializer, SkillSerializer, InterestSerializer, EducationSerializer, ExperienceSerializer, ContactFormSerializer, ProjectListSerializer, ProjectDetailSerializer
from .permissions import IsAdminOrReadOnly



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


class ProjectViewSet(ReadOnlyModelViewSet):
    queryset = Project.objects.filter(is_visible=True).prefetch_related("images")
    permission_classes = [AllowAny]
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter]
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectDetailSerializer
