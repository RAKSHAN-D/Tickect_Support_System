from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Ticket
from .serializers import TicketSerializer, TicketClassifySerializer
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404
from .services import classify_ticket_description


class TicketCreateView(APIView):

    def post(self, request):
        serializer = TicketSerializer(data=request.data)

        if serializer.is_valid():
            ticket = serializer.save()
            return Response(
                TicketSerializer(ticket).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketListView(APIView):

    def get(self, request):
        queryset = Ticket.objects.all().order_by('-created_at')
        
        # Filtering
        category = request.query_params.get('category')
        priority = request.query_params.get('priority')
        status_filter = request.query_params.get('status')
        search = request.query_params.get('search')

        if category:
            queryset = queryset.filter(category=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )

        serializer = TicketSerializer(queryset, many=True)
        return Response(serializer.data)


class TicketUpdateView(APIView):

    def patch(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)

        serializer = TicketSerializer(
            ticket,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketClassifyView(APIView):
    serializer_class = TicketClassifySerializer

    def get(self, request):
        return Response({
            "message": "This endpoint requires a POST request with a 'description' field.",
            "example_body": {
                "description": "The internet is not working."
            }
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            description = serializer.validated_data.get("description")
            result = classify_ticket_description(description)
            return Response(result)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketStatsView(APIView):

    def get(self, request):

        total_tickets = Ticket.objects.count()

        open_tickets = Ticket.objects.filter(status='open').count()

        # Priority breakdown
        priority_breakdown = (
            Ticket.objects
            .values('priority')
            .annotate(count=Count('id'))
        )

        # Category breakdown
        category_breakdown = (
            Ticket.objects
            .values('category')
            .annotate(count=Count('id'))
        )

        # Average tickets per day
        tickets_per_day = (
            Ticket.objects
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
        )

        avg_tickets_per_day = (
            sum(item['count'] for item in tickets_per_day) / tickets_per_day.count()
            if tickets_per_day.exists() else 0
        )

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_per_day": round(avg_tickets_per_day, 2),
            "by_priority": list(priority_breakdown),
            "by_category": list(category_breakdown)
        })