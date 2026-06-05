# Wellness Studio - Architecture & Setup Guide

## Overview

This wellness studio application has been restructured to support scalability and easy API integration. The application now uses local JSON data backed by browser localStorage for persistence, while preserving a clean service layer that can switch to a real backend with minimal changes.

## Saloon Requirements Additions

- Dashboard: Enhance the Saloon User Dashboard requirement to ensure it is a dedicated dashboard for Saloon Users with quick access to key metrics, upcoming appointments, daily activities, and the new service, course, and student workflows.
- Service Menu: Add a Service Menu feature to add, delete, and edit services. Each service must include:
  - name
  - description
  - price
  - status
- Course Menu: Add a Course Menu feature to add and edit course details. Each course must include:
  - name
  - code
  - rate
  - duration (start date and end date)
  - instructor
  - level of class
- Student Menu Update: Extend the existing Student module to include course enrollment details and student-specific schedule and pricing fields:
  - course for the student
  - student detail
  - start date
  - duration
  - discount

## Key Changes & Improvements

### 1. **Service Layer Architecture** 📁

The application now has a dedicated `src/services/` folder containing:

- **`api.js`** - Base API configuration and helper functions
  - Centralized API call management
  - Loads initial mock data from local JSON and persists changes to localStorage
  - Includes `resetDatabase()` for restoring the original mock dataset
  - Ready to replace with real API calls

- **`studentService.js`** - Student enrollment management
  - `getStudents()` - Fetch all students
  - `getStudentById(id)` - Fetch single student
  - `createStudent(data)` - Create new student
  - `updateStudent(id, data)` - Update existing student
  - `deleteStudent(id)` - Delete student

- **`clientService.js`** - Client/Customer management
  - Same CRUD operations as studentService

- **`appointmentService.js`** - Booking management
  - Handles appointment scheduling

- **`courseService.js`** - Course management
  - Manages course information and enrollment

- **`staffService.js`** - Staff management
  - Manages staff information and payroll

- **`validationSchemas.js`** - Form validation using Yup
  - Schema definitions for all forms
  - Reusable validation logic

### 2. **React Router Implementation** 🛣️

The app now uses React Router v6 for proper navigation:

- **`src/routes/index.js`** - Centralized route configuration
  - All routes defined in one place
  - Easy to add new routes
  - Sidebar integration with routing

**Main Routes:**

- `/` - Dashboard
- `/appointments` - Appointments list
- `/service-menu` - Service menu
- `/courses` - Courses list
- `/clients` - Clients list
- `/clients/:id` - Client detail view
- `/clients/:id/edit` - Client edit page
- `/students` - Students list
- `/students/:id` - Student detail view
- `/students/:id/edit` - Student edit page
- `/staff` - Staff list
- `/staff/:id` - Staff detail view
- `/staff/:id/edit` - Staff edit page
- `/analytics` - Analytics dashboard
- `/settings` - Settings page

### 3. **Formik Form Validation** ✅

All forms now use Formik with Yup validation:

- **AddCustomerModal** - Client/Customer registration
  - Fields: firstName, lastName, nationalId, phone, email, skin
  - Validates email format, phone format, required fields

- **EnrollStudentModal** - Student enrollment
  - Fields: student, course, dates, pricing, etc.
  - Validates required fields, date ranges, numeric values

- **StaffModal** - Staff registration
  - Fields: firstName, lastName, position, department, phone, email, salary, status
  - Validates all required fields with appropriate formats

**Features:**

- Real-time validation feedback
- Error messages displayed inline
- Submit buttons disabled while submitting
- Works in both create and edit modes

### 4. **Detail & Edit Pages** 📄

New pages for viewing and editing records:

- **StudentDetail** (`src/pages/StudentDetail.jsx`)
  - Display student information
  - View/Edit/Delete buttons
  - Links to edit page

- **StudentEdit** (`src/pages/StudentEdit.jsx`)
  - Reuses EnrollStudentModal with edit mode
  - Pre-fills form with existing data
  - Saves updates and redirects

- **ClientDetail** (`src/pages/ClientDetail.jsx`)
  - Display client information
  - View/Edit/Delete buttons

- **ClientEdit** (`src/pages/ClientEdit.jsx`)
  - Reuses AddCustomerModal with edit mode

- **StaffDetail** (`src/pages/StaffDetail.jsx`)
  - Display staff information

- **StaffEdit** (`src/pages/StaffEdit.jsx`)
  - Reuses StaffModal with edit mode

### 5. **Updated Pages with Dynamic Data** 🔄

Pages now connect to services and support CRUD operations:

- **Students.jsx** - Loads students from service, supports add/edit/delete/view
- **Client.jsx** - Loads clients from service, supports add/edit/delete/view
- **Staff.jsx** - Simplified to show staff list with add/edit/delete/view

## Transition to Real API

### Step 1: Update Service Files

In `src/services/`, replace static data with API calls:

```javascript
// Before (static data)
const STATIC_STUDENTS = [...]
export const getStudents = async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(STATIC_STUDENTS), 300)
  })
}

// After (API call)
export const getStudents = async () => {
  return api.get('/students')
}
```

### Step 2: Update API Base URL

In `src/services/api.js`:

```javascript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Replace simulated delay with actual fetch/axios
export const apiCall = async (endpoint, method = "GET", data = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : null,
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
```

### Step 3: Use Environment Variables

Create `.env` file in root:

```
REACT_APP_API_URL=http://your-api-server.com/api
```

### Step 4: Handle Errors

Add error handling in pages/modals as needed.

## File Structure

```
src/
├── services/
│   ├── api.js                    # Base API configuration
│   ├── studentService.js         # Student CRUD operations
│   ├── clientService.js          # Client CRUD operations
│   ├── appointmentService.js     # Appointment CRUD operations
│   ├── courseService.js          # Course CRUD operations
│   ├── staffService.js           # Staff CRUD operations
│   └── validationSchemas.js      # Yup validation schemas
├── routes/
│   └── index.js                  # Centralized route configuration
├── pages/
│   ├── Dashboard.jsx
│   ├── Students.jsx              # Updated with service integration
│   ├── StudentDetail.jsx          # New detail page
│   ├── StudentEdit.jsx            # New edit page
│   ├── Client.jsx                # Updated with service integration
│   ├── ClientDetail.jsx           # New detail page
│   ├── ClientEdit.jsx             # New edit page
│   ├── Staff.jsx                 # Updated with service integration
│   ├── StaffDetail.jsx            # New detail page
│   ├── StaffEdit.jsx              # New edit page
│   └── ...other pages
├── components/
│   ├── modals/
│   │   ├── AddCustomerModal.jsx  # Updated with Formik
│   │   ├── EnrollStudentModal.jsx # Updated with Formik
│   │   └── StaffModal.jsx         # New, with Formik
│   └── ...other components
└── App.jsx                        # Updated with React Router
```

## Best Practices for API Integration

1. **Error Handling** - Add try-catch blocks and user feedback
2. **Loading States** - Show loading spinners while fetching
3. **Optimistic Updates** - Update UI before API confirmation
4. **Caching** - Consider caching frequently accessed data
5. **Rate Limiting** - Implement request debouncing
6. **Authentication** - Add JWT tokens in API headers

## Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0", // NEW - Routing
  "formik": "^2.4.5", // NEW - Form management
  "yup": "^1.3.3", // NEW - Form validation
  "recharts": "^2.12.7",
  "lucide-react": "^0.383.0"
}
```

## Testing the Application

1. **Navigate pages** - Use sidebar to test routing
2. **Add records** - Click "Add" buttons to open modals
3. **View details** - Click eye icon to view records
4. **Edit records** - Click edit icon to modify records
5. **Delete records** - Click delete icon to remove records
6. **Form validation** - Try submitting forms without required fields

## Future Enhancements

- [ ] Add search/filter functionality in lists
- [ ] Implement pagination (already has component)
- [ ] Add bulk operations (export, import, delete)
- [ ] Add role-based access control (RBAC)
- [ ] Implement real-time notifications
- [ ] Add dark mode support
- [ ] Implement data caching with localStorage
- [ ] Add date range filters
- [ ] Implement status filtering

## Common Tasks

### Add a New Page

1. Create page in `src/pages/PageName.jsx`
2. Add route to `src/routes/index.js`
3. Add navigation item in `src/components/layout/Sidebar.jsx`

### Add Form Validation

1. Add schema to `src/services/validationSchemas.js`
2. Use schema in modal/form with Formik
3. Display error messages with ErrorMessage component

### Connect to API

1. Add endpoint to service file
2. Replace static data call with `api.get()` or `api.post()`, etc.
3. Update `.env` with API URL
4. Test with real backend

## Support & Documentation

For more information, refer to:

- [React Router Docs](https://reactrouter.com/)
- [Formik Docs](https://formik.org/)
- [Yup Docs](https://github.com/jquense/yup)
