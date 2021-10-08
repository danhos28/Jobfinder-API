CREATE TABLE jobseekers (
    jobseeker_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT,
    tagline TEXT,
    profile_picture TEXT,
    experiences TEXT,
    skills TEXT,
    certificates TEXT,
    education TEXT,
    address TEXT,
    summary TEXT
)

CREATE TABLE resumes (
    resume_id VARCHAR(50) PRIMARY KEY,
    jobseeker_id VARCHAR(50),
    resume TEXT,
    CONSTRAINT fk_resumes_jobseekers
    FOREIGN KEY(jobseeker_id)  REFERENCES jobseekers(jobseeker_id)
    ON DELETE CASCADE
)

CREATE TABLE applications (
    application_id VARCHAR(50) PRIMARY KEY,
    jobseeker_id VARCHAR(50),
    vacancy_id VARCHAR(50),
    message TEXT,
    response TEXT NOT NULL,
     applied_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_applications_jobseekers
    FOREIGN KEY(jobseeker_id)  REFERENCES jobseekers(jobseeker_id)
    ON DELETE CASCADE,
    CONSTRAINT fk_applications_vacancies
    FOREIGN KEY(vacancy_id)  REFERENCES vacancies(vacancy_id)
    ON DELETE CASCADE
)

CREATE TABLE interviews (
    interview_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL,
    employer_id VARCHAR(50) NOT NULL,
    jobseeker_id VARCHAR(50) NOT NULL,
    interviewer TEXT NOT NULL,
    type TEXT NOT NULL,
    datetime TEXT NOT NULL,
    link TEXT NOT NULL,
    notes TEXT,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    CONSTRAINT fk_interviews_employers
    FOREIGN KEY(employer_id) REFERENCES employers(employer_id) ON DELETE CASCADE,
    CONSTRAINT fk_interviews_jobseekers
    FOREIGN KEY(jobseeker_id) REFERENCES jobseekers(jobseeker_id) ON DELETE CASCADE,
    CONSTRAINT fk_interviews_applications
    FOREIGN KEY(application_id) REFERENCES applications(application_id) ON DELETE CASCADE
  )

CREATE TABLE authentications (
    token TEXT NOT NULL
)

CREATE TABLE employers (
    employer_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    profile_picture TEXT
)

CREATE TABLE vacancies (
    vacancy_id VARCHAR(50) PRIMARY KEY,
    employer_id VARCHAR(50),
    job_title TEXT NOT NULL,
    job_desc TEXT NOT NULL,
    job_qualifications TEXT NOT NULL,
    job_notes TEXT NOT NULL,
    job_level TEXT NOT NULL,
    job_educationReq TEXT NOT NULL,
    company TEXT NOT NULL,
    company_about TEXT,
    salary TEXT NOT NULL,
    employment_type TEXT NOT NULL,
    category TEXT NOT NULL,
    job_location TEXT NOT NULL,
    job_thumb TEXT,
    job_createat TIMESTAMP NOT NULL,
    CONSTRAINT fk_vacancies_employer
    FOREIGN KEY(employer_id)  REFERENCES employers(employer_id)
    ON DELETE CASCADE
)

CREATE TABLE savejobs (
    save_id VARCHAR(50) PRIMARY KEY,
    jobseeker_id VARCHAR(50) NOT NULL,
    vacancy_id VARCHAR(50) NOT NULL,
    CONSTRAINT fk_savejobs_vacancies
    FOREIGN KEY(vacancy_id) REFERENCES vacancies(vacancy_id) ON DELETE CASCADE,
    CONSTRAINT fk_savejobs_jobseekers
    FOREIGN KEY(jobseeker_id) REFERENCES jobseekers(jobseeker_id) ON DELETE CASCADE
)