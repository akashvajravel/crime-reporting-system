-- Crime Reporting System Database Schema
-- PostgreSQL

-- Create database
-- CREATE DATABASE crime_reporting_system;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'police')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crime Reports table
CREATE TABLE crime_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'in-progress', 'resolved', 'rejected')),
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_reports_user_id ON crime_reports(user_id);
CREATE INDEX idx_reports_status ON crime_reports(status);
CREATE INDEX idx_reports_crime_type ON crime_reports(crime_type);
CREATE INDEX idx_reports_assigned_to ON crime_reports(assigned_to);

-- Crime types reference data
CREATE TABLE crime_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Insert common crime types against women
INSERT INTO crime_types (name, description) VALUES 
('Domestic Violence', 'Physical or emotional abuse by family member or partner'),
('Harassment', 'Repeated unwanted attention or behavior'),
('Stalking', 'Persistent following or surveillance'),
('Assault', 'Physical attack or violence'),
('Rape', 'Sexual assault'),
('Molestation', 'Sexual harassment or inappropriate touching'),
('Acid Attack', 'Violent attack with corrosive substances'),
('Kidnapping', 'Unlawful abduction'),
('Dowry Harassment', 'Harassment related to dowry demands'),
('Cyber Crime', 'Online harassment or exploitation'),
('Other', 'Other type of crime');
