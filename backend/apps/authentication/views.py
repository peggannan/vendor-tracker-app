import requests
from django.shortcuts import render
import os
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignupSerializer, LoginSerializer, ChangePasswordSerializer, ProfileSerializer

from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings
from django.core.mail import send_mail
from .serializers import ForgotPasswordSerializer, ResetPasswordSerializer

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
    

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        # always return success even if email not found
        # this prevents email enumeration attacks
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'data': {
                    'message': 'If an account with that email exists you will receive a reset link'
                }
            }, status=status.HTTP_200_OK)

        # generate token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # build reset link
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        reset_link = f'{frontend_url}/reset-password?uid={uid}&token={token}'

        # send email
        emailjs_data = {
            'service_id': os.getenv('EMAILJS_SERVICE_ID'),
            'template_id': os.getenv('EMAILJS_TEMPLATE_ID'),
            'user_id': os.getenv('EMAILJS_PUBLIC_KEY'),
            'accessToken': os.getenv('EMAILJS_PRIVATE_KEY'),
            'template_params': {
                'to_email': user.email,
                'reset_link': reset_link,
            },
        }

        response = requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            json=emailjs_data,
            headers={'Content-Type': 'application/json'},
        )
        if response.status_code != 200:
            # Helps you trace errors directly in your Render terminal logs
            print(f'EmailJS failure reason: {response.text}')

            return Response(
                {
                    'error': {
                        'code': 'SERVER_ERROR',
                        'message': 'Failed to send email',
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


        return Response({
            'data': {
                'message': 'If an account with that email exists you will receive a reset link'
            }
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        # get uid from request
        uid = request.data.get('uid')
        if not uid:
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'UID is required'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # decode uid and get user
        try:
            user_pk = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_pk)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Invalid reset link'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # verify token
        if not default_token_generator.check_token(user, token):
            return Response({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Reset link is invalid or has expired'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # set new password
        user.set_password(new_password)
        user.save()

        return Response({
            'data': {
                'message': 'Password reset successfully'
            }
        }, status=status.HTTP_200_OK)
    

class TestEmailView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            send_mail(
                subject='Test Email to Buyer',
                message='Hello! This is a test email to confirm our mail server connection works.',
                from_email=None,  # This tells Django to use DEFAULT_FROM_EMAIL automatically
                recipient_list=['aggreybernard3@gmail.com'], 
                fail_silently=False,
            )
            return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

