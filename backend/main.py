from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

import models
import schemas
from database import get_db, engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GlobeTrotter")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    user_id: int
    name: str
    email: str

@app.post("/users/login", response_model=LoginResponse)
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password (assuming plaintext for now, ideally use hashing)
    if user.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "user_id": user.user_id,
        "name": user.name,
        "email": user.email
    }


@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/trips", response_model=schemas.TripResponse)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(models.User).filter(models.User.user_id == trip.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_trip = models.Trip(**trip.dict())
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip


@app.get("/users/{user_id}/trips", response_model=List[schemas.TripResponse])
def get_user_trips(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Trip).filter(models.Trip.user_id == user_id).all()


@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.trip_id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted"}


@app.post("/cities", response_model=schemas.CityResponse)
def create_city(city: schemas.CityCreate, db: Session = Depends(get_db)):
    new_city = models.City(**city.dict())
    db.add(new_city)
    db.commit()
    db.refresh(new_city)
    return new_city


@app.get("/cities", response_model=List[schemas.CityResponse])
def get_cities(db: Session = Depends(get_db)):
    return db.query(models.City).all()


@app.post("/trip-stops", response_model=schemas.TripStopResponse)
def add_trip_stop(stop: schemas.TripStopCreate, db: Session = Depends(get_db)):
    # Verify trip and city exist
    trip = db.query(models.Trip).filter(models.Trip.trip_id == stop.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    city = db.query(models.City).filter(models.City.city_id == stop.city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    new_stop = models.TripStop(**stop.dict())
    db.add(new_stop)
    db.commit()
    db.refresh(new_stop)
    return new_stop


@app.get("/trips/{trip_id}/stops", response_model=List[schemas.TripStopResponse])
def get_trip_stops(trip_id: int, db: Session = Depends(get_db)):
    return db.query(models.TripStop).filter(
        models.TripStop.trip_id == trip_id
    ).order_by(models.TripStop.stop_order).all()


@app.post("/activities", response_model=schemas.ActivityResponse)
def create_activity(activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    new_activity = models.Activity(**activity.dict())
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity


@app.get("/activities", response_model=List[schemas.ActivityResponse])
def get_activities(db: Session = Depends(get_db)):
    return db.query(models.Activity).all()


@app.post("/stop-activities", response_model=schemas.StopActivityResponse)
def add_activity_to_stop(
    stop_activity: schemas.StopActivityCreate,
    db: Session = Depends(get_db)
):
    # Verify stop and activity exist
    stop = db.query(models.TripStop).filter(
        models.TripStop.stop_id == stop_activity.stop_id
    ).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Trip stop not found")
    
    activity = db.query(models.Activity).filter(
        models.Activity.activity_id == stop_activity.activity_id
    ).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    new_entry = models.StopActivity(**stop_activity.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry


@app.post("/budgets", response_model=schemas.BudgetResponse)
def create_or_update_budget(
    budget: schemas.BudgetCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(models.Budget).filter(
        models.Budget.trip_id == budget.trip_id
    ).first()

    if existing:
        existing.estimated_budget = budget.estimated_budget
        db.commit()
        db.refresh(existing)
        return existing

    new_budget = models.Budget(**budget.dict())
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget


@app.get("/trips/{trip_id}/calculate-budget")
def calculate_budget(trip_id: int, db: Session = Depends(get_db)):
    # Verify trip exists
    trip = db.query(models.Trip).filter(models.Trip.trip_id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    total = (
        db.query(models.Activity.avg_cost)
        .join(models.StopActivity)
        .join(models.TripStop)
        .filter(models.TripStop.trip_id == trip_id)
        .all()
    )

    estimated_budget = sum(cost[0] if cost[0] else 0 for cost in total)

    return {
        "trip_id": trip_id,
        "estimated_budget": estimated_budget
    }


@app.get("/")
def root():
    return {"status": "GlobeTrotter API is running"}