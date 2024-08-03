# tests.py
from django.test import TestCase
from django.utils import timezone
from .serializers import RegisterSerializer, UserInfoSerializer
from .models import User, Company
from .views import RegisterView, CreateCompanyView
from django.core.exceptions import ValidationError 
from django.urls import reverse, resolve
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken



# test For models.py
class UserModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            username="testuser",
            password="testpassword",
            name="Test User",
            email="testuser@example.com",
            bio="Test Bio",
        )

    def test_user_creation(self):
        """
        test user creation
        """
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "testuser@example.com")
        self.assertEqual(self.user.bio, "Test Bio")

    def test_user_string_representation(self):
        """
        test user string representation
        """
        self.assertEqual(str(self.user), "testuser")

    def test_username_uniqueness(self):
        """
        test username uniqueness constraint.
        """
        with self.assertRaises(Exception):
            User.objects.create(
                username="testuser",
                password="anotherpassword",
                email="anotheremail@example.com"
            )

    def test_email_format(self):
        """
        test email format validation.
        """
        user = User(
            username="anotheruser",
            password="anotherpassword",
            email="invalidemailformat"
        )
        with self.assertRaises(ValidationError):
            user.full_clean()  # raises ValidationError

    def test_nullable_fields(self):
        """
        test nullable fields.
        """
        user = User.objects.create(
            username="anotheruser",
            password="anotherpassword",
            email="anotheremail@example.com"
        )
        self.assertIsNone(user.reset_password_token)
        self.assertIsNone(user.reset_password_sent_at)
        self.assertEqual(user.bio, "Nothing")  # default value for bio field.

    def test_user_update(self):
        """
        test user update
        """
        self.user.bio = "This is a new bio"
        self.user.save()
        updated_user = User.objects.get(id=self.user.id)
        self.assertEqual(updated_user.bio, "This is a new bio")

class CompanyModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            username="boss",
            password="password123",
            email="boss@example.com"
        )
        self.company = Company.objects.create(
            name="Test Company",
            phone_number="1234567890",
            boss_id=self.user,
            email="company@example.com",
            ABN="123456789",
            address="123 Test St, Test City, Test State",
        )

    def test_company_creation(self):
        """
        test if Company model instance is created successfully.
        """
        self.assertEqual(self.company.name, "Test Company")
        self.assertEqual(self.company.phone_number, "1234567890")
        self.assertEqual(self.company.boss_id, self.user)
        self.assertEqual(self.company.email, "company@example.com")
        self.assertEqual(self.company.ABN, "123456789")
        self.assertEqual(self.company.address, "123 Test St, Test City, Test State")
        self.assertIsNotNone(self.company.create_date)
        self.assertIsNotNone(self.company.update_date)

    def test_name_uniqueness(self):
        """
        test if Company model instance's name field is unique.
        """
        with self.assertRaises(Exception):
            Company.objects.create(
                name="Test Company",  # Duplicate name
                phone_number="0987654321",
                boss_id=self.user,
                email="anothercompany@example.com",
                ABN="987654321",
                address="321 Test St, Test City, Test State",
            )



# test For serializers.py
class RegisterSerializerTest(TestCase):

    def setUp(self):
        self.valid_data = {
            "username": "testuser",
            "password": "testpassword123",
            "confirm_password": "testpassword123",
            "name": "Test User",
            "email": "testuser@example.com",
            "bio": "Test Bio"
        }
        self.invalid_data = {
            "username": "testuser",
            "password": "testpassword123",
            "confirm_password": "wrongpassword",
            "name": "Test User",
            "email": "invalidemail",
            "bio": "Test Bio"
        }

    def test_valid_data(self):
        """
        test valid data serializer.
        """
        serializer = RegisterSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['username'], self.valid_data['username'])
        self.assertEqual(serializer.validated_data['email'], self.valid_data['email'])

    def test_invalid_email(self):
        """
        test invalid email format.
        """
        data = self.valid_data.copy()
        data['email'] = 'invalidemail'
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_password_mismatch(self):
        """
        test password mismatch.
        """
        serializer = RegisterSerializer(data=self.invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('confirm_password', serializer.errors)

    def test_missing_fields(self):
        """
        test missing required fields.
        """
        data = self.valid_data.copy()
        del data['username']
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_password_write_only(self):
        """
        test password field is write only.
        """
        serializer = RegisterSerializer(data=self.valid_data)
        serializer.is_valid()
        self.assertNotIn('password', serializer.data)
   
class UserInfoSerializerTest(TestCase):

    def setUp(self): 
        # creat company instance
        self.company = Company.objects.create(
            name="Test Company",
            phone_number="1234567890",
            email="company@example.com",
            ABN="123456789",
            address="123 Test St, Test City, Test State"
        )
        
        # create user with company
        self.user_with_company = User.objects.create(
            username="user_with_company",
            password="password123",
            email="user_with_company@example.com",
            name="User With Company",
            company=self.company
        )

        # create user without company
        self.user_without_company = User.objects.create(
            username="user_without_company",
            password="password123",
            email="user_without_company@example.com",
            name="User Without Company"
        )

    def test_user_with_company(self):
        """
        test if UserInfoSerializer returns correct data for user with company.
        """
        serializer = UserInfoSerializer(self.user_with_company)
        data = serializer.data
        self.assertEqual(data['company'], self.company.name)
        self.assertEqual(data['username'], self.user_with_company.username)
        self.assertEqual(data['email'], self.user_with_company.email)

    def test_user_without_company(self):
        """
        test if UserInfoSerializer returns correct data for user without company.
        """
        serializer = UserInfoSerializer(self.user_without_company)
        data = serializer.data
        self.assertIsNone(data['company'])
        self.assertEqual(data['username'], self.user_without_company.username)
        self.assertEqual(data['email'], self.user_without_company.email)




# test For views.py

class RegisterViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('register')  # 假设 URL 名称为 'register'
        self.valid_data = {
            "username": "testuser",
            "password": "testpassword123",
            "confirm_password": "testpassword123",
            "name": "Test User",
            "email": "testuser@example.com",
            "bio": "Test Bio"
        }
        self.invalid_email_data = {
            "username": "testuser2",
            "password": "testpassword123",
            "confirm_password": "testpassword123",
            "name": "Test User",
            "email": "invalidemail",
            "bio": "Test Bio"
        }
        self.mismatched_password_data = {
            "username": "testuser3",
            "password": "testpassword123",
            "confirm_password": "wrongpassword",
            "name": "Test User",
            "email": "testuser3@example.com",
            "bio": "Test Bio"
        }
        self.existing_user_data = {
            "username": "existinguser",
            "password": "testpassword123",
            "confirm_password": "testpassword123",
            "name": "Existing User",
            "email": "existinguser@example.com",
            "bio": "Existing Bio"
        }
        self.existing_user = User.objects.create_user(
            username="existinguser",
            password="testpassword123",
            email="existinguser@example.com",
            bio="Existing Bio"
        )

    def test_register_success(self):
        """
        test successful registration.
        """
        response = self.client.post(self.url, data=self.valid_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], self.valid_data['username'])
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)

    def test_register_existing_username(self):
        """
        test username already exists.
        """
        response = self.client.post(self.url, data=self.existing_user_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Username already exists.")

    def test_register_password_mismatch(self):
        """

        test password mismatch.
        """
        response = self.client.post(self.url, data=self.mismatched_password_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Passwords do not match")

    def test_register_invalid_email(self):
        """
        test invalid email format.
        """
        response = self.client.post(self.url, data=self.invalid_email_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Please enter a valid email address.")

    def test_register_missing_fields(self):
        """
        test missing required fields.
        """
        data = self.valid_data.copy()
        del data['username']
        response = self.client.post(self.url, data=data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)




# test For urls.py
class URLTests(TestCase):

    def test_register_url_resolves(self):
        """
        test if 'register' URL name is mapped to RegisterView view.
        """
        url = reverse('register')
        self.assertEqual(resolve(url).func.view_class, RegisterView)
        
    def test_create_company_url_resolves(self):
        """
        test if 'create-company' URL name is mapped to CreateCompanyView view.
        """
        url = reverse('create-company')
        self.assertEqual(resolve(url).func.view_class, CreateCompanyView)
        
