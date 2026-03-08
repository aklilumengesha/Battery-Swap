from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from producer.models import Company, Producer
from producer.serializers import CompanySerializer


class ManageCompanies(generics.ListCreateAPIView):
    serializer_class = CompanySerializer
    queryset = Company.objects.all()


class ManageCompany(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CompanySerializer
    queryset = Company.objects.all()


class UpdateCompany(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        if request.user.user_type != 'producer':
            return Response(
                {'success': False, 'message': 'Only producers can update company'},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            producer = Producer.objects.get(user=request.user)
            company_name = request.data.get('company_name', '').strip()

            if not company_name:
                return Response(
                    {'success': False, 'message': 'Company name is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            producer.company.name = company_name
            producer.company.save()

            return Response(
                {
                    'success': True,
                    'message': 'Company updated successfully',
                    'company_name': company_name,
                }
            )
        except Producer.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Producer profile not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
