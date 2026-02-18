# AI-Powered Support Ticket System

A full-stack support ticket system with AI-based classification,
built with Django, React, and PostgreSQL. Runs with a single command.

---

## Tech Stack

- **Backend**: Django + Django REST Framework
- **Frontend**: React (Vite)
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Infrastructure**: Docker + Docker Compose

---

## Features

- Create support tickets with AI-assisted classification
- Auto-suggest category and priority using LLM
- List, filter, and search tickets
- Update ticket status
- Stats dashboard with real-time aggregations
- Fully containerized with Docker

---

## Project Structure
```
Tickect_Support_System/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env
├── manage.py
├── core/
│   ├── settings.py
│   └── urls.py
├── tickets/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── services.py
│   └── urls.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
```

---

## Environment Variables

Create a `.env` file in the root directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
POSTGRES_DB=support_ticket_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

Get your free Gemini API key at:
https://aistudio.google.com/apikey

---

## How to Run

### Single Command
```
docker-compose up --build
```

This will automatically:
- Start PostgreSQL
- Run Django migrations
- Start Django backend
- Start React frontend

### Access the Application

| Service | URL |
|---|---|
| React Frontend | http://localhost:3000 |
| Django API | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tickets/ | List + filter tickets |
| POST | /api/tickets/create/ | Create a ticket |
| PATCH | /api/tickets/<id>/ | Update ticket |
| GET | /api/tickets/stats/ | Get statistics |
| POST | /api/tickets/classify/ | AI classification |

### Filter Parameters
```
GET /api/tickets/?category=billing
GET /api/tickets/?priority=high
GET /api/tickets/?status=open
GET /api/tickets/?search=login
```

### Create Ticket Request
```json
{
  "title": "Cannot access billing dashboard",
  "description": "I am unable to view my invoices",
  "category": "billing",
  "priority": "high"
}
```

### Classify Request
```json
{
  "description": "I cannot log into my account"
}
```

### Classify Response
```json
{
  "suggested_category": "account",
  "suggested_priority": "high"
}
```

---

## Data Model

| Field | Type | Details |
|---|---|---|
| title | CharField | Max 200 chars, required |
| description | TextField | Required |
| category | CharField | billing, technical, account, general |
| priority | CharField | low, medium, high, critical |
| status | CharField | open, in_progress, resolved, closed |
| created_at | DateTime | Auto set |

---

## Screens

**Screen 1 — Create Ticket**
- Fill title and description
- AI auto-classifies category and priority
- User can override suggestions
- Submit saves ticket

**Screen 2 — Ticket List**
- View all tickets
- Filter by category, priority, status
- Search by keyword
- Update ticket status inline

**Screen 3 — Stats Dashboard**
- Total tickets
- Open tickets
- Average tickets per day
- Priority breakdown
- Category breakdown

---

## Stopping the Application
```
docker-compose down
```

---

## Notes

- AI classification fails gracefully if API key is invalid or quota exceeded
- Ticket creation works even if AI classification fails
- All ENUM constraints enforced at database level
```

---

Save this as `README.md` in your **root folder** and you are **100% done!** 🎉

---

## 🏆 Final Submission Checklist
```
Full source code          ✅
docker-compose.yml        ✅
Dockerfiles               ✅
README.md                 ✅
.git folder               ✅ (you used git throughout)
Single command run        ✅