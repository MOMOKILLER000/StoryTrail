import jwt
import datetime
from django.conf import settings
from rest_framework.parsers import JSONParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from .serializers import LoginSerializer, SignupSerializer, ProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser

class LoginView(APIView):
    parser_classes = [JSONParser]
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'refresh': str(refresh),
                'access': access_token,
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignupView(APIView):
    parser_classes = [JSONParser]
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'refresh': str(refresh),
                'access': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'username': user.username,
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    # MultiPartParser handles multipart/form-data; FormParser handles urlencoded form data
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        """
        Partial update: only fields present in request.data (and request.FILES)
        will be changed on the user instance.
        """
        user = request.user
        serializer = ProfileSerializer(user, data=request.data, partial=True)

        # Debugging—remove or comment out in production
        print("FILES:", request.FILES)
        print("DATA:", request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        """
        Full update fallback: behaves exactly like patch(), so you won't
        accidentally wipe out the image when you omit it.
        """
        return self.patch(request, *args, **kwargs)