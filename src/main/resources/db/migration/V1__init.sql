-- Create HRM schema for employee management
CREATE SCHEMA IF NOT EXISTS hrm;

-- Create employees table in hrm schema
CREATE TABLE hrm.employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    position VARCHAR(100),
    hire_date DATE,
    salary DOUBLE PRECISION
);
