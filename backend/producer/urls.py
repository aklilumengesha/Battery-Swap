from django.urls import path

from producer.views import ManageCompanies, ManageCompany, UpdateCompany


urlpatterns = [
    path("companies/", ManageCompanies.as_view(), name="manage_companies"),
    path("company/<int:pk>/", ManageCompany.as_view(), name="manage_company"),
    path("update-company/", UpdateCompany.as_view(), name="update_company"),
]
