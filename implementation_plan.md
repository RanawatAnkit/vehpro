The goal is to transform "VehPro" from a basic prototype into a complete, professional-grade car management and showcase application. This will involve implementing a realistic car dataset and a balanced "perfect" UI—clean, modern, and high-quality without being over-the-top.

## Proposed Changes

### 1. Security & Backend Hardening
- **Password Hashing**: Implement `bcryptjs` for secure password storage.
- **Authentication Middleware**: Create a middleware to verify JWTs for admin-only routes.
- **Environment Variables**: Move database credentials, JWT secrets, and API URLs to a `.env` file.
- **Input Validation**: Add basic validation for registration and car addition.

### 2. UI/UX Overhaul (Visual Excellence)
- **Modern Aesthetic**: Implement a premium "glassmorphism" or sleek dark mode design using Vanilla CSS.
- **Responsive Layout**: Ensure the car grid and admin forms are mobile-friendly.
- **Micro-animations**: Add hover effects and transition animations for car cards and buttons.
- **Loading & Error States**: Add visual feedback during API calls.

### 3. New Functional Features
- **Search & Filtering**: Add a search bar to filter cars by name and a price range slider.
- **Admin Management**: Add "Edit" and "Delete" functionality for car listings.
- **Detailed View**: Create a modal or separate section to show full car details.
- **Car Price Prediction**: Add a machine learning-based (or heuristic) tool to predict the market value of a car based on its year, mileage, and condition.
- **User Inquiry**: Allow logged-in users to send an inquiry for a car (simulated or stored in DB).

### 4. Code Refactoring & Data
- **Backend**: Separate logic into `routes` and `controllers` directories.
- **Frontend**: Move inline CSS and JS into separate files (`style.css`, `app.js`).
- **Dataset**: Create a SQL script `seed.sql` with 20+ realistic car entries across various brands and price points.

---

## Component Breakdown

### Backend
- #### [MODIFY] [server.js](file:///c:/semV/vehpro/backend/server.js)
  - Refactor to use routes and middleware.
  - Implement bcrypt for login/register.
  - Implement JWT verification.
- #### [NEW] [middleware/auth.js](file:///c:/semV/vehpro/backend/middleware/auth.js)
  - JWT verification logic.
- #### [NEW] [.env](file:///c:/semV/vehpro/backend/.env) [DELETE in git/production]
  - Configuration for DB, AWS, and JWT.

### Frontend
- #### [MODIFY] [index.html](file:///c:/semV/vehpro/frontend/index.html)
  - Update layout for search/filter and improved car grid.
- #### [MODIFY] [admin.html](file:///c:/semV/vehpro/frontend/admin.html)
  - Add list of existing cars with Edit/Delete options.
- #### [NEW] [style.css](file:///c:/semV/vehpro/frontend/style.css)
  - Centralized premium styling.

---

## Verification Plan

### Automated Tests
- No automated testing framework currently exists. I will verify manually using the browser.

### Manual Verification
1. **Security**:
   - Try to access `/add-car` without a valid admin token.
   - [ ] Add Car Price Prediction Feature
   - [ ] Verify all changes
   - Verify that passwords in the database are hashed (not plain text).
2. **Functionality**:
   - Register a new user and login.
   - Admin: Add a new car, Edit its details, and Delete it.
   - User: Search for a car and filter by price.
3. **UI/UX**:
   - Check responsiveness on different screen sizes using browser dev tools.
   - Verify smooth transitions and animations.
