from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


class TicketClassifySerializer(serializers.Serializer):
    description = serializers.CharField(
        help_text="The content of the ticket to be classified.",
        required=True
    )