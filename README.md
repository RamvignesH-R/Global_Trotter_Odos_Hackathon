# GlobeTrotter – Smart Travel Planning Application

GlobeTrotter is a **full-stack travel planning web application** that allows users to plan trips, build day-wise itineraries, add activities with budgets, and automatically calculate total trip costs.

The application uses a **FastAPI backend**, a **React (Vite) frontend**, and **SQLAlchemy** for database management.

---

## Team Details

| Name           | Email                                    |
|----------------|------------------------------------------|
| Ramvignesh R   | ramvigneshr2004@gmail.com                |
| Ritujaa B G    | bgritujaa2006@gmail.com                  |


### Demo Video link : 

## Features

### User Management
- User registration and login
- User-specific trip handling

### Trip Planning
- Create trips with start and end dates
- Add multiple cities as trip stops
- Ordered trip stops for proper itinerary flow

### Itinerary Builder
- Automatically generates daily itinerary from trip dates
- Add activities per day
- Activities are filtered by city

### Budget Tracking
- Each activity has a predefined budget
- Activity budget is shown on each activity card
- Clicking an activity:
  - Adds it to the selected day
  - Automatically updates daily and total trip cost

### Budget Calculation
- Dynamic frontend-based budget calculation
- Backend support for estimated trip budget
- Visual budget summary using charts

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Recharts

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite


---

## Backend and Frontend Commands (FastAPI + React)

### Navigate to backend
cd backend

### Create virtual environment
python -m venv venv

### Activate virtual environment
venv\Scripts\activate

### Run FastAPI server
uvicorn main:app --reload

### Navigate to frontend
cd frontend

### Install dependencies
npm install

### Run development server
npm run dev



