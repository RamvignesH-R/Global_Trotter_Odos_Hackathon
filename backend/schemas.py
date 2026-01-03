from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str

    class Config:
        orm_mode = True

class TripCreate(BaseModel):
    user_id: int
    trip_name: str
    start_date: date
    end_date: date
    description: Optional[str] = None


class TripResponse(BaseModel):
    trip_id: int
    trip_name: str
    start_date: date
    end_date: date
    is_public: bool

    class Config:
        orm_mode = True

class CityCreate(BaseModel):
    city_name: str
    country: str
    cost_index: int
    popularity_score: int


class CityResponse(BaseModel):
    city_id: int
    city_name: str
    country: str

    class Config:
        orm_mode = True

class TripStopCreate(BaseModel):
    trip_id: int
    city_id: int
    start_date: date
    end_date: date
    stop_order: int


class TripStopResponse(BaseModel):
    stop_id: int
    start_date: date
    end_date: date
    stop_order: int

    class Config:
        orm_mode = True

class ActivityCreate(BaseModel):
    activity_name: str
    category: str
    avg_cost: int
    duration_hours: int


class ActivityResponse(BaseModel):
    activity_id: int
    activity_name: str
    category: str
    avg_cost: int

    class Config:
        orm_mode = True

class StopActivityCreate(BaseModel):
    stop_id: int
    activity_id: int
    scheduled_date: date


class StopActivityResponse(BaseModel):
    stop_activity_id: int
    scheduled_date: date

    class Config:
        orm_mode = True

class BudgetCreate(BaseModel):
    trip_id: int
    estimated_budget: int


class BudgetResponse(BaseModel):
    trip_id: int
    estimated_budget: int

    class Config:
        orm_mode = True