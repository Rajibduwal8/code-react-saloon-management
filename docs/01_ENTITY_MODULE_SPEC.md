# Saloon Management System — Entity & Module Specification

**Version:** 1.0  
**Status:** Canonical Reference  
**Scope:** All entities, their fields, relationships, constraints, and business rules across every domain module.

---

## Table of Contents

1. [System Scope & Module Map](#1-system-scope--module-map)
2. [Master & Tenant Structure](#2-master--tenant-structure)
3. [User & Access Module](#3-user--access-module)
4. [Customer Module](#4-customer-module)
5. [Supplier Module](#5-supplier-module)
6. [Inventory & Service Module](#6-inventory--service-module)
7. [Appointment & Billing Module](#7-appointment--billing-module)
8. [Financial Records Module](#8-financial-records-module)
9. [Course & Student Module](#9-course--student-module)
10. [Reporting Module (Derived Views)](#10-reporting-module-derived-views)
11. [Entity Relationship Overview](#11-entity-relationship-overview)
12. [Enum & Lookup Reference](#12-enum--lookup-reference)

---

## 1. System Scope & Module Map

The Saloon Management System is a **multi-tenant SaaS platform** where each salon operates as an isolated tenant (Organization). All business data lives in a per-tenant database; only authentication and tenant registry live in the shared Master database.

| Module | Domain | Primary Entities |
|---|---|---|
| Master & Tenant | Platform | Organization, TenantInfo, OrganizationUser |
| User & Access | Operations | Staff, Role |
| Customer | CRM | Customer, CustomerType |
| Supplier | Procurement | Supplier |
| Inventory & Service | Catalogue | Category, Service, Product, Purchase, PurchaseItem |
| Appointment & Billing | Core | Appointment, AppointmentService, AdditionalBillingItem, PaymentTransaction |
| Financial Records | Finance | SaleRecord, SupplierPayment, SupplierPendingPayment, CustomerReceivable, CreditSummary, Expense, ExpenseType |
| Course & Student | Academy | Course, Student, StudentEnrollment, StudentFeeRecord |

---

## 2. Master & Tenant Structure

> These entities live in the **Master Database** only. They are never replicated into tenant databases.

### 2.1 Organization (Tenant)

Represents a single salon business on the platform.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | Auto-generated |
| `name` | string(200) | Required, Unique | Display name of the salon |
| `email` | string(200) | Required, Unique | Primary contact / login email |
| `orgCode` | string(20) | Required, Unique | Short code used in DB naming and headers |
| `status` | Enum | Required | `Active`, `Suspended`, `Archived` |
| `isPaid` | boolean | Default: false | Subscription payment status |
| `createdAt` | datetime | Auto | UTC |
| `updatedAt` | datetime | Auto | UTC |

**Business Rules:**
- An Organization cannot be deleted; only archived.
- `orgCode` is used to name the tenant database (e.g., `saloon_abc001`).
- Status `Suspended` blocks all API access for that tenant.

---

### 2.2 TenantInfo

Maps an Organization to its dedicated database.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `organizationId` | UUID | FK → Organization, Unique | One-to-one |
| `databaseName` | string(200) | Required, Unique | Physical DB name |
| `connectionString` | string(encrypted) | Required | AES-encrypted |
| `isPaid` | boolean | Default: false | Mirrors Organization.isPaid |
| `migrationAttemptCount` | int | Default: 0 | |
| `lastMigrationError` | text | Nullable | |
| `lastMigrationAttemptedAt` | datetime | Nullable | |
| `createdAt` | datetime | Auto | |

---

### 2.3 OrganizationUser (Master DB Bridge)

Links a platform user account to one or more organizations.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `userId` | string | FK → AspNetUsers | |
| `organizationId` | UUID | FK → Organization | |
| `role` | Enum | Required | `SuperAdmin`, `OrgAdmin`, `InternalStaff`, `Finance` |
| `createdAt` | datetime | Auto | |

**Business Rules:**
- A user may belong to multiple organizations (e.g., a super admin).
- The `role` field here determines coarse-grained platform access. Fine-grained feature access is determined by the Staff record in the tenant DB.

---

## 3. User & Access Module

> All entities below live in the **Tenant Database**.

### 3.1 Staff

Employees who operate the salon system. Each staff member has login credentials.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `userId` | string | Nullable, Unique | Links to AspNetUsers when login is provisioned |
| `firstName` | string(100) | Required | |
| `lastName` | string(100) | Required | |
| `phone` | string(20) | Required | Validated: 10 digits (Nepal format) |
| `email` | string(200) | Required, Unique | Used for login credential |
| `address` | string(500) | Nullable | Physical address |
| `position` | string(100) | Required | Job title, e.g., "Senior Therapist" |
| `department` | string(100) | Required | e.g., "Beauty Services", "Academy" |
| `role` | Enum | Required | `OrgAdmin`, `InternalStaff`, `Finance` |
| `salary` | decimal(18,2) | Required | Base salary amount |
| `status` | Enum | Required | `Active`, `Inactive`, `OnLeave` |
| `joinDate` | date | Required | |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- Staff with `role = OrgAdmin` can see all financial data and manage all modules.
- Staff with `role = InternalStaff` can create/manage appointments, courses, and services but cannot access financial reports.
- Staff with `role = Finance` can view/export all financial records but cannot modify appointments.
- Password is managed via ASP.NET Core Identity on the user account (`userId`); the Staff record stores the profile only.
- Deleting a staff record should soft-delete (set `status = Inactive`) to preserve historical appointment references.

**Relationships:**
- Staff → Appointment (one-to-many, as `assignedStaffId`)
- Staff → Course (one-to-many, as `instructorId`)

---

## 4. Customer Module

### 4.1 CustomerType

Categorization labels for customers.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(100) | Required, Unique | e.g., "Regular", "VIP", "Walk-in" |
| `description` | string(500) | Nullable | |
| `createdAt` | datetime | Auto | |

---

### 4.2 Customer

Core client profile used in appointment booking.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `firstName` | string(100) | Required | |
| `lastName` | string(100) | Required | |
| `phone` | string(20) | Required | 10-digit validation |
| `email` | string(200) | Nullable | |
| `address` | string(500) | Nullable | |
| `nationalId` | string(50) | Nullable, Unique | National identity document number |
| `skinType` | string(100) | Nullable | e.g., "Dry", "Combination", "Oily" — salon-specific context |
| `customerTypeId` | UUID | FK → CustomerType, Nullable | |
| `registeredDate` | date | Auto | Date of first registration |
| `notes` | text | Nullable | Internal notes about client preferences |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- Customers are distinct from Students. A person may be both, but they have separate records.
- Customer financial balance (credit) is tracked via `CustomerReceivable`, not on this entity directly.
- `nationalId` uniqueness is enforced at the tenant level to prevent duplicate registrations.

**Relationships:**
- Customer → Appointment (one-to-many)
- Customer → CustomerReceivable (one-to-many)

---

## 5. Supplier Module

### 5.1 Supplier

Vendor details for product procurement.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(200) | Required | |
| `phone` | string(20) | Required | |
| `address` | string(500) | Nullable | |
| `email` | string(200) | Nullable | |
| `notes` | text | Nullable | |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Relationships:**
- Supplier → Purchase (one-to-many)
- Supplier → SupplierPayment (one-to-many)
- Supplier → SupplierPendingPayment (one-to-many)

---

## 6. Inventory & Service Module

### 6.1 Category

Multi-purpose classification for services and products. Supports up to two levels (parent/child).

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(100) | Required | |
| `parentId` | UUID | FK → Category, Nullable | Null = top-level category |
| `type` | Enum | Required | `Service`, `Product`, `Both` |
| `createdAt` | datetime | Auto | |

---

### 6.2 Service

Bookable offerings with defined pricing. Used in appointment line items.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(200) | Required | |
| `description` | text | Nullable | |
| `categoryId` | UUID | FK → Category, Nullable | |
| `price` | decimal(18,2) | Required | Default/standard price |
| `durationMinutes` | int | Nullable | Estimated service duration |
| `status` | Enum | Required | `Active`, `Inactive` |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- A Service's `price` is the default. During appointment checkout, the price on the `AppointmentService` line item can be overridden.
- Inactive services cannot be selected when creating new appointments.

---

### 6.3 Product

Physical items that can be sold or added as billing items during appointment checkout.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(200) | Required | |
| `description` | text | Nullable | |
| `categoryId` | UUID | FK → Category, Nullable | |
| `purchasePrice` | decimal(18,2) | Nullable | Cost price from supplier |
| `sellingPrice` | decimal(18,2) | Required | Retail price |
| `stockQuantity` | int | Default: 0 | Current inventory level |
| `unit` | string(50) | Nullable | e.g., "ml", "piece", "bottle" |
| `status` | Enum | Required | `Active`, `Inactive` |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

---

### 6.4 Purchase (Purchase Order)

Records a procurement transaction from a supplier.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `supplierId` | UUID | FK → Supplier | |
| `purchaseDate` | date | Required | |
| `totalAmount` | decimal(18,2) | Required | Computed from line items |
| `paidAmount` | decimal(18,2) | Default: 0 | Amount paid at time of purchase |
| `paymentStatus` | Enum | Required | `Paid`, `PartiallyPaid`, `Unpaid` |
| `paymentMethod` | Enum | Nullable | `Cash`, `BankTransfer`, `Cheque` |
| `notes` | text | Nullable | |
| `createdAt` | datetime | Auto | |

**Business Rules:**
- When `paidAmount < totalAmount`, a `SupplierPendingPayment` record is automatically created for the outstanding balance.
- Stock quantities of included products are incremented when the purchase is confirmed.

---

### 6.5 PurchaseItem

Line items within a Purchase Order.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `purchaseId` | UUID | FK → Purchase | |
| `productId` | UUID | FK → Product | |
| `quantity` | int | Required, > 0 | |
| `unitPrice` | decimal(18,2) | Required | Price at time of purchase |
| `totalPrice` | decimal(18,2) | Computed | `quantity × unitPrice` |

---

### 6.6 ExpenseType

User-defined categories for classifying operational expenses.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(100) | Required, Unique | e.g., "Utilities", "Rent", "Supplies" |
| `createdAt` | datetime | Auto | |

---

### 6.7 Expense

Record of an individual operational expense.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `title` | string(200) | Required | Name/description of the expense |
| `expenseTypeId` | UUID | FK → ExpenseType | |
| `amount` | decimal(18,2) | Required | |
| `expenseDate` | date | Required | |
| `paymentMethod` | Enum | Required | `Cash`, `BankTransfer`, `Card`, `Other` |
| `remarks` | text | Nullable | |
| `recordedByStaffId` | UUID | FK → Staff, Nullable | |
| `createdAt` | datetime | Auto | |

---

## 7. Appointment & Billing Module

### 7.1 Appointment

The core transactional entity. Links customer, staff, services, and payment.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `customerId` | UUID | FK → Customer | |
| `assignedStaffId` | UUID | FK → Staff, Nullable | The therapist/provider |
| `appointmentDate` | date | Required | |
| `appointmentTime` | time | Required | |
| `status` | Enum | Required | `Booked`, `Completed`, `Cancelled` |
| `paymentStatus` | Enum | Required | `Paid`, `PartiallyPaid`, `Unpaid` |
| `totalAmount` | decimal(18,2) | Computed | Sum of all service and billing line items |
| `paidAmount` | decimal(18,2) | Default: 0 | Total amount received |
| `notes` | text | Nullable | Internal notes |
| `completedAt` | datetime | Nullable | Timestamp when status set to Completed |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- An appointment must have at least one `AppointmentService` line item.
- When `status = Completed`:
  - A `SaleRecord` is automatically created.
  - If `paidAmount < totalAmount`, a `CustomerReceivable` record is created for the difference.
  - `PaymentTransaction` records are created for each payment method used.
- When `status = Cancelled`, no `SaleRecord` is created.
- Editing an appointment is allowed only when `status = Booked`.

---

### 7.2 AppointmentService

A line item linking a service to an appointment. Supports per-appointment price overrides.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `appointmentId` | UUID | FK → Appointment | |
| `serviceId` | UUID | FK → Service | |
| `serviceNameSnapshot` | string(200) | Required | Snapshot at time of booking (for historical integrity) |
| `priceOverride` | decimal(18,2) | Nullable | If null, use Service.price |
| `effectivePrice` | decimal(18,2) | Computed | `priceOverride ?? Service.price` |

**Business Rules:**
- `serviceNameSnapshot` preserves the service name even if the Service record is later renamed.
- The frontend pre-fills `priceOverride` with the current service price; the user may modify it during checkout.

---

### 7.3 AdditionalBillingItem

Extra charges added at checkout (e.g., a product sold alongside the service).

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `appointmentId` | UUID | FK → Appointment | |
| `description` | string(300) | Required | What was sold/charged |
| `productId` | UUID | FK → Product, Nullable | Optional link if item is a tracked product |
| `quantity` | int | Default: 1 | |
| `unitPrice` | decimal(18,2) | Required | |
| `totalPrice` | decimal(18,2) | Computed | `quantity × unitPrice` |

**Business Rules:**
- If linked to a `Product`, its `stockQuantity` is decremented when the appointment is completed.

---

### 7.4 PaymentTransaction

A log entry for each payment received for an appointment. Supports split payments.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `appointmentId` | UUID | FK → Appointment | |
| `amount` | decimal(18,2) | Required | Amount for this payment leg |
| `paymentMethod` | Enum | Required | `Cash`, `Card`, `BankTransfer`, `QR`, `Credit` |
| `transactionReference` | string(200) | Nullable | Bank/card reference number |
| `paidAt` | datetime | Required | |
| `notes` | text | Nullable | |

**Business Rules:**
- Multiple records per appointment are allowed (split payment across methods).
- Sum of all `PaymentTransaction.amount` for an appointment must equal `Appointment.paidAmount`.

---

## 8. Financial Records Module

### 8.1 SaleRecord

An immutable record of a completed appointment sale. Auto-created on appointment completion.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `appointmentId` | UUID | FK → Appointment, Unique | |
| `customerId` | UUID | FK → Customer | Denormalized for reporting |
| `saleDate` | date | Required | Date of completion |
| `totalAmount` | decimal(18,2) | Required | Total invoice value |
| `paidAmount` | decimal(18,2) | Required | Total received |
| `outstandingAmount` | decimal(18,2) | Computed | `totalAmount - paidAmount` |
| `paymentMethods` | string(json) | Required | Serialized list of methods used |
| `createdAt` | datetime | Auto | |

**Business Rules:**
- SaleRecords are **never modified** after creation. All corrections are done via separate credit/refund entries.
- This entity is the authoritative source for the Sales Report.

---

### 8.2 SupplierPayment

Records payments made to suppliers (may be tied to a Purchase or standalone).

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `supplierId` | UUID | FK → Supplier | |
| `purchaseId` | UUID | FK → Purchase, Nullable | If settling a specific purchase |
| `amount` | decimal(18,2) | Required | |
| `paymentDate` | date | Required | |
| `paymentMethod` | Enum | Required | `Cash`, `BankTransfer`, `Cheque` |
| `reference` | string(200) | Nullable | |
| `notes` | text | Nullable | |
| `recordedByStaffId` | UUID | FK → Staff, Nullable | |
| `createdAt` | datetime | Auto | |

---

### 8.3 SupplierPendingPayment

Tracks outstanding balances owed to a supplier. Auto-created when a purchase is partially or unpaid.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `supplierId` | UUID | FK → Supplier | |
| `purchaseId` | UUID | FK → Purchase | |
| `originalAmount` | decimal(18,2) | Required | Total outstanding at creation |
| `remainingAmount` | decimal(18,2) | Required | Updated as payments are made |
| `dueDate` | date | Nullable | |
| `status` | Enum | Required | `Pending`, `PartiallyPaid`, `Cleared` |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- When a `SupplierPayment` is recorded against a `purchaseId`, this record's `remainingAmount` is reduced accordingly.
- Status changes automatically: `Pending → PartiallyPaid → Cleared`.

---

### 8.4 CustomerReceivable

Tracks money owed by customers (created when appointment has an unpaid balance).

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `customerId` | UUID | FK → Customer | |
| `appointmentId` | UUID | FK → Appointment, Nullable | Source of the receivable |
| `originalAmount` | decimal(18,2) | Required | Balance at time of creation |
| `remainingAmount` | decimal(18,2) | Required | Updated as customer pays |
| `status` | Enum | Required | `Outstanding`, `PartiallyPaid`, `Settled`, `Refunded` |
| `notes` | text | Nullable | |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- When a customer pays against an outstanding receivable, `remainingAmount` is reduced and a `PaymentTransaction` is recorded.
- Staff with `Finance` role can mark a receivable as `Refunded` and issue a reverse payment transaction.

---

### 8.5 CreditSummary

An aggregated, read-optimized view (or computed table) of all customer outstanding balances.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `customerId` | UUID | PK / Unique | |
| `totalCredited` | decimal(18,2) | Computed | Total ever credited |
| `totalCollected` | decimal(18,2) | Computed | Total ever collected |
| `currentBalance` | decimal(18,2) | Computed | Outstanding balance |
| `lastUpdatedAt` | datetime | Auto | |

**Implementation Note:** This can be implemented as a database view joining `CustomerReceivable` records, or as a denormalized table updated by application events. The denormalized approach is preferred for reporting performance.

---

## 9. Course & Student Module

### 9.1 Course

An educational offering managed by the salon academy.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(200) | Required | |
| `code` | string(50) | Required, Unique | Short identifier, e.g., "BAL-ADV-01" |
| `description` | text | Nullable | |
| `rate` | decimal(18,2) | Required | Standard course fee |
| `durationDays` | int | Required | Total course length in days |
| `instructorStaffId` | UUID | FK → Staff, Nullable | Assigned instructor |
| `instructorName` | string(200) | Nullable | Free-text if instructor is not a Staff record |
| `level` | Enum | Required | `Beginner`, `Intermediate`, `Advanced` |
| `status` | Enum | Required | `Active`, `Inactive`, `Completed` |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- If `instructorStaffId` is set, `instructorName` is populated from the Staff record.
- Inactive courses cannot accept new enrollments.

---

### 9.2 Student

A learner profile, distinct from a Customer even if the same person.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | string(200) | Required | Full name |
| `email` | string(200) | Nullable, Unique | |
| `phone` | string(20) | Required | |
| `address` | string(500) | Nullable | |
| `nationalId` | string(50) | Nullable, Unique | |
| `studentCode` | string(50) | Required, Unique | Auto-generated or manual code |
| `status` | Enum | Required | `Active`, `Completed`, `Dropped` |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

---

### 9.3 StudentEnrollment

Links a student to a course. This is the primary enrollment record.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `studentId` | UUID | FK → Student | |
| `courseId` | UUID | FK → Course | |
| `startDate` | date | Required | |
| `endDate` | date | Computed | `startDate + Course.durationDays` |
| `totalFee` | decimal(18,2) | Required | Agreed fee (may differ from Course.rate after discount) |
| `discount` | decimal(18,2) | Default: 0 | Scholarship/discount amount |
| `netFee` | decimal(18,2) | Computed | `totalFee - discount` |
| `paidAmount` | decimal(18,2) | Default: 0 | Running total of payments received |
| `paymentDue` | decimal(18,2) | Computed | `netFee - paidAmount` |
| `status` | Enum | Required | `Active`, `Completed`, `Cancelled` |
| `notes` | text | Nullable | |
| `createdAt` | datetime | Auto | |
| `updatedAt` | datetime | Auto | |

**Business Rules:**
- `paymentDue` must always be `>= 0`.
- When `paidAmount >= netFee`, the enrollment payment status is considered fully settled.
- A student may have multiple enrollments (one per course).
- Cancelling an enrollment does not auto-refund; refund is recorded manually.

---

### 9.4 StudentFeeRecord

An itemized payment record for a student enrollment.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | |
| `enrollmentId` | UUID | FK → StudentEnrollment | |
| `studentId` | UUID | FK → Student | Denormalized for reporting |
| `amount` | decimal(18,2) | Required | Payment amount |
| `paymentDate` | date | Required | |
| `paymentMethod` | Enum | Required | `Cash`, `BankTransfer`, `Card` |
| `receiptNumber` | string(100) | Nullable | Manual receipt reference |
| `notes` | text | Nullable | |
| `recordedByStaffId` | UUID | FK → Staff, Nullable | |
| `createdAt` | datetime | Auto | |

**Business Rules:**
- Each payment updates `StudentEnrollment.paidAmount` atomically.
- Sum of all `StudentFeeRecord.amount` for an enrollment = `StudentEnrollment.paidAmount`.

---

## 10. Reporting Module (Derived Views)

Reports are not separate entities but are defined queries over existing data. Each report specifies its data source, filters, and computed fields.

| Report Name | Source Entities | Key Filters | Key Output Columns |
|---|---|---|---|
| Sales Report | SaleRecord, Customer, AppointmentService, Service | DateRange, PaymentMethod, ServiceId | Date, Customer, Services, PaymentMethod, Total, Paid, Outstanding |
| Payment Statement | PaymentTransaction, SaleRecord | DateRange, Method | Date, Method, Amount, Reference, Appointment |
| Supplier Payment Report | SupplierPayment, Supplier, Purchase | DateRange, SupplierId | Date, Supplier, PurchaseRef, Amount, Method |
| Supplier Pending Payments | SupplierPendingPayment, Supplier | Status, SupplierId | Supplier, PurchaseDate, Original, Remaining, DueDate, Status |
| Credit Summary | CreditSummary, Customer | CustomerId | Customer, TotalCredited, Collected, Balance |
| Customer Receivable | CustomerReceivable, Customer | Status, CustomerId | Customer, Source, OriginalAmount, Remaining, Status |
| Student Enrollment Report | StudentEnrollment, Student, Course | DateRange, Status, CourseId | Student, Course, StartDate, NetFee, Paid, Due, Status |

**Export Formats:** All reports must support CSV and PDF export.

---

## 11. Entity Relationship Overview

```
Organization (Master)
  └── TenantInfo (Master, 1:1)
  └── OrganizationUser → AspNetUser (Master)

TENANT DATABASE:
Staff
  ├── Appointment.assignedStaffId (1:N)
  ├── Course.instructorStaffId (1:N)
  └── Expense.recordedByStaffId (1:N)

CustomerType
  └── Customer.customerTypeId (N:1)

Customer
  ├── Appointment.customerId (1:N)
  ├── CustomerReceivable.customerId (1:N)
  └── SaleRecord.customerId (1:N)

Supplier
  ├── Purchase.supplierId (1:N)
  └── SupplierPayment.supplierId (1:N)

Category
  ├── Service.categoryId (N:1)
  └── Product.categoryId (N:1)

Service
  └── AppointmentService.serviceId (N:1)

Product
  ├── PurchaseItem.productId (N:1)
  └── AdditionalBillingItem.productId (N:1, optional)

Purchase
  ├── PurchaseItem.purchaseId (1:N)
  ├── SupplierPayment.purchaseId (1:N, optional)
  └── SupplierPendingPayment.purchaseId (1:1, optional)

Appointment
  ├── AppointmentService.appointmentId (1:N)
  ├── AdditionalBillingItem.appointmentId (1:N)
  ├── PaymentTransaction.appointmentId (1:N)
  ├── SaleRecord.appointmentId (1:1)
  └── CustomerReceivable.appointmentId (1:1, optional)

Course
  └── StudentEnrollment.courseId (N:1)

Student
  ├── StudentEnrollment.studentId (1:N)
  └── StudentFeeRecord.studentId (1:N)

StudentEnrollment
  └── StudentFeeRecord.enrollmentId (1:N)

ExpenseType
  └── Expense.expenseTypeId (N:1)
```

---

## 12. Enum & Lookup Reference

| Enum Name | Values |
|---|---|
| `OrganizationStatus` | `Active`, `Suspended`, `Archived` |
| `PlatformRole` | `SuperAdmin`, `OrgAdmin`, `InternalStaff`, `Finance` |
| `StaffStatus` | `Active`, `Inactive`, `OnLeave` |
| `StaffRole` | `OrgAdmin`, `InternalStaff`, `Finance` |
| `AppointmentStatus` | `Booked`, `Completed`, `Cancelled` |
| `PaymentStatus` | `Paid`, `PartiallyPaid`, `Unpaid` |
| `PaymentMethod` | `Cash`, `Card`, `BankTransfer`, `QR`, `Credit` |
| `ServiceStatus` | `Active`, `Inactive` |
| `ProductStatus` | `Active`, `Inactive` |
| `CourseStatus` | `Active`, `Inactive`, `Completed` |
| `CourseLevel` | `Beginner`, `Intermediate`, `Advanced` |
| `StudentStatus` | `Active`, `Completed`, `Dropped` |
| `EnrollmentStatus` | `Active`, `Completed`, `Cancelled` |
| `SupplierPaymentStatus` | `Pending`, `PartiallyPaid`, `Cleared` |
| `ReceivableStatus` | `Outstanding`, `PartiallyPaid`, `Settled`, `Refunded` |
| `CategoryType` | `Service`, `Product`, `Both` |

---

*End of Entity & Module Specification*
