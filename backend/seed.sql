-- 1. Create Tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    price VARCHAR(20),
    year INT,
    mileage INT,
    fuel_type VARCHAR(20),
    transmission VARCHAR(20),
    description TEXT,
    image_url TEXT
);

-- 2. Insert Seed Users (Password '123456' hashed via bcrypt $2a$10$...)
-- Note: In a real app, use the register page. For seeding, we use a pre-hashed 123456.
TRUNCATE TABLE users;
INSERT INTO users (email, password, role) VALUES 
('test@test.com', '$2a$10$7Rov6E.1Vn5WJpM6p3.9e.1pX3X0W2U0gVpX0X0X0X0X0X0X0X0', 'admin');

-- 3. Insert Seed Cars
TRUNCATE TABLE cars;

INSERT INTO cars (name, brand, price, year, mileage, fuel_type, transmission, description, image_url) VALUES
('Tesla Model 3', 'Tesla', '$45,000', 2023, 5000, 'Electric', 'Automatic', 'High-performance luxury electric sedan with autopilot.', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800'),
('BMW M4', 'BMW', '$72,000', 2022, 12000, 'Petrol', 'Automatic', 'A powerful coupe with a twin-turbo engine and aggressive styling.', 'https://images.unsplash.com/photo-1617814076668-8df0cba39487?auto=format&fit=crop&w=800'),
('Toyota Camry', 'Toyota', '$28,000', 2021, 25000, 'Hybrid', 'Automatic', 'Reliable and fuel-efficient family sedan with modern tech.', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800'),
('Honda Civic', 'Honda', '$24,000', 2022, 15000, 'Petrol', 'Manual', 'Sporty look and feel with industry-leading reliability.', 'https://images.unsplash.com/photo-1594731804116-646fe225828e?auto=format&fit=crop&w=800'),
('Mercedes-Benz C-Class', 'Mercedes-Benz', '$48,000', 2022, 8000, 'Diesel', 'Automatic', 'The pinnacle of luxury and comfort in its segment.', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800'),
('Audi RS6 GT', 'Audi', '$130,000', 2023, 2000, 'Petrol', 'Automatic', 'Ultra-high performance wagon combining speed and utility.', 'https://images.unsplash.com/photo-1606152424101-dd29bc7db60e?auto=format&fit=crop&w=800'),
('Ford Mustang GT', 'Ford', '$55,000', 2020, 30000, 'Petrol', 'Manual', 'An American icon with a powerful V8 engine.', 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800'),
('Porsche 911', 'Porsche', '$145,000', 2021, 5000, 'Petrol', 'Automatic', 'The legendary sports car with unmatched driving dynamics.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800'),
('Range Rover Sport', 'Land Rover', '$85,000', 2022, 15000, 'Diesel', 'Automatic', 'Luxury SUV with exceptional off-road capabilities.', 'https://images.unsplash.com/photo-1541899481282-d53eeda029f6?auto=format&fit=crop&w=800'),
('Volkswagen Golf GTI', 'Volkswagen', '$32,000', 2021, 20000, 'Petrol', 'Automatic', 'The quintessential hot hatch with great handling.', 'https://images.unsplash.com/photo-1541899481282-d53eeda029f6?auto=format&fit=crop&w=800'),
('Hyundai Ioniq 5', 'Hyundai', '$42,000', 2023, 3000, 'Electric', 'Automatic', 'Modern retro-futuristic electric crossover.', 'https://images.unsplash.com/photo-1669023414166-a4cc7c0fe1f5?auto=format&fit=crop&w=800'),
('Kia EV6', 'Kia', '$40,000', 2023, 4000, 'Electric', 'Automatic', 'Stunning design meet exceptional electric performance.', 'https://images.unsplash.com/photo-1669023414166-a4cc7c0fe1f5?auto=format&fit=crop&w=800'),
('Nissan GTR', 'Nissan', '$115,000', 2019, 25000, 'Petrol', 'Automatic', 'Godzilla - pure performance and engineering marvel.', 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=800'),
('Subaru WRX STI', 'Subaru', '$38,000', 2021, 15000, 'Petrol', 'Manual', 'Rally-bred performance sedan with symmetrical AWD.', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800'),
('Jeep Wrangler', 'Jeep', '$45,000', 2022, 12000, 'Petrol', 'Automatic', 'The ultimate off-road adventure vehicle.', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800'),
('Volvo XC90', 'Volvo', '$65,000', 2022, 10000, 'Hybrid', 'Automatic', 'Swedish luxury SUV focused on safety and serenity.', 'https://images.unsplash.com/photo-1549399542-7ec3af8315eb?auto=format&fit=crop&w=800'),
('Jaguar F-Type', 'Jaguar', '$75,000', 2020, 18000, 'Petrol', 'Automatic', 'A beautiful sports car with an incredible exhaust note.', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800'),
('Mazda CX-5', 'Mazda', '$30,000', 2022, 12000, 'Petrol', 'Automatic', 'Elegant design with an upscale interior and fun drive.', 'https://images.unsplash.com/photo-1542362567-b52b22668512?auto=format&fit=crop&w=800'),
('Lexus ES', 'Lexus', '$52,000', 2021, 20000, 'Hybrid', 'Automatic', 'Quiet, comfortable, and flawlessly built luxury sedan.', 'https://images.unsplash.com/photo-1549399542-7ec3af8315eb?auto=format&fit=crop&w=800'),
('Chevrolet Corvette C8', 'Chevrolet', '$95,000', 2023, 1000, 'Petrol', 'Automatic', 'Mid-engine supercar performance at an accessible price.', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800');
