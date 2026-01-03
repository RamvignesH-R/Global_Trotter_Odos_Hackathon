from sqlalchemy import (
    Column, Integer, String, Date, Boolean,
    ForeignKey, Text
)
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))

    trips = relationship("Trip", back_populates="user")

class Trip(Base):
    __tablename__ = "trips"

    trip_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    trip_name = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    description = Column(Text)
    is_public = Column(Boolean, default=False)

    user = relationship("User", back_populates="trips")
    stops = relationship("TripStop", back_populates="trip")
    budget = relationship("Budget", back_populates="trip", uselist=False)

class City(Base):
    __tablename__ = "cities"

    city_id = Column(Integer, primary_key=True, index=True)
    city_name = Column(String(100))
    country = Column(String(100))
    cost_index = Column(Integer)
    popularity_score = Column(Integer)

    stops = relationship("TripStop", back_populates="city")

class TripStop(Base):
    __tablename__ = "trip_stops"

    stop_id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.trip_id"))
    city_id = Column(Integer, ForeignKey("cities.city_id"))
    start_date = Column(Date)
    end_date = Column(Date)
    stop_order = Column(Integer)

    trip = relationship("Trip", back_populates="stops")
    city = relationship("City", back_populates="stops")
    activities = relationship("StopActivity", back_populates="stop")

class Activity(Base):
    __tablename__ = "activities"

    activity_id = Column(Integer, primary_key=True, index=True)
    activity_name = Column(String(100))
    category = Column(String(50))
    avg_cost = Column(Integer)
    duration_hours = Column(Integer)

    stops = relationship("StopActivity", back_populates="activity")

class StopActivity(Base):
    __tablename__ = "stop_activities"

    stop_activity_id = Column(Integer, primary_key=True, index=True)
    stop_id = Column(Integer, ForeignKey("trip_stops.stop_id"))
    activity_id = Column(Integer, ForeignKey("activities.activity_id"))
    scheduled_date = Column(Date)

    stop = relationship("TripStop", back_populates="activities")
    activity = relationship("Activity", back_populates="stops")

class Budget(Base):
    __tablename__ = "budgets"

    trip_id = Column(Integer, ForeignKey("trips.trip_id"), primary_key=True)
    estimated_budget = Column(Integer)

    trip = relationship("Trip", back_populates="budget")
