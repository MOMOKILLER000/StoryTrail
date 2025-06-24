from django.test import TestCase
from . models import User
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from rest_framework import status
from dotenv import load_dotenv
import os

load_dotenv()

# Create your tests here.

class LoginTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.data = {
            "email": "test@gmail.com",
            "password": "test12345",
        }
        self.url = "/api/login/"

        User.objects.create_user(
            email=self.data["email"],
            password=self.data["password"],
            first_name="TEST",
            last_name="TEST",
            username="TEST"
        )

    def test_good_credentials(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_missing_email_field(self):
        data = self.data.copy()
        data.pop("email")
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password_field(self):
        data = self.data.copy()
        data.pop("password")
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_credentials(self):
        data = self.data.copy()
        data["password"] = "wrongpassword"
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class SignupTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.data = {
            "email": "test@gmail.com",
            "password": "test12345",
            "first_name": "TEST",
            "last_name": "TEST",
            "username": "TEST"
        }
        self.url = "/api/signup/"

    def test_complete_signup(self):
        data = self.data
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_no_email_signup(self):
        data = self.data.pop("email")
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_password_signup(self):
        data = self.data.copy().pop("password")
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_firstname_signup(self):
        data = self.data.copy().pop("first_name")
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_lastname_signup(self):
        data = self.data.copy().pop("last_name")
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_username_signup(self):
        data = self.data.copy().pop("username")
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
