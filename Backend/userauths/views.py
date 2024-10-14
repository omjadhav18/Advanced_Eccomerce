from django.shortcuts import render 
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework  import generics,status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import User,Profile
from .serializers import MyTokenObtainSerializer,RegisterSerializer,UserSerializer,ProfileSerializer
import shortuuid
import random

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes= (AllowAny,)


def generate_otp():
    uuid_key = shortuuid.uuid()
    unique_key = uuid_key[:6]
    return unique_key


class PasswordResetEmailVerify(generics.RetrieveAPIView):
    permission_classes=(AllowAny,)
    serializer_class= UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)
        
        if user:
            user.otp = generate_otp()
            user.save()

            uuid64 = user.pk
            otp = user.otp
            link = f"http://localhost:5173/create-new-password?otp={otp}&uuid64={uuid64}"

            print(link)
        return user
    
class PasswordChangeView(generics.CreateAPIView):
    permission_classes=(AllowAny,)
    serializer_class=UserSerializer

    def create(self,request):
        payload = request.data
        
        otp=payload['otp']
        uuid64 = payload['uuid64']
        password = payload['password']

        user = User.objects.get(id=uuid64,otp=otp)

        if user:
            user.set_password(password)
            user.otp=''
            user.save()

            return Response({"message":"password Changed Successfully"},status=status.HTTP_201_CREATED)
        
        else:
            return Response({"message":"An Error Occured"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

           

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class= ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)

        return profile
