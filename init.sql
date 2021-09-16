CREATE TABLE jobseekers (
    jobseeker_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT,
    tagline TEXT,
    profile_picture TEXT
)