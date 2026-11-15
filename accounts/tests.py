from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()


class ProfileApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_superuser(
            "moslem",
            password="pw12345!",
            first_name="Moslem",
            email="private@example.com",
            phone_number="09120000000",
            address="Secret street 1",
            age="2000-01-01",
            bio="Hello",
            github="https://github.com/x",
        )

    def test_profile_is_public(self):
        response = self.client.get("/api/profile/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["first_name"], "Moslem")
        self.assertEqual(response.data["bio"], "Hello")
        # email is deliberately public so visitors can contact the owner
        self.assertEqual(response.data["email"], "private@example.com")

    def test_profile_does_not_leak_private_fields(self):
        response = self.client.get("/api/profile/")
        for field in ("phone_number", "address", "age"):
            self.assertNotIn(field, response.data)

    def test_profile_404_when_owner_missing(self):
        self.owner.delete()
        self.assertEqual(self.client.get("/api/profile/").status_code, 404)


class RegistrationTests(TestCase):
    """Public registration is intentionally disabled."""

    def test_anonymous_cannot_register(self):
        response = APIClient().post(
            "/auth/users/",
            {"username": "hacker", "email": "h@example.com", "password": "pw12345!Strong"},
        )
        self.assertIn(response.status_code, (401, 403))
        self.assertFalse(User.objects.filter(username="hacker").exists())
