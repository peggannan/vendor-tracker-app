from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignupSerializer, LoginSerializer, ChangePasswordSerializer, ProfileSerializer

# Create your views here.

User = get_user_model()

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'data': {
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email

                    }
                }
            }, status=status.HTTP_201_CREATED)
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': serializer.errors

            }
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            #checking if user exists
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': 'Invalid username or password'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            #checking password 
            if not user.check_password(password):
                return Response({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': 'Invalid username or password'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            #generating token 
            refresh = RefreshToken.for_user(user)
            return Response({
                'data': {
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': {
                        'id':user.id,
                        'username': user.username,
                        'email': user.email

                    }

                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': 'Refresh token is required'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({
                'data': {
                    'message': 'Logged out successfully'
                }
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Invalid or expired token'
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user

            #checking if the current password is correct 
            if not user.check_password(serializer.validated_data['current_password']):
                return Response({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': 'Current password is incorrect'
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            #setting new password 
            user.set_password(serializer.validated_data['new_password'])
            user.save()

            return Response({
                'data': {
                    'message': 'Password updated successfully'
                }

            }, status=status.HTTP_200_OK)
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)
    


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(
            request.user,
            context={'request': request}
        )
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)

