from django.urls import path

from .views import (
    TicketCreateView,
    TicketListView,
    TicketStatsView,
    TicketUpdateView,
    TicketClassifyView
)

urlpatterns = [
    path('tickets/',          TicketListView.as_view(),   name='ticket-list'),
    path('tickets/create/',   TicketCreateView.as_view(), name='ticket-create'),
    path('tickets/stats/',    TicketStatsView.as_view(),  name='ticket-stats'),
    path('tickets/classify/', TicketClassifyView.as_view(), name='ticket-classify'),
    path('tickets/<int:pk>/', TicketUpdateView.as_view(), name='ticket-update'),
]