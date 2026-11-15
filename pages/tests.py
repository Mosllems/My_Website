from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from pages.models import Category, ContactForm, Project

User = get_user_model()


class ContentPermissionTests(TestCase):
    """Content endpoints: anyone can read, only staff can write."""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Backend")
        self.staff = User.objects.create_user("staff", password="pw12345!", is_staff=True)
        self.normal = User.objects.create_user("normal", password="pw12345!")

    def test_anonymous_can_read(self):
        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, 200)

    def test_anonymous_cannot_write(self):
        response = self.client.post("/api/categories/", {"name": "New"})
        self.assertIn(response.status_code, (401, 403))
        self.assertFalse(Category.objects.filter(name="New").exists())

    def test_non_staff_user_cannot_write(self):
        self.client.force_authenticate(self.normal)
        response = self.client.post("/api/categories/", {"name": "New"})
        self.assertEqual(response.status_code, 403)

    def test_staff_can_write(self):
        self.client.force_authenticate(self.staff)
        response = self.client.post("/api/categories/", {"name": "New"})
        self.assertEqual(response.status_code, 201)


class ContactFormTests(TestCase):
    """Anyone may send a message, but only admins may read them."""

    payload = {
        "name": "Visitor",
        "email": "visitor@example.com",
        "subject": "Hello",
        "message": "Nice site!",
    }

    def setUp(self):
        cache.clear()  # the throttle counter lives in the cache
        self.client = APIClient()

    def test_anonymous_can_send_message(self):
        response = self.client.post("/api/contact/", self.payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactForm.objects.count(), 1)

    def test_invalid_email_is_rejected(self):
        response = self.client.post("/api/contact/", {**self.payload, "email": "nope"})
        self.assertEqual(response.status_code, 400)

    def test_anonymous_cannot_list_messages(self):
        response = self.client.get("/api/contact/")
        self.assertIn(response.status_code, (401, 403))

    def test_throttle_blocks_after_ten_requests(self):
        for _ in range(10):
            self.assertEqual(self.client.post("/api/contact/", self.payload).status_code, 201)
        self.assertEqual(self.client.post("/api/contact/", self.payload).status_code, 429)


class ProjectApiTests(TestCase):
    """Projects API is read-only and only shows visible projects."""

    def setUp(self):
        self.client = APIClient()
        self.visible = Project.objects.create(
            github_id=1, name="Visible", repository_url="https://github.com/x/visible", is_visible=True
        )
        self.hidden = Project.objects.create(
            github_id=2, name="Hidden", repository_url="https://github.com/x/hidden", is_visible=False
        )

    def test_list_only_returns_visible_projects(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, 200)
        names = [p["name"] for p in response.data["results"]]
        self.assertEqual(names, ["Visible"])

    def test_hidden_project_detail_is_404(self):
        response = self.client.get(f"/api/projects/{self.hidden.pk}/")
        self.assertEqual(response.status_code, 404)

    def test_visible_project_detail_works(self):
        response = self.client.get(f"/api/projects/{self.visible.pk}/")
        self.assertEqual(response.status_code, 200)

    def test_search_filters_by_name(self):
        response = self.client.get("/api/projects/?search=zzz")
        self.assertEqual(response.data["results"], [])

    def test_projects_are_read_only(self):
        self.client.force_authenticate(User.objects.create_user("a", password="pw12345!", is_staff=True))
        response = self.client.post("/api/projects/", {"name": "X"})
        self.assertEqual(response.status_code, 405)
