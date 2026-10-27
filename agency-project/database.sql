CREATE DATABASE IF NOT EXISTS agency_db;
USE agency_db;

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Chat Logs Table
CREATE TABLE IF NOT EXISTS chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRIGGER: Naam ko save hone se pehle automatic UPPERCASE karne ke liye
DROP TRIGGER IF EXISTS format_lead_name;
DELIMITER $$
CREATE TRIGGER format_lead_name
BEFORE INSERT ON leads
FOR EACH ROW
BEGIN
    SET NEW.name = UPPER(TRIM(NEW.name));
END $$
DELIMITER ;

-- 4. STORED PROCEDURE: Saare leads fetch karne ke liye
DROP PROCEDURE IF EXISTS get_all_leads;
DELIMITER $$
CREATE PROCEDURE get_all_leads()
BEGIN
    SELECT * FROM leads ORDER BY created_at DESC;
END $$
DELIMITER ;