# Saloon Management System — Frontend-Backend Integration Guide

**Version:** 1.0  
**Status:** Canonical Reference  
**Scope:** How the React frontend connects to the .NET backend — every API contract, data transformation, state pattern, and system interaction for every module.

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Authentication Integration](#2-authentication-integration)
3. [API Client Setup & Interceptors](#3-api-client-setup--interceptors)
4. [Dashboard Integration](#4-dashboard-integration)
5. [Customer Module Integration](#5-customer-module-integration)
6. [Staff Module Integration](#6-staff-module-integration)
7. [Supplier & Purchase Integration](#7-supplier--purchase-integration)
8. [Service & Product Integration](#8-service--product-integration)
9. [Appointment Module Integration](#9-appointment-module-integration)
10. [Checkout & Billing Integration](#10-checkout--billing-integration)
11. [Financial Records Integration](#11-financial-records-integration)
12. [Course Module Integration](#12-course-module-integration)
13. [Student Module Integration](#13-student-module-integration)
14. [Reporting & Analytics Integration](#14-reporting--analytics-integration)
15. [Frontend Route Map vs Backend Endpoint Map](#15-frontend-route-map-vs-backend-endpoint-map)
16. [State Management Strategy](#16-state-management-strategy)
17. [Error Handling Contract](#17-error-handling-contract)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                          │
│                                                                         │
│  ┌─────────────┐   ┌──────────────────┐   ┌────────────────────────┐   │
│  │ Pages/Views │   │ Service Layer    │   │ State (useState/       │   │
│  │             │──▶│ src/services/    │──▶│  Context)              │   │
│  │ Dashboard   │   │ api.js (base)    │   │                        │   │
│  │ Appointments│   │ *Service.js      │   │ auth token             │   │
│  │ Clients     │   │                  │   │ user role              │   │
│  │ Students    │   │                  │   │ org context            │   │
│  │ Analytics   │   └──────────────────┘   └────────────────────────┘   │
│  └─────────────┘                                                        │
└────────────────────────────────────────────────────────────────────────┘
                              │
                    HTTP (Axios/Fetch)
                    Headers:
                      Authorization: Bearer {JWT}
                      X-Org-Code: {orgCode}
                      Content-Type: application/json
                              │
┌─────────────────────────────────────────────────────────────────────────┐
│                       BACKEND (.NET 8 / ASP.NET Core)                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │              TenantResolutionMiddleware                          │    │
│  │  1. Extract + validate JWT                                       │    │
│  │  2. Read X-Org-Code header                                       │    │
│  │  3. Look up TenantInfo in MasterDB                               │    │
│  │  4. Build TenantDbContext with tenant connection string          │    │
│  │  5. Inject TenantDbContext into request DI scope                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Controllers → Services → Repositories → TenantDbContext          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│         ┌────────────────────┴──────────────────────┐                   │
│         │                                           │                   │
│   MasterDatabase                            TenantDatabase              │
│   (AspNetUsers,                             (All business data          │
│    Organization,                             per salon)                 │
│    TenantInfo,                                                          │
│    OrganizationUser)                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Design Principles
1. **Every API request carries both a JWT and an org code.** The backend never infers the tenant from the user alone — it must be explicit.
2. **Service layer on the frontend is the only place HTTP calls are made.** Pages and components call service functions, not raw fetch/axios.
3. **All responses follow a standard envelope.** Components never write format-parsing logic; they receive clean typed objects from the service layer.

---

## 2. Authentication Integration

### Frontend Side

**File:** `src/services/authService.js`

```javascript
// src/services/authService.js
import { apiClient } from './api';

export const login = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  const { token, role, staffId, orgCode, staffName } = response.data;

  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_role', role);
  localStorage.setItem('staff_id', staffId);
  localStorage.setItem('org_code', orgCode);
  localStorage.setItem('staff_name', staffName);

  return { role, staffId, orgCode, staffName };
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

export const getCurrentUser = () => ({
  token: localStorage.getItem('auth_token'),
  role: localStorage.getItem('user_role'),
  staffId: localStorage.getItem('staff_id'),
  orgCode: localStorage.getItem('org_code'),
  staffName: localStorage.getItem('staff_name'),
});

export const isAuthenticated = () => !!localStorage.getItem('auth_token');
```

### Backend Side

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{ "email": "staff@saloon.com", "password": "SecurePass123!" }
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "OrgAdmin",
  "staffId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "orgCode": "SAL001",
  "staffName": "Ankit Panta",
  "expiresAt": "2026-06-08T08:00:00Z"
}
```

**Error (401):**
```json
{ "error": "Invalid email or password." }
```

### Route Guards (Frontend)

**File:** `src/routes/ProtectedRoute.jsx`

```javascript
// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

export const ProtectedRoute = ({ children, requiredRoles }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  
  const userRole = localStorage.getItem('user_role');
  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
```

---

## 3. API Client Setup & Interceptors

**File:** `src/services/api.js`

```javascript
// src/services/api.js
import axios from 'axios';
import { logout } from './authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const orgCode = localStorage.getItem('org_code');

  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (orgCode) config.headers['X-Org-Code'] = orgCode;

  return config;
});

// Response interceptor: handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);
```

### Standard API Response Envelope

All backend endpoints return:

```json
// Success
{
  "success": true,
  "data": { ... },         // or array
  "meta": {                // for paginated lists
    "page": 1,
    "pageSize": 20,
    "total": 145,
    "totalPages": 8
  }
}

// Error
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "phone": ["Phone number must be 10 digits"],
    "email": ["Email is already registered"]
  }
}
```

---

## 4. Dashboard Integration

**Frontend file:** `src/pages/Dashboard.jsx`  
**Current state:** Static mock data. Replace with live API calls.

### What the dashboard needs:

```javascript
// src/services/dashboardService.js
import { apiClient } from './api';

export const getTodayStats = () =>
  apiClient.get('/api/dashboard/today-stats');

export const getUpcomingAppointments = (limit = 5) =>
  apiClient.get(`/api/dashboard/upcoming-appointments?limit=${limit}`);

export const getRevenueSummary = (period = 'month') =>
  apiClient.get(`/api/dashboard/revenue-summary?period=${period}`);

export const getAppointmentStatusCounts = () =>
  apiClient.get('/api/dashboard/appointment-status-counts');
```

### Backend Endpoints

| Endpoint | Returns |
|---|---|
| `GET /api/dashboard/today-stats` | `todaySales`, `appointmentsToday`, `completedToday`, `activeEnrollments`, `pendingStudentFees` |
| `GET /api/dashboard/upcoming-appointments?limit=5` | Array of next N upcoming appointments with customer name, service, time, status, amount |
| `GET /api/dashboard/revenue-summary?period=month` | `totalRevenue`, `topServices[]`, `totalServices`, `weeklyVolume[]` |
| `GET /api/dashboard/appointment-status-counts` | `{ booked, completed, cancelled }` for current period |

### Component Update Pattern

```javascript
// Dashboard.jsx - replace static data with:
useEffect(() => {
  Promise.all([
    getTodayStats(),
    getUpcomingAppointments(),
    getRevenueSummary(),
    getAppointmentStatusCounts(),
  ]).then(([stats, upcoming, revenue, statusCounts]) => {
    setTodayStats(stats.data.data);
    setTimeline(upcoming.data.data);
    setRevenue(revenue.data.data);
    setStatusCounts(statusCounts.data.data);
  });
}, []);
```

---

## 5. Customer Module Integration

**Frontend files:** `src/pages/Client.jsx`, `src/pages/ClientDetail.jsx`, `src/pages/ClientEdit.jsx`, `src/components/modals/AddCustomerModal.jsx`  
**Current state:** Service layer wired to localStorage. Replace with real API.

### Service Functions

```javascript
// src/services/clientService.js
import { apiClient } from './api';

export const getCustomers = (params = {}) =>
  apiClient.get('/api/customers', { params });

export const getCustomerById = (id) =>
  apiClient.get(`/api/customers/${id}`);

export const createCustomer = (data) =>
  apiClient.post('/api/customers', data);

export const updateCustomer = (id, data) =>
  apiClient.patch(`/api/customers/${id}`, data);

export const deleteCustomer = (id) =>
  apiClient.delete(`/api/customers/${id}`);

export const getCustomerTypes = () =>
  apiClient.get('/api/customer-types');
```

### API Endpoints

| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| GET | `/api/customers` | `?page&limit&search&typeId` | Paginated customer list |
| GET | `/api/customers/{id}` | — | Customer + appointment history + receivable balance |
| POST | `/api/customers` | Customer fields | Created customer |
| PATCH | `/api/customers/{id}` | Partial customer fields | Updated customer |
| DELETE | `/api/customers/{id}` | — | `{ success: true }` |
| GET | `/api/customer-types` | — | Array of CustomerType |
| POST | `/api/customer-types` | `{ name, description }` | Created type |

### Frontend Form → API Field Mapping

The existing `AddCustomerModal.jsx` uses Formik with `clientValidationSchema`. Field mapping:

| Form Field (Formik) | API Field | Notes |
|---|---|---|
| `firstName` | `firstName` | |
| `lastName` | `lastName` | |
| `phone` | `phone` | 10-digit validation |
| `email` | `email` | |
| `nationalId` | `nationalId` | Uniqueness validated server-side |
| `skin` | `skinType` | Frontend uses `skin`, API uses `skinType` |
| (not in form yet) | `customerTypeId` | Add dropdown to modal |
| (not in form yet) | `address` | Add field to modal |

**Note:** The existing `AddCustomerModal.jsx` is missing `customerTypeId` and `address` fields. These need to be added to both the Formik schema and the modal UI.

### ClientDetail Page — What It Should Show

Currently the `ClientDetail.jsx` shows basic info only. It should also fetch and display:

```javascript
// In ClientDetail.jsx useEffect:
const [customer, setCustomer] = useState(null);
const [appointments, setAppointments] = useState([]);
const [receivableBalance, setReceivableBalance] = useState(0);

useEffect(() => {
  Promise.all([
    getCustomerById(id),                          // GET /api/customers/{id}
    getAppointmentsByCustomer(id),                // GET /api/appointments?customerId={id}
    getCustomerReceivableBalance(id),             // GET /api/customer-receivables/balance/{id}
  ]).then(([c, apps, balance]) => {
    setCustomer(c.data.data);
    setAppointments(apps.data.data);
    setReceivableBalance(balance.data.data.balance);
  });
}, [id]);
```

---

## 6. Staff Module Integration

**Frontend files:** `src/pages/Staff.jsx`, `src/pages/StaffDetail.jsx`, `src/pages/StaffEdit.jsx`, `src/components/modals/StaffModal.jsx`

### Service Functions

```javascript
// src/services/staffService.js
import { apiClient } from './api';

export const getStaff = (params = {}) =>
  apiClient.get('/api/staff', { params });

export const getStaffById = (id) =>
  apiClient.get(`/api/staff/${id}`);

export const createStaff = (data) =>
  apiClient.post('/api/staff', data);

export const updateStaff = (id, data) =>
  apiClient.patch(`/api/staff/${id}`, data);

export const deactivateStaff = (id) =>
  apiClient.patch(`/api/staff/${id}/deactivate`);
```

### API Endpoints

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/staff` | `?status&department&role` filters |
| GET | `/api/staff/{id}` | Includes recent appointments assigned |
| POST | `/api/staff` | Creates Staff + AspNetUser account |
| PATCH | `/api/staff/{id}` | Profile update (not email/password) |
| PATCH | `/api/staff/{id}/deactivate` | Soft delete |

### Formik Schema → API Field Mapping

The existing `StaffModal.jsx` Formik schema maps cleanly to the Staff entity. One addition needed: the `role` field (OrgAdmin/InternalStaff/Finance) is not in the current schema — add it as a required dropdown.

---

## 7. Supplier & Purchase Integration

**New pages needed:** `src/pages/Suppliers.jsx`, `src/pages/Purchases.jsx`  
(These pages exist in the requirements but are not yet in the frontend prototype.)

### Service Functions

```javascript
// src/services/supplierService.js
export const getSuppliers = (params) => apiClient.get('/api/suppliers', { params });
export const createSupplier = (data) => apiClient.post('/api/suppliers', data);
export const updateSupplier = (id, data) => apiClient.patch(`/api/suppliers/${id}`, data);

// src/services/purchaseService.js
export const getPurchases = (params) => apiClient.get('/api/purchases', { params });
export const createPurchase = (data) => apiClient.post('/api/purchases', data);
export const getPurchaseById = (id) => apiClient.get(`/api/purchases/${id}`);
```

### Purchase Creation API Contract

**POST /api/purchases**

```json
// Request Body
{
  "supplierId": "uuid",
  "purchaseDate": "2026-06-07",
  "paidAmount": 5000,
  "paymentMethod": "Cash",
  "notes": "Monthly stock reorder",
  "items": [
    { "productId": "uuid", "quantity": 10, "unitPrice": 500 }
  ]
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "uuid",
    "totalAmount": 5000,
    "paymentStatus": "Paid",
    "supplierPendingPaymentId": null
  }
}
```

If `paidAmount < totalAmount`, the response includes `supplierPendingPaymentId` pointing to the auto-created pending record.

---

## 8. Service & Product Integration

**Frontend file:** `src/pages/ServiceMenu.jsx`  
**Current state:** Shows a static service menu. Needs CRUD.

### Service Functions

```javascript
// src/services/serviceMenuService.js
export const getServices = (params) => apiClient.get('/api/services', { params });
export const createService = (data) => apiClient.post('/api/services', data);
export const updateService = (id, data) => apiClient.patch(`/api/services/${id}`, data);
export const deleteService = (id) => apiClient.delete(`/api/services/${id}`);

export const getProducts = (params) => apiClient.get('/api/products', { params });
export const createProduct = (data) => apiClient.post('/api/products', data);
export const updateProduct = (id, data) => apiClient.patch(`/api/products/${id}`, data);

export const getCategories = () => apiClient.get('/api/categories');
export const createCategory = (data) => apiClient.post('/api/categories', data);
```

### ServiceMenu.jsx Refactor

The current `ServiceMenu.jsx` renders a placeholder. It needs to be rebuilt with:
1. Two tabs: **Services** and **Products**
2. Each tab has an Add button that opens a drawer modal
3. Inline row actions: Edit, Toggle Status, Delete (only if no active appointments)
4. Category filter dropdown at top

---

## 9. Appointment Module Integration

**Frontend files:** `src/pages/Appointments.jsx`, `src/pages/AppointmentDetail.jsx`, `src/pages/AppointmentEdit.jsx`, `src/components/modals/NewBookingModal.jsx`

### Service Functions

```javascript
// src/services/appointmentService.js
export const getAppointments = (params) =>
  apiClient.get('/api/appointments', { params });

export const getAppointmentById = (id) =>
  apiClient.get(`/api/appointments/${id}`);

export const createAppointment = (data) =>
  apiClient.post('/api/appointments', data);

export const updateAppointment = (id, data) =>
  apiClient.patch(`/api/appointments/${id}`, data);

export const updateAppointmentStatus = (id, status) =>
  apiClient.patch(`/api/appointments/${id}/status`, { status });

export const deleteAppointment = (id) =>
  apiClient.delete(`/api/appointments/${id}`);

export const completeAppointment = (id, checkoutData) =>
  apiClient.post(`/api/appointments/${id}/complete`, checkoutData);
```

### Create Appointment API Contract

**POST /api/appointments**

```json
// Request Body
{
  "customerId": "uuid",
  "assignedStaffId": "uuid",
  "appointmentDate": "2026-06-10",
  "appointmentTime": "10:00",
  "notes": "Regular client, prefers John",
  "services": [
    { "serviceId": "uuid" },
    { "serviceId": "uuid" }
  ]
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "Booked",
    "paymentStatus": "Unpaid",
    "totalAmount": 2500.00
  }
}
```

### NewBookingModal.jsx — Required Changes

Current modal issues:
1. Only supports single service — must change to multi-service picker
2. Does not call a real API — calls localStorage service
3. Customer dropdown needs to be populated from `GET /api/customers?search=`
4. Staff dropdown needs to be populated from `GET /api/staff?status=Active`
5. Services dropdown needs to be populated from `GET /api/services?status=Active`

**Updated Data Fetching in Modal:**

```javascript
// On modal open, fetch reference data in parallel:
useEffect(() => {
  Promise.all([
    getCustomers({ status: 'Active' }),
    getStaff({ status: 'Active' }),
    getServices({ status: 'Active' }),
  ]).then(([customers, staff, services]) => {
    setCustomerOptions(customers.data.data);
    setStaffOptions(staff.data.data);
    setServiceOptions(services.data.data);
  });
}, []);
```

### AppointmentDetail.jsx — Required Changes

Current detail page shows basic info but is missing:
- **Payment status badge**
- **"Complete Appointment" button** (triggers Checkout Modal)
- **"Cancel Appointment" button** with confirmation
- **Assigned staff name** (currently shows staffId)
- **Services list** (currently shows single `service` string)

---

## 10. Checkout & Billing Integration

The checkout flow is triggered from `AppointmentDetail.jsx` and is the most complex interaction in the system.

### New Component Needed

**File:** `src/components/modals/CheckoutModal.jsx`

This component is not yet in the prototype. It must be built.

### Checkout API Contract

**POST /api/appointments/{id}/complete**

```json
// Request Body
{
  "serviceLineItems": [
    { "serviceId": "uuid", "priceOverride": 1800 },
    { "serviceId": "uuid", "priceOverride": null }
  ],
  "additionalItems": [
    {
      "description": "Moisturizing cream",
      "productId": "uuid",
      "quantity": 1,
      "unitPrice": 450
    }
  ],
  "payments": [
    { "method": "Cash", "amount": 1500 },
    { "method": "QR", "amount": 750 }
  ]
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "appointmentId": "uuid",
    "status": "Completed",
    "totalAmount": 2250,
    "paidAmount": 2250,
    "outstandingAmount": 0,
    "saleRecordId": "uuid",
    "customerReceivableId": null
  }
}
```

**If partial payment:**
```json
{
  "data": {
    "paidAmount": 1500,
    "outstandingAmount": 750,
    "customerReceivableId": "uuid"
  }
}
```

### CheckoutModal State Shape

```javascript
const [checkoutState, setCheckoutState] = useState({
  serviceLineItems: appointment.services.map(s => ({
    serviceId: s.serviceId,
    serviceName: s.serviceNameSnapshot,
    defaultPrice: s.service.price,
    priceOverride: null,
  })),
  additionalItems: [],
  payments: [{ method: 'Cash', amount: 0 }],
});

// Computed
const totalAmount =
  checkoutState.serviceLineItems.reduce(
    (sum, s) => sum + (s.priceOverride ?? s.defaultPrice), 0
  ) +
  checkoutState.additionalItems.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice, 0
  );

const paidAmount = checkoutState.payments.reduce(
  (sum, p) => sum + (parseFloat(p.amount) || 0), 0
);

const outstandingAmount = totalAmount - paidAmount;
```

---

## 11. Financial Records Integration

**New pages needed:** `src/pages/SupplierPayments.jsx`, `src/pages/CustomerReceivables.jsx`

### Service Functions

```javascript
// src/services/financialService.js
export const getSupplierPayments = (params) =>
  apiClient.get('/api/supplier-payments', { params });

export const recordSupplierPayment = (data) =>
  apiClient.post('/api/supplier-payments', data);

export const getSupplierPendingPayments = (params) =>
  apiClient.get('/api/supplier-pending-payments', { params });

export const getCustomerReceivables = (params) =>
  apiClient.get('/api/customer-receivables', { params });

export const collectReceivable = (id, data) =>
  apiClient.post(`/api/customer-receivables/${id}/collect`, data);

export const refundReceivable = (id, data) =>
  apiClient.post(`/api/customer-receivables/${id}/refund`, data);

export const getCreditSummary = (params) =>
  apiClient.get('/api/credit-summary', { params });

export const getExpenses = (params) =>
  apiClient.get('/api/expenses', { params });

export const createExpense = (data) =>
  apiClient.post('/api/expenses', data);

export const getExpenseTypes = () =>
  apiClient.get('/api/expense-types');

export const createExpenseType = (data) =>
  apiClient.post('/api/expense-types', data);
```

### Sidebar Navigation Addition

The current sidebar (`Sidebar.jsx`) has no financial section. Add:

```javascript
{
  section: "Financials",
  items: [
    { path: "/expenses", label: "Expenses", icon: Receipt },
    { path: "/supplier-payments", label: "Supplier Payments", icon: Truck },
    { path: "/receivables", label: "Customer Receivables", icon: CreditCard },
  ],
}
```

---

## 12. Course Module Integration

**Frontend files:** `src/pages/Courses.jsx`, `src/pages/CourseDetail.jsx`, `src/pages/CourseEdit.jsx`

### Service Functions

```javascript
// src/services/courseService.js
export const getCourses = (params) =>
  apiClient.get('/api/courses', { params });

export const getCourseById = (id) =>
  apiClient.get(`/api/courses/${id}`);

export const createCourse = (data) =>
  apiClient.post('/api/courses', data);

export const updateCourse = (id, data) =>
  apiClient.patch(`/api/courses/${id}`, data);

export const deactivateCourse = (id) =>
  apiClient.patch(`/api/courses/${id}/deactivate`);
```

### Create Course API Contract

**POST /api/courses**

```json
{
  "name": "Advanced Balayage Artistry",
  "code": "BAL-ADV-01",
  "description": "Professional hair coloring techniques",
  "rate": 15000,
  "durationDays": 45,
  "instructorStaffId": "uuid-or-null",
  "instructorName": "Maria Garcia",
  "level": "Advanced",
  "status": "Active"
}
```

### Courses.jsx — Current vs Required

The existing `Courses.jsx` already shows a course table with status badges and action buttons. The key wiring needed:
1. Replace mock data with `getCourses()` call
2. Add "Enroll Student" shortcut from course row → opens `EnrollStudentModal.jsx` pre-filled with `courseId`
3. `CourseDetail.jsx` needs an enrollment list: `GET /api/enrollments?courseId={id}`

---

## 13. Student Module Integration

**Frontend files:** `src/pages/Students.jsx`, `src/pages/StudentDetail.jsx`, `src/pages/StudentEdit.jsx`, `src/components/modals/EnrollStudentModal.jsx`

### Service Functions

```javascript
// src/services/studentService.js
export const getStudents = (params) =>
  apiClient.get('/api/students', { params });

export const getStudentById = (id) =>
  apiClient.get(`/api/students/${id}`);

export const createStudent = (data) =>
  apiClient.post('/api/students', data);

export const updateStudent = (id, data) =>
  apiClient.patch(`/api/students/${id}`, data);

export const enrollStudent = (studentId, enrollmentData) =>
  apiClient.post(`/api/students/${studentId}/enrollments`, enrollmentData);

export const getStudentEnrollments = (studentId) =>
  apiClient.get(`/api/students/${studentId}/enrollments`);

export const recordStudentPayment = (enrollmentId, paymentData) =>
  apiClient.post(`/api/enrollments/${enrollmentId}/payments`, paymentData);

export const getStudentFeeRecords = (enrollmentId) =>
  apiClient.get(`/api/enrollments/${enrollmentId}/payments`);
```

### EnrollStudentModal.jsx — API Wiring

Current modal uses Formik with `studentValidationSchema`. When submitted:

```javascript
const handleSubmit = async (values) => {
  try {
    // Step 1: Create or find student
    const studentPayload = {
      name: values.student,
      nationalId: values.nationalId,
      studentCode: values.code,
      email: values.email,
      phone: values.phone,
      address: values.address,
    };
    const studentRes = await createStudent(studentPayload);
    const studentId = studentRes.data.data.id;

    // Step 2: Create enrollment
    const enrollmentPayload = {
      courseId: values.course,
      startDate: values.startDate,
      totalFee: values.courseRate,
      discount: values.scholarship || 0,
      notes: '',
    };
    const enrollRes = await enrollStudent(studentId, enrollmentPayload);
    const enrollmentId = enrollRes.data.data.id;

    // Step 3: Record initial deposit
    if (values.deposit > 0) {
      await recordStudentPayment(enrollmentId, {
        amount: values.deposit,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
      });
    }

    onSuccess();
  } catch (err) {
    // Show error
  }
};
```

### StudentDetail.jsx — Required Changes

Current `StudentDetail.jsx` shows basic info. Add:
1. **Enrollment section:** For each enrollment, show course name, dates, fee summary (Total / Paid / Due)
2. **Payment history table:** List of `StudentFeeRecord` entries
3. **"Record Payment" button:** Opens payment drawer (amount, method, date)
4. **Financial summary cards:** Total Fees, Total Paid, Payment Due — prominently shown

---

## 14. Reporting & Analytics Integration

**Frontend file:** `src/pages/Analytics.jsx`  
**Current state:** All static mock data. Needs live data.

### Service Functions

```javascript
// src/services/reportService.js
export const getSalesReport = (params) =>
  apiClient.get('/api/reports/sales', { params });

export const getPaymentStatement = (params) =>
  apiClient.get('/api/reports/payments', { params });

export const getSupplierPaymentReport = (params) =>
  apiClient.get('/api/reports/supplier-payments', { params });

export const getSupplierPendingReport = (params) =>
  apiClient.get('/api/reports/supplier-pending', { params });

export const getCreditSummaryReport = (params) =>
  apiClient.get('/api/reports/credit-summary', { params });

export const getCustomerReceivableReport = (params) =>
  apiClient.get('/api/reports/customer-receivables', { params });

export const getStudentReport = (params) =>
  apiClient.get('/api/reports/students', { params });

export const getKpis = (period) =>
  apiClient.get(`/api/reports/kpis?period=${period}`);

export const exportReport = (reportType, params, format) =>
  apiClient.get(`/api/reports/${reportType}/export`, {
    params: { ...params, format },
    responseType: 'blob',
  });
```

### Report Query Parameters Standard

All report endpoints accept:

```
?from=2026-01-01
&to=2026-06-07
&staffId=uuid (optional)
&serviceId=uuid (optional)
&customerId=uuid (optional)
&paymentMethod=Cash (optional)
&page=1
&limit=50
```

### Analytics.jsx Refactor

The existing component has excellent UI structure (KPI cards, AreaChart, BarChart, table). The refactor is:
1. Replace all static constant arrays (`REVENUE_DATA`, `KPIS`, `TOP_SERVICES`, `STAFF_PERF`) with state initialized from API calls
2. Wire the period selector (`PERIODS` array) to re-fetch on selection change
3. Add tab state for report type switching (currently the page is one flat layout)
4. Add export button handlers that call `exportReport()` and trigger file download

---

## 15. Frontend Route Map vs Backend Endpoint Map

| Frontend Route | Component | Backend Namespace | Key Endpoints |
|---|---|---|---|
| `/` | Dashboard | `/api/dashboard/*` | today-stats, upcoming-appointments, revenue-summary |
| `/appointments` | Appointments | `/api/appointments` | GET (list), POST |
| `/appointments/:id` | AppointmentDetail | `/api/appointments/:id` | GET, DELETE |
| `/appointments/:id/edit` | AppointmentEdit | `/api/appointments/:id` | PATCH |
| `/service-menu` | ServiceMenu | `/api/services`, `/api/products` | Full CRUD |
| `/courses` | Courses | `/api/courses` | GET, POST |
| `/courses/:id` | CourseDetail | `/api/courses/:id`, `/api/enrollments?courseId=` | GET |
| `/courses/:id/edit` | CourseEdit | `/api/courses/:id` | PATCH |
| `/clients` | Client | `/api/customers`, `/api/customer-types` | GET, POST |
| `/clients/:id` | ClientDetail | `/api/customers/:id`, `/api/customer-receivables/balance/:id` | GET |
| `/clients/:id/edit` | ClientEdit | `/api/customers/:id` | PATCH |
| `/students` | Students | `/api/students` | GET, POST |
| `/students/:id` | StudentDetail | `/api/students/:id`, `/api/students/:id/enrollments` | GET |
| `/students/:id/edit` | StudentEdit | `/api/students/:id` | PATCH |
| `/staff` | Staff | `/api/staff` | GET, POST |
| `/staff/:id` | StaffDetail | `/api/staff/:id` | GET |
| `/staff/:id/edit` | StaffEdit | `/api/staff/:id` | PATCH |
| `/analytics` | Analytics | `/api/reports/*`, `/api/dashboard/kpis` | All report endpoints |
| `/expenses` (new) | Expenses | `/api/expenses`, `/api/expense-types` | CRUD |
| `/suppliers` (new) | Suppliers | `/api/suppliers`, `/api/purchases` | CRUD |
| `/supplier-payments` (new) | SupplierPayments | `/api/supplier-payments`, `/api/supplier-pending-payments` | CRUD + views |
| `/receivables` (new) | CustomerReceivables | `/api/customer-receivables` | GET, collect, refund |
| `/settings` | Settings | `/api/tenant/settings` | GET, PATCH |

---

## 16. State Management Strategy

The frontend uses **local component state** (`useState`) for all page-level data. No global store (Redux/Zustand) is required for v1. The following patterns apply:

### Page-Level Data Loading Pattern

```javascript
// Standard pattern used across all pages
export default function PageName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getDataFunction();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <DataTable data={data} />;
}
```

### Form Submission Pattern

```javascript
// Standard Formik submit handler
const handleSubmit = async (values, { setSubmitting, setErrors }) => {
  try {
    await createOrUpdateFunction(id, values);
    navigate(-1); // or to detail page
  } catch (err) {
    const apiErrors = err.response?.data?.errors;
    if (apiErrors) setErrors(mapApiErrors(apiErrors));
  } finally {
    setSubmitting(false);
  }
};
```

### Shared Context

For data that is needed across many components (current user, org settings), use React Context:

```javascript
// src/context/AuthContext.jsx
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const user = getCurrentUser(); // reads localStorage
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

// Usage in any component:
const { role, staffName, orgCode } = useContext(AuthContext);
```

---

## 17. Error Handling Contract

### HTTP Status → UI Behavior

| Status | Meaning | Frontend Behavior |
|---|---|---|
| 200/201 | Success | Show success toast, navigate or refresh |
| 400 | Validation Error | Show inline field errors from `errors` object |
| 401 | Unauthorized | Clear localStorage, redirect to `/login` |
| 403 | Forbidden | Show "You don't have permission" toast |
| 404 | Not Found | Show "Record not found" and Back button |
| 409 | Conflict (duplicate) | Show specific conflict message |
| 422 | Business Rule Violation | Show message from `error` field |
| 500 | Server Error | Show generic "Something went wrong. Please try again." |

### Toast Notification Convention

```javascript
// Success
showToast({ type: 'success', message: 'Customer added successfully.' });

// Error
showToast({ type: 'error', message: 'Failed to save. Please try again.' });

// Warning (e.g., partial payment)
showToast({
  type: 'warning',
  message: `NPR ${outstanding} will be recorded as customer credit.`
});
```

### Backend Validation Error Shape

The frontend maps backend error shape to Formik `setErrors`:

```javascript
// Backend returns:
// { "errors": { "phone": ["Phone number must be 10 digits"] } }

const mapApiErrors = (apiErrors) =>
  Object.fromEntries(
    Object.entries(apiErrors).map(([key, messages]) => [key, messages[0]])
  );
```

---

*End of Frontend-Backend Integration Guide*
