-- Update userinfo table to include all new personal information fields
-- Run this script to add the new columns to your existing userinfo table

USE `psa-academy`;

-- Add new columns to userinfo table
ALTER TABLE userinfo 
ADD COLUMN suffix VARCHAR(10) NULL AFTER last_name,
ADD COLUMN sex ENUM('male', 'female') NULL AFTER date_of_birth,
ADD COLUMN blood_type VARCHAR(5) NULL AFTER sex,
ADD COLUMN civil_status ENUM('single', 'married', 'divorced', 'widowed', 'separated', 'civil_partnership', 'cohabitation') NULL AFTER blood_type,
ADD COLUMN type_of_disability ENUM('none', 'deaf_hard_hearing', 'intellectual', 'learning', 'mental', 'physical_orthopedic', 'psychosocial', 'speech_language', 'visual', 'cancer', 'rare_disease') NULL AFTER civil_status,
ADD COLUMN religion ENUM('roman_catholic', 'islam', 'iglesia_ni_cristo', 'ifi', 'sda', 'bible_baptist', 'uccp', 'jehovah_witness', 'lds', 'pentecostal', 'lutheran', 'buddhism', 'hinduism', 'atheist') NULL AFTER type_of_disability,
ADD COLUMN educational_attainment ENUM('elementary', 'junior_high', 'senior_high', 'college', 'vocational', 'post_graduate') NULL AFTER religion,
ADD COLUMN address VARCHAR(255) NULL AFTER educational_attainment,
ADD COLUMN barangay VARCHAR(100) NULL AFTER address,
ADD COLUMN municipality VARCHAR(100) NULL AFTER barangay,
ADD COLUMN province VARCHAR(100) NULL AFTER municipality,
ADD COLUMN region VARCHAR(100) NULL AFTER province,
ADD COLUMN employment_type ENUM('permanent_regular', 'contractual', 'coterminous', 'contract_service') NULL AFTER region,
ADD COLUMN civil_service_eligibility ENUM('first_level', 'second_level', 'third_level') NULL AFTER employment_type,
ADD COLUMN salary_grade VARCHAR(5) NULL AFTER civil_service_eligibility,
ADD COLUMN present_position VARCHAR(255) NULL AFTER salary_grade,
ADD COLUMN office VARCHAR(255) NULL AFTER present_position,
ADD COLUMN service VARCHAR(255) NULL AFTER office,
ADD COLUMN division_province VARCHAR(255) NULL AFTER service,
ADD COLUMN emergency_contact_name VARCHAR(255) NULL AFTER division_province,
ADD COLUMN emergency_contact_relationship VARCHAR(100) NULL AFTER emergency_contact_name,
ADD COLUMN emergency_contact_address TEXT NULL AFTER emergency_contact_relationship,
ADD COLUMN emergency_contact_number VARCHAR(20) NULL AFTER emergency_contact_address,
ADD COLUMN emergency_contact_email VARCHAR(255) NULL AFTER emergency_contact_number;

-- Update existing records to set default values for required fields
UPDATE userinfo SET 
sex = 'male' WHERE sex IS NULL,
civil_status = 'single' WHERE civil_status IS NULL,
educational_attainment = 'college' WHERE educational_attainment IS NULL;

-- Add indexes for better performance
CREATE INDEX idx_userinfo_email ON userinfo(email);
CREATE INDEX idx_userinfo_phone ON userinfo(phone);
CREATE INDEX idx_userinfo_username ON userinfo(user_id);

-- Show the updated table structure
DESCRIBE userinfo; 
