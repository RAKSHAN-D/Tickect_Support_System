from django.db import models
from django.db.models import Q


class Ticket(models.Model):

    CATEGORY_CHOICES = [
        ('billing', 'Billing'),
        ('technical', 'Technical'),
        ('account', 'Account'),
        ('general', 'General'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    # ── Fields ──────────────────────────────────────────
    title = models.CharField(
        max_length=200,
        null=False,
        blank=False
    )

    description = models.TextField(
        null=False,
        blank=False
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        null=False,
        blank=False
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        null=False,
        blank=False
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open',
        null=False,
        blank=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    # ── DB Level Constraints ─────────────────────────────
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(category__in=[
                    'billing',
                    'technical',
                    'account',
                    'general'
                ]),
                name='valid_category'
            ),
            models.CheckConstraint(
                check=Q(priority__in=[
                    'low',
                    'medium',
                    'high',
                    'critical'
                ]),
                name='valid_priority'
            ),
            models.CheckConstraint(
                check=Q(status__in=[
                    'open',
                    'in_progress',
                    'resolved',
                    'closed'
                ]),
                name='valid_status'
            ),
        ]

    # ── String Representation ────────────────────────────
    def __str__(self):
        return f"[{self.priority.upper()}] {self.title} ({self.status})"