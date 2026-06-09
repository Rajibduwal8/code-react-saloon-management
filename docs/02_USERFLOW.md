# Saloon Management System — User Flow Documentation

**Version:** 1.0  
**Status:** Canonical Reference  
**Scope:** All user roles, their workflows, decision paths, and interaction sequences across the entire system.

---

## Table of Contents

1. [Roles & Permissions Matrix](#1-roles--permissions-matrix)
2. [Authentication Flow](#2-authentication-flow)
3. [Dashboard Flow](#3-dashboard-flow)
4. [Customer Management Flow](#4-customer-management-flow)
5. [Staff Management Flow](#5-staff-management-flow)
6. [Supplier Management Flow](#6-supplier-management-flow)
7. [Service & Product Catalogue Flow](#7-service--product-catalogue-flow)
8. [Appointment Lifecycle Flow](#8-appointment-lifecycle-flow)
9. [Checkout & Billing Flow](#9-checkout--billing-flow)
10. [Financial Records Flow](#10-financial-records-flow)
11. [Course Management Flow](#11-course-management-flow)
12. [Student Management Flow](#12-student-management-flow)
13. [Reporting Flow](#13-reporting-flow)
14. [Loophole Analysis & Edge Cases](#14-loophole-analysis--edge-cases)

---

## 1. Roles & Permissions Matrix

Four roles operate within the tenant context. Access is enforced both on the frontend (route guards, hidden UI) and backend (authorization middleware).

| Feature Area | OrgAdmin | InternalStaff | Finance | SuperAdmin |
|---|---|---|---|---|
| Dashboard (full metrics) | ✅ | ✅ (limited) | ✅ | ✅ |
| Customer CRUD | ✅ | ✅ | ❌ | ✅ |
| Staff CRUD | ✅ | ❌ | ❌ | ✅ |
| Supplier CRUD | ✅ | ✅ | ❌ | ✅ |
| Service/Product CRUD | ✅ | ✅ | ❌ | ✅ |
| Expense CRUD | ✅ | ✅ | ✅ | ✅ |
| Purchase CRUD | ✅ | ✅ | ✅ | ✅ |
| Appointment Create/Edit | ✅ | ✅ | ❌ | ✅ |
| Appointment Complete (Checkout) | ✅ | ✅ | ❌ | ✅ |
| Appointment Delete | ✅ | ❌ | ❌ | ✅ |
| Financial Reports (Sales, Credit) | ✅ | ❌ | ✅ | ✅ |
| Supplier Payment Records | ✅ | ❌ | ✅ | ✅ |
| Customer Receivable Management | ✅ | ❌ | ✅ | ✅ |
| Course CRUD | ✅ | ✅ | ❌ | ✅ |
| Student CRUD | ✅ | ✅ | ❌ | ✅ |
| Student Fee Recording | ✅ | ✅ | ✅ | ✅ |
| Tenant Settings | ✅ | ❌ | ❌ | ✅ |
| Super Admin Panel | ❌ | ❌ | ❌ | ✅ |

**InternalStaff Dashboard Restriction:** The InternalStaff dashboard shows only operational data (appointments today, upcoming schedule, active enrollments). It hides revenue figures, total sales, and financial summaries.

---

## 2. Authentication Flow

```
User visits app
      │
      ▼
  Is JWT in localStorage valid?
      │
   ┌──┴──┐
  Yes    No
   │      │
   ▼      ▼
Redirect  Login Page
 to         │
Dashboard   User enters Email + Password
            │
            ▼
         POST /api/auth/login
            │
         ┌──┴──┐
       OK      Error
        │        │
        ▼        ▼
   Store JWT   Show error
   + Role      message
   + OrgCode   (invalid credentials)
   + StaffId
        │
        ▼
   Redirect to Dashboard
```

**Token Storage:**
- `JWT` → `localStorage["auth_token"]`
- `role` → `localStorage["user_role"]`
- `staffId` → `localStorage["staff_id"]`
- `orgCode` → `localStorage["org_code"]`

**All subsequent API requests include:**
- `Authorization: Bearer {JWT}`
- `X-Org-Code: {orgCode}` (backend uses this to route to tenant DB)

**Session Expiry Flow:**
- On any `401` response → clear localStorage → redirect to Login.
- JWT lifetime: 8 hours. Refresh token not implemented in v1; user must re-login.

---

## 3. Dashboard Flow

### OrgAdmin / Finance Dashboard

Upon login, the user lands on the Dashboard showing:

```
Dashboard Page Load
      │
      ▼
Parallel API calls:
  ├── GET /api/dashboard/today-stats
  │     → todaySales, appointmentsToday, completedToday, activeEnrollments
  ├── GET /api/dashboard/upcoming-appointments?limit=5
  │     → upcoming appointment timeline
  ├── GET /api/dashboard/revenue-summary
  │     → totalRevenue, topServices[], totalServices
  └── GET /api/dashboard/appointment-status-counts
        → booked, completed, cancelled counts (for donut chart)
      │
      ▼
Render stat cards, bar chart (weekly volume), timeline, donut chart
```

**Stat Cards Displayed:**
1. Today's Total Sales (NPR)
2. Appointments Today (count + breakdown: clients vs students)
3. Completed Appointments Today (with completion rate %)
4. Active Course Enrollments (with pending fee amount)
5. Total Revenue (period selector: This Week / Month / Year)
6. Top Services (top 3 by booking volume)
7. Total Services available
8. Appointment Status Count (Booked / Cancelled / Completed) → donut chart

**InternalStaff Dashboard (Restricted):**
- Shows only: Appointments Today, Upcoming Timeline, Active Enrollments.
- All revenue/financial cards are hidden via role check on the frontend.

---

## 4. Customer Management Flow

### 4.1 View Customer List
```
Navigate → /clients
      │
      ▼
GET /api/customers?page=1&limit=20&search=&typeId=
      │
      ▼
Table: Name, Phone, Email, Customer Type, Registered Date
+ Search bar (name, phone)
+ Filter by Customer Type
+ Pagination
```

### 4.2 Add New Customer
```
Click "Add Customer" → Slide-over drawer opens
      │
      ▼
Fill form:
  - First Name, Last Name (required)
  - Phone (10-digit, required)
  - Email (optional)
  - Address (optional)
  - National ID (optional, unique check)
  - Skin Type (optional, salon-specific)
  - Customer Type (dropdown, required)
      │
      ▼
Submit → POST /api/customers
      │
   ┌──┴──┐
  OK     Error (duplicate nationalId / validation)
   │       │
   ▼       ▼
Close     Show inline error messages
drawer,   remain on form
refresh list
```

**Quick Add from Appointment Context:**
- When creating an appointment, if the customer doesn't exist, a "+ New Customer" button within the booking modal opens the Add Customer flow.
- On save, the new customer is auto-selected in the booking form.

### 4.3 View Customer Detail
```
Click customer row → GET /api/customers/{id}
      │
      ▼
Detail Page:
  - Personal info section
  - Appointment history (linked appointments)
  - Outstanding receivable balance (from CustomerReceivable)
  - Action buttons: Edit, Delete (soft-delete)
```

### 4.4 Edit Customer
```
Click "Edit" → Pre-filled form drawer opens
      │
      ▼
Modify fields → PATCH /api/customers/{id}
      │
      ▼
Redirect back to Customer Detail
```

### 4.5 Customer Type Management
- Accessed via Settings → Customer Types.
- Simple CRUD (name + description).
- A CustomerType cannot be deleted if customers are linked to it (constraint error shown).

---

## 5. Staff Management Flow

### 5.1 View & Add Staff
```
Navigate → /staff
      │
      ▼
GET /api/staff?status=Active
      │
      ▼
Table: Name, Position, Department, Role, Status, Join Date
+ Filter by status and department
```

### 5.2 Add Staff Member
```
Click "Add Staff" → Modal/drawer opens
      │
Fill:
  - First Name, Last Name (required)
  - Position, Department (required)
  - Phone, Email (required, email is login credential)
  - Address
  - Role: OrgAdmin / InternalStaff / Finance (required)
  - Salary (required)
  - Status: Active
  - Temporary Password (required, shown once)
      │
      ▼
POST /api/staff
  → Creates Staff record
  → Creates AspNetUser account with email + tempPassword
  → Sends login credentials via email (if email service configured)
```

### 5.3 Staff Detail & Edit
- Detail page shows: personal info, role, salary, appointment history (appointments assigned to this staff member).
- Edit allows updating all fields except email (email change requires separate identity flow).
- Deleting sets `status = Inactive` (soft delete). Historical appointment references preserved.

---

## 6. Supplier Management Flow

### 6.1 Add Supplier
```
Navigate → /suppliers → Click "Add Supplier"
      │
Fill: Name (required), Phone (required), Address, Email, Notes
      │
POST /api/suppliers → Confirmation toast
```

### 6.2 Record a Purchase
```
Navigate → /purchases → Click "New Purchase"
      │
Step 1: Select Supplier (dropdown)
Step 2: Set Purchase Date
Step 3: Add line items:
  - Select Product (dropdown from Product catalogue)
  - Enter Quantity
  - Enter Unit Price
  - Row total auto-computed
Step 4: Review total amount
Step 5: Enter payment:
  - Amount Paid (may be partial)
  - Payment Method
      │
      ▼
POST /api/purchases
  → Creates Purchase record
  → Creates PurchaseItem records
  → Updates Product.stockQuantity for each item
  → If paidAmount < totalAmount:
       Creates SupplierPendingPayment record
```

---

## 7. Service & Product Catalogue Flow

### 7.1 Service Menu Management

```
Navigate → /service-menu
      │
Two tabs: [Services] [Products]
      │
Services Tab:
  Table: Name, Category, Price, Duration, Status
  + "Add Service" button

Add Service:
  - Name (required, min 5 chars)
  - Description
  - Category (dropdown)
  - Price (required)
  - Duration (minutes)
  - Status: Active / Inactive
  → POST /api/services

Edit Service:
  - Same fields, PATCH /api/services/{id}
  - Price changes do NOT retroactively affect past appointments

Delete Service:
  - Can only delete if service has no active (Booked) appointments referencing it
  - Soft-delete if historical appointments exist (set status = Inactive)
```

### 7.2 Category Management
- Accessed from Service Menu sidebar or Settings.
- Add parent category first, then add child categories with `parentId` set.
- Categories cannot be deleted if services/products are linked.

### 7.3 Expense Flow
```
Navigate → /expenses

Add Expense Type:
  - Name → POST /api/expense-types

Record Expense:
  - Title (required)
  - Select Expense Type (required)
  - Amount (required)
  - Date (required)
  - Payment Method (required)
  - Remarks (optional)
  → POST /api/expenses

List view shows: Title, Type, Amount, Date, Method
Total expenses for selected date range shown at top.
```

---

## 8. Appointment Lifecycle Flow

```
APPOINTMENT STATES:

  [Booked] ──────────────► [Completed]
     │                          │
     │                          ▼
     │                   SaleRecord created
     │                   PaymentTransaction(s) created
     │                   CustomerReceivable created (if partial)
     │
     └──────────────────► [Cancelled]
                               │
                               ▼
                        No SaleRecord created
```

### 8.1 Create Appointment
```
Navigate → /appointments → Click "New Booking"
  OR from Customer Detail page → "Book Appointment"

Booking Form (slide-over drawer):
  Step 1: Customer Selection
    - Search existing customer (by name/phone)
    - Email + Phone auto-fill on selection (read-only)
    - OR click "+ New Customer" to register inline

  Step 2: Scheduling
    - Appointment Date (date picker)
    - Appointment Time (time slots dropdown)
    - Assign Staff (dropdown from Active Staff)

  Step 3: Services
    - Add one or more services (multi-select from Active Services)
    - Each service shows its default price

  Step 4: Remarks (optional free text)
      │
      ▼
Submit → POST /api/appointments
  → Status auto-set to "Booked"
  → PaymentStatus auto-set to "Unpaid"
  → Appears in upcoming timeline on Dashboard
```

### 8.2 Edit Appointment (Booked state only)
```
Appointment must have status = Booked

From Appointment List or Detail → Click "Edit"
  - Can change: Customer, Date, Time, Staff, Services, Notes
  - Cannot change: Status (done from detail page)
  → PATCH /api/appointments/{id}
```

### 8.3 Cancel Appointment
```
From Appointment Detail:
  - Click "Cancel Appointment"
  - Confirm dialog: "Are you sure? This cannot be undone."
  → PATCH /api/appointments/{id}/status
      body: { status: "Cancelled" }
  → No financial records created
  → Appointment remains in list with "Cancelled" badge
```

### 8.4 Mark as Complete (triggers Checkout)
```
From Appointment Detail:
  - Appointment must be status = "Booked"
  - Click "Complete Appointment"
  - Opens Checkout Modal (see Section 9)
```

---

## 9. Checkout & Billing Flow

The checkout is the most complex flow in the system. It happens when marking an appointment as Completed.

```
Open Checkout Modal
      │
      ▼
Section 1: Review & Modify Service Line Items
  - Each service listed with current price
  - Price is editable (override from default)
  - Staff can add or remove services from this appointment

Section 2: Additional Billing Items
  - Click "+ Add Item"
  - Enter description (or select from Product catalogue)
  - Enter quantity and unit price
  - Row total auto-computed
  - Multiple items allowed

Section 3: Invoice Summary
  - Subtotal (services + additional items)
  - Total Amount auto-computed

Section 4: Payment Collection
  - Enter amount to collect now
  - Select Payment Method (Cash / Card / BankTransfer / QR)
  - "Add another payment method" → adds a second payment leg
  - System validates: sum of all payment legs ≤ totalAmount
  - Outstanding balance displayed live

Section 5: Confirm Checkout
  - "Complete & Pay" button
      │
      ▼
POST /api/appointments/{id}/complete
  Body: {
    serviceLineItems: [{ serviceId, priceOverride }],
    additionalItems: [{ description, productId?, quantity, unitPrice }],
    payments: [{ method, amount }]
  }
      │
      ▼ Backend Processing:
  1. Update Appointment.status = "Completed"
  2. Update AppointmentService records with any overrides
  3. Create AdditionalBillingItem records
  4. Calculate totalAmount = Σ(services) + Σ(additionalItems)
  5. Calculate paidAmount = Σ(payments)
  6. Create PaymentTransaction records (one per payment leg)
  7. Create SaleRecord (immutable snapshot)
  8. If paidAmount < totalAmount:
       Create CustomerReceivable record for (totalAmount - paidAmount)
  9. If any additionalItem linked to a Product:
       Decrement Product.stockQuantity
      │
      ▼
Modal closes → Appointment Detail shows status "Completed"
Dashboard stats updated
```

**Loophole: Overpayment Prevention**
- Frontend validation: sum of payment legs cannot exceed `totalAmount`.
- If a customer pays more, staff records the correct amount and handles change manually.

**Loophole: Zero-payment Completion**
- It is valid to complete an appointment with `paidAmount = 0` (full credit). The entire amount becomes a `CustomerReceivable`.
- The system must not block this but should confirm: "No payment collected. Full amount of NPR X will be recorded as customer credit."

---

## 10. Financial Records Flow

### 10.1 Supplier Payment Recording
```
Navigate → /financials/supplier-payments → "Record Payment"
  - Select Supplier
  - Optionally link to a Purchase (to settle a pending payable)
  - Amount, Date, Method, Reference
  → POST /api/supplier-payments
  → If linked to a Purchase: SupplierPendingPayment.remainingAmount reduced
```

### 10.2 Customer Receivable Collection
```
Navigate → /financials/receivables → Select Customer → View outstanding

"Collect Payment":
  - Amount (≤ remainingAmount)
  - Payment Method, Date
  → POST /api/customer-receivables/{id}/collect
  → Creates PaymentTransaction record
  → Updates CustomerReceivable.remainingAmount
  → If remainingAmount = 0: status → "Settled"
```

### 10.3 Receivable Refund
```
On Customer Receivable record with status Outstanding or PartiallyPaid:
  "Refund" button (Finance role only)
  - Enter refund amount and reason
  → POST /api/customer-receivables/{id}/refund
  → Status → "Refunded"
  → Creates a negative PaymentTransaction entry
```

---

## 11. Course Management Flow

### 11.1 Add Course
```
Navigate → /courses → Click "Add Course"

Form fields:
  - Name (required)
  - Code (required, unique check)
  - Description
  - Rate / Fee (required)
  - Duration in Days (required)
  - Instructor (search Staff or free text)
  - Level: Beginner / Intermediate / Advanced
  - Status: Active
  → POST /api/courses
```

### 11.2 Course Detail Page
```
GET /api/courses/{id}
  → Shows: course info, enrolled students list with payment status
  → "Edit" button → editable form (PATCH)
  → "Add Enrollment" shortcut → opens Student enrollment flow
```

### 11.3 Edit / Deactivate Course
```
Edit: PATCH /api/courses/{id}
  - Changing Course.rate does NOT retroactively update existing StudentEnrollments
  - Existing enrollments retain the fee at time of enrollment

Deactivate (status → Inactive):
  - Cannot enroll new students
  - Active enrollments are not affected
```

---

## 12. Student Management Flow

### 12.1 Add Student & Enroll

```
Navigate → /students → Click "Enroll Student"

Enrollment Form:
  Step 1: Student Information
    - Name (required)
    - Student Code (auto-generated or manual)
    - National ID
    - Phone (required)
    - Email
    - Address

  Step 2: Course Selection
    - Select Course (dropdown of Active courses)
    - Start Date (required)
    - Duration auto-populated from course (editable)
    - End Date auto-computed (displayed, read-only)

  Step 3: Fee Structure
    - Course Rate (auto-populated, editable)
    - Scholarship / Discount amount
    - Net Fee (auto-computed: Rate - Discount)

  Step 4: Initial Payment
    - Deposit Amount (required, may be 0)
    - Payment Method

  → POST /api/students + POST /api/enrollments
  → Creates Student record
  → Creates StudentEnrollment record
  → Creates StudentFeeRecord for deposit
  → Updates StudentEnrollment.paidAmount
```

### 12.2 Student Detail Page
```
GET /api/students/{id}
  → Personal info section
  → Enrollment section (per enrollment):
       - Course Name, Start/End Date, Status
       - Total Fee | Paid | Outstanding
  → Payment history table (StudentFeeRecord list)
  → "Record Payment" button
```

### 12.3 Record Student Fee Payment
```
From Student Detail → "Record Payment"
  - Select Enrollment (if multiple)
  - Amount (required, ≤ paymentDue)
  - Date, Method
  - Receipt Number (optional)
  → POST /api/enrollments/{id}/payments
  → Creates StudentFeeRecord
  → Updates StudentEnrollment.paidAmount
  → If paidAmount >= netFee: enrollment status → "Completed" (payment-wise)
```

### 12.4 Student Edit
```
Edit allowed for: Name, Phone, Email, Address, National ID
Course enrollment details are edited via the Enrollment record directly (not via Student edit)
```

---

## 13. Reporting Flow

```
Navigate → /analytics (OrgAdmin, Finance roles only)

Top KPI Row: Total Revenue, Total Appointments, Avg Ticket Value,
             Completion Rate, New Clients, Course Enrollments

Report Tabs:
  ┌─────────────────────────────────────────────────────────┐
  │ [Sales Report] [Payments] [Supplier] [Credit] [Academy] │
  └─────────────────────────────────────────────────────────┘

Each tab:
  1. Date Range Filter (This Week / This Month / Custom Range)
  2. Secondary filters (by Staff, Service, Customer, Payment Method)
  3. Data table with sortable columns
  4. Summary row (totals)
  5. Export buttons: [CSV] [PDF]

Report generation flow:
  Select filters → Apply
      │
      ▼
GET /api/reports/{reportType}?from=&to=&...filters
      │
      ▼
Render table + charts
```

### Report Definitions

**Sales Report:**
- Source: SaleRecord joined to Appointment, Customer, AppointmentService
- Key columns: Date, Customer, Services Rendered, Payment Method(s), Total, Paid, Outstanding
- Chart: Revenue vs Expenses over time (AreaChart)

**Payment Statement:**
- Source: PaymentTransaction
- Key columns: Date, Appointment Ref, Customer, Method, Amount, Reference

**Supplier Payment Report:**
- Source: SupplierPayment joined to Supplier, Purchase
- Key columns: Date, Supplier, Purchase Ref, Amount, Method

**Supplier Pending Payments:**
- Source: SupplierPendingPayment where status ≠ Cleared
- Key columns: Supplier, Purchase Date, Original Amount, Remaining, Due Date, Status

**Credit Summary:**
- Source: CreditSummary (aggregated) joined to Customer
- Key columns: Customer Name, Phone, Total Credited, Collected, Current Balance

**Customer Receivable:**
- Source: CustomerReceivable joined to Customer, Appointment
- Key columns: Customer, Date, Original, Remaining, Status

---

## 14. Loophole Analysis & Edge Cases

The following gaps were identified between the original requirements, the user flow notes, and the frontend prototype. Each has a resolution.

### Gap 1: Appointment Edit After Completion
**Problem:** The edit button on AppointmentDetail has no status guard in the frontend prototype. A completed appointment could be re-edited.  
**Resolution:** Disable Edit and Delete buttons if `status = Completed` or `status = Cancelled`. Backend also returns `400` if PATCH is attempted on a non-Booked appointment.

---

### Gap 2: Service Price Override Not Surfaced in Frontend
**Problem:** The frontend `AppointmentDetail.jsx` shows service name and status but does not show the checkout/payment workflow. The `NewBookingModal.jsx` does not include price modification.  
**Resolution:** Price modification is part of the **Checkout Modal** (triggered by "Complete Appointment"), not the booking form. This is correct; the spec confirms prices are editable at checkout, not at booking time.

---

### Gap 3: Student vs Customer Duality
**Problem:** The system has separate Student and Customer entities, but the requirements don't clarify if a person attending a course as a student can also book salon appointments as a customer.  
**Resolution:** They are treated as separate personas with separate records. If a student also becomes a salon customer, they are registered in both modules independently. The dashboard counts them separately ("2 Clients, 1 Student" in appointments today).

---

### Gap 4: Multi-Service Appointment in Frontend
**Problem:** The `NewBookingModal.jsx` has a single `service` field (dropdown), meaning only one service can be selected per appointment.  
**Resolution:** The backend `AppointmentService` table already supports multiple services. The frontend booking modal must be updated to a multi-select service picker. This is a frontend task, not a data model change.

---

### Gap 5: Appointment Payment Status vs Appointment Status
**Problem:** The requirements list both `status` (Booked/Completed/Cancelled) and `paymentStatus` (Paid/Unpaid) as separate fields, but the frontend prototype only shows `status`.  
**Resolution:** Both fields exist on the Appointment entity. `paymentStatus` is shown on the Appointment list as a secondary badge. It is auto-set during checkout but can also be manually toggled (Finance role) for edge cases.

---

### Gap 6: Supplier Pending Payments Not Auto-Triggered
**Problem:** The requirements mention supplier pending payments but don't specify whether they are auto-created or manually entered.  
**Resolution:** `SupplierPendingPayment` is **automatically created** by the backend when a Purchase is recorded with `paidAmount < totalAmount`. Staff cannot manually create a pending payment without a Purchase record.

---

### Gap 7: Credit Summary Staleness
**Problem:** If CreditSummary is a cached/denormalized table, it may go stale if CustomerReceivable records are updated directly.  
**Resolution:** CreditSummary is updated via domain events/triggers whenever a CustomerReceivable record is created, modified, or closed. Alternatively, implement it as a database view for simpler consistency.

---

### Gap 8: Student Fee Overpayment
**Problem:** No explicit guard on the student fee payment form to prevent paying more than the outstanding balance.  
**Resolution:** Frontend validates `amount ≤ paymentDue`. Backend also returns `400 Bad Request` with message "Payment exceeds outstanding balance" if the constraint is violated.

---

### Gap 9: No Customer Login / Self-Booking in v1
**Problem:** The userflow notes mention optional customer self-booking. The frontend prototype has no login or booking widget for customers.  
**Resolution:** Customer self-booking is **deferred to v2**. The current system is staff-operated only. All appointments are created by authenticated staff on behalf of customers.

---

### Gap 10: Course Instructor = Staff vs Free Text
**Problem:** The Course entity can have an instructor who is either a Staff member (tracked) or an external person (untracked).  
**Resolution:** Both are supported. If `instructorStaffId` is set, the name is pulled from Staff record and `instructorName` is auto-populated. If the instructor is external, `instructorStaffId` is null and `instructorName` is a free-text field. The UI shows a toggle: "Assign from Staff" vs "Enter manually."

---

*End of User Flow Documentation*
