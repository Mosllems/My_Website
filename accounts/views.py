from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import PublicProfileSerializer

User = get_user_model()


class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = User.objects.filter(username='moslem').first()
        if user is None:
            return Response({'detail': 'Profile not found.'}, status=404)
        serializer = PublicProfileSerializer(user)
        return Response(serializer.data)
