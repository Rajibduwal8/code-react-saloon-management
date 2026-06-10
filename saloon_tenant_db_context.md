# Saloon — Tenant Database Context

> All entities inherit from `_AuditEntity` which provides: `CreatedDate`, `CreatedByUserName`, `ModifiedDate`, `ModifiedByUserName`, `DeletedDate`, `DeletedByUserName`, `DeletedReason`.

---

## 1. Entities

### 1.1 Staff
Represents salon employees and instructors.

| Field | Type | Notes |
|---|---|---|
| Code | string | Unique identifier |
| Name | string | Full name |
| Address | string | |
| Mobile | string | |
| Email | string | |
| Status | enum | Active / Inactive |
| NationalId | string | |
| Balance | decimal | Running balance |
| Roles | string[] | Multiple roles |

**Payroll Details** *(embedded)*

| Field | Type |
|---|---|
| JoinDate | date |
| BasicAmount | decimal |
| GradeAmount | decimal |
| Allowances | decimal |
| Deductions | decimal |
| NetAmount | decimal |
| TerminationDate | date? |

**Bank Details** *(embedded)*

| Field | Type |
|---|---|
| BankName | string |
| AccountNo | string |
| AccountTitle | string |
| BranchName | string |

**Leave Applications** → see *Leave Management* entity.

---

### 1.2 Client
Walk-in or registered salon customers.

| Field | Type | Notes |
|---|---|---|
| Code | string | |
| Name | string | |
| Address | string | |
| Mobile | string | |
| Email | string | |
| Status | enum | Active / Inactive |
| NationalId | string | |
| Balance | decimal | |
| Allergies | string | |
| SkinType | string | |
| HairType | string | |
| PreferredStaffId | FK → Staff | |

---

### 1.3 Student
Individuals enrolled in training courses.

| Field | Type |
|---|---|
| Code | string |
| Name | string |
| Address | string |
| Mobile | string |
| Email | string |
| Status | enum |
| NationalId | string |
| Balance | decimal |

---

### 1.4 Course Category
Groups of related courses.

| Field | Type |
|---|---|
| Code | string |
| Title | string |
| Description | string |

---

### 1.5 Course
Training programs offered by the salon.

| Field | Type | Notes |
|---|---|---|
| Code | string | |
| Title | string | |
| Description | string | |
| Rate | decimal | |
| Status | enum | Active / Inactive |
| InstructorStaffId | FK → Staff | |
| DurationHours | int | |
| Level | enum | Beginner / Intermediate / Advanced |
| CategoryId | FK → Course Category | |

---

### 1.6 Enrollment
Links a Student to a Course, tracks fees and progress.

| Field | Type |
|---|---|
| StudentId | FK → Student |
| CourseId | FK → Course |
| StartDate | date |
| DurationDays | int |
| Rate | decimal |
| DiscountAmount | decimal |
| PayableAmount | decimal |
| PaidAmount | decimal |
| DueAmount | decimal |
| Status | enum |
| Remarks | string |
| CertificateIssuedDate | date? |
| CancelledAt | datetime? |

**Communication Logs** *(child collection)*

| Field | Type |
|---|---|
| DateAndTime | datetime |
| Comments | string |

**Payment Logs** *(child collection)*

| Field | Type | Notes |
|---|---|---|
| Date | date | |
| TxnRef | string | |
| PaymentMethod | enum | Cash / QR / Cheque |
| PaidAmount | decimal | |
| Remarks | string | |

---

### 1.7 Service
Individual salon services or packages.

| Field | Type |
|---|---|
| Code | string |
| Title | string |
| Description | string |
| EstimatedDurationMins | int |
| MinPrice | decimal |
| GeneralRate | decimal |
| Status | enum |
| PackageIncludes | string |
| PackageExcludes | string |

---

### 1.8 Appointment
Booking made by a Client or Student for one or more services.

| Field | Type | Notes |
|---|---|---|
| ClientId / StudentId | FK | Polymorphic |
| AppointmentDate | date | |
| AppointmentTime | time | |
| Duration | int | In minutes |
| Remarks | string | |
| ServiceStaffId | FK → Staff | Default staff |
| Status | enum | Scheduled / Confirmed / In-Progress / Completed / Cancelled / No-Show |

**Appointment Services** *(child collection)*

| Field | Type |
|---|---|
| ServiceId | FK → Service |
| Rate | decimal |
| AssignedStaffId | FK → Staff |
| EstimatedDurationMins | int |
| ActualDurationMins | int |
| StatusPerService | enum |

**Communication Logs** *(child collection)*

| Field | Type |
|---|---|
| DateAndTime | datetime |
| Comments | string |
| Status | string |

**Payment Logs** *(child collection)*

| Field | Type | Notes |
|---|---|---|
| Date | date | |
| TxnRef | string | |
| PaymentMethod | enum | Cash / QR / Cheque |
| PaidAmount | decimal | |
| Remarks | string | |

---

### 1.9 Payroll
Monthly salary processing record per Staff member.

| Field | Type | Notes |
|---|---|---|
| Year | int | |
| Month | int | |
| StaffId | FK → Staff | |
| TotalPayable | decimal | |
| PaidAmount | decimal | |
| PresentDays | int | |
| AbsentDays | int | |
| DeductionDays | int | |
| DeductionAmt | decimal | |
| TaxAmt | decimal | |
| NetAmount | decimal | |
| PaymentDate | date? | |
| Status | enum | Draft / Approved / Paid |

---

### 1.10 Leave Management
Staff leave applications.

| Field | Type | Notes |
|---|---|---|
| StaffId | FK → Staff | |
| SubmittedDate | date | |
| LeaveFromDate | date | |
| LeaveToDate | date | |
| LeaveCategory | enum | Sick / Casual / etc. |
| LeaveType | enum | Half Day / Full Day / Multiple Days |
| Status | enum | Draft / Submitted / Approved / Rejected |
| LeaveReason | string | |

---

### 1.11 Settings
Tenant-level configuration.

| Group | Fields |
|---|---|
| SMS Settings | Provider, API Key, Sender Name, Enabled |
| Reminder Settings | ReminderBeforeHours, Channel (SMS/Email/Both), Enabled |

---

## 2. Entity Relationship Diagram

```mermaid
erDiagram

    _AuditEntity {
        datetime CreatedDate
        string CreatedByUserName
        datetime ModifiedDate
        string ModifiedByUserName
        datetime DeletedDate
        string DeletedByUserName
        string DeletedReason
    }

    Staff {
        string Code PK
        string Name
        string Mobile
        string Email
        string NationalId
        string Status
        decimal Balance
        date JoinDate
        decimal BasicAmount
        decimal GradeAmount
        decimal Allowances
        decimal Deductions
        decimal NetAmount
        date TerminationDate
        string BankName
        string AccountNo
        string AccountTitle
        string BranchName
    }

    Client {
        string Code PK
        string Name
        string Mobile
        string Email
        string NationalId
        string Status
        decimal Balance
        string Allergies
        string SkinType
        string HairType
        string PreferredStaffId FK
    }

    Student {
        string Code PK
        string Name
        string Mobile
        string Email
        string NationalId
        string Status
        decimal Balance
    }

    CourseCategory {
        string Code PK
        string Title
        string Description
    }

    Course {
        string Code PK
        string Title
        decimal Rate
        string Status
        string InstructorStaffId FK
        int DurationHours
        string Level
        string CategoryId FK
    }

    Enrollment {
        int Id PK
        string StudentId FK
        string CourseId FK
        date StartDate
        int DurationDays
        decimal Rate
        decimal DiscountAmount
        decimal PayableAmount
        decimal PaidAmount
        decimal DueAmount
        string Status
        date CertificateIssuedDate
        datetime CancelledAt
    }

    EnrollmentCommunicationLog {
        int Id PK
        int EnrollmentId FK
        datetime DateAndTime
        string Comments
    }

    EnrollmentPaymentLog {
        int Id PK
        int EnrollmentId FK
        date Date
        string TxnRef
        string PaymentMethod
        decimal PaidAmount
        string Remarks
    }

    Service {
        string Code PK
        string Title
        int EstimatedDurationMins
        decimal MinPrice
        decimal GeneralRate
        string Status
    }

    Appointment {
        int Id PK
        string ClientId FK
        string StudentId FK
        date AppointmentDate
        time AppointmentTime
        int Duration
        string ServiceStaffId FK
        string Status
    }

    AppointmentService {
        int Id PK
        int AppointmentId FK
        string ServiceId FK
        decimal Rate
        string AssignedStaffId FK
        int EstimatedDurationMins
        int ActualDurationMins
        string StatusPerService
    }

    AppointmentCommunicationLog {
        int Id PK
        int AppointmentId FK
        datetime DateAndTime
        string Comments
        string Status
    }

    AppointmentPaymentLog {
        int Id PK
        int AppointmentId FK
        date Date
        string TxnRef
        string PaymentMethod
        decimal PaidAmount
        string Remarks
    }

    Payroll {
        int Id PK
        int Year
        int Month
        string StaffId FK
        decimal TotalPayable
        decimal PaidAmount
        int PresentDays
        int AbsentDays
        int DeductionDays
        decimal DeductionAmt
        decimal TaxAmt
        decimal NetAmount
        date PaymentDate
        string Status
    }

    LeaveManagement {
        int Id PK
        string StaffId FK
        date SubmittedDate
        date LeaveFromDate
        date LeaveToDate
        string LeaveCategory
        string LeaveType
        string Status
        string LeaveReason
    }

    Settings {
        int Id PK
        string SMSProvider
        string SMSApiKey
        string SMSSenderName
        bool SMSEnabled
        int ReminderBeforeHours
        string ReminderChannel
        bool ReminderEnabled
    }

    %% Relationships
    Staff ||--o{ Enrollment : "instructs (via Course)"
    Staff ||--o{ Appointment : "serves"
    Staff ||--o{ AppointmentService : "assigned to"
    Staff ||--o{ Payroll : "has"
    Staff ||--o{ LeaveManagement : "applies"
    Client ||--o{ Appointment : "books"
    Student ||--o{ Enrollment : "enrolls"
    Student ||--o{ Appointment : "books"
    CourseCategory ||--o{ Course : "groups"
    Course ||--o{ Enrollment : "enrolled in"
    Enrollment ||--o{ EnrollmentCommunicationLog : "has"
    Enrollment ||--o{ EnrollmentPaymentLog : "has"
    Appointment ||--o{ AppointmentService : "includes"
    Appointment ||--o{ AppointmentCommunicationLog : "has"
    Appointment ||--o{ AppointmentPaymentLog : "has"
    Service ||--o{ AppointmentService : "used in"
    Client }o--|| Staff : "preferred staff"
```

---

## 3. Application Flow Diagram

### 3.1 Appointment Booking Flow

```mermaid
flowchart TD
    A([Start]) --> B{Client or Student?}
    B -- Client --> C[Select Service/s]
    B -- Student --> C
    C --> D[Choose Appointment Date & Time]
    D --> E[Assign Staff per Service]
    E --> F[Save Appointment\nStatus: Scheduled]
    F --> G[Send Reminder\nvia SMS/Email]
    G --> H{Confirmation?}
    H -- Confirmed --> I[Status: Confirmed]
    H -- No Response --> J[Status: Scheduled\nRetry Reminder]
    I --> K[Appointment Day]
    K --> L[Status: In-Progress]
    L --> M[Record Actual Duration\nper Service]
    M --> N[Status: Completed]
    N --> O[Process Payment]
    O --> P[Add Payment Log]
    P --> Q([End])
    H -- Cancelled --> R[Status: Cancelled]
    K -- No Show --> S[Status: No-Show]
    R --> Q
    S --> Q
```

---

### 3.2 Course Enrollment Flow

```mermaid
flowchart TD
    A([Start]) --> B[Select Student]
    B --> C[Select Course]
    C --> D[Set Start Date & Duration]
    D --> E[Calculate: Rate − Discount\n= Payable Amount]
    E --> F[Save Enrollment\nStatus: Active]
    F --> G{Payment Collected?}
    G -- Yes --> H[Add Payment Log\nUpdate Paid/Due Amount]
    G -- No --> I[Due Amount Pending]
    H --> J{Fully Paid?}
    I --> K[Follow-up Communication Log]
    K --> G
    J -- No --> K
    J -- Yes --> L[Course Completed]
    L --> M{Issue Certificate?}
    M -- Yes --> N[Set CertificateIssuedDate]
    M -- No --> O[Mark Complete]
    N --> O
    O --> P([End])
    F -- Cancelled --> Q[Set CancelledAt\nStatus: Cancelled]
    Q --> P
```

---

### 3.3 Payroll Processing Flow

```mermaid
flowchart TD
    A([Start: Month End]) --> B[Pull Staff Attendance\nPresent / Absent Days]
    B --> C[Fetch Staff Payroll Details\nBasic + Grade + Allowances]
    C --> D[Calculate Deductions\nAbsent Days × Daily Rate]
    D --> E[Calculate Tax Amount]
    E --> F[Compute Net Amount]
    F --> G[Create Payroll Record\nStatus: Draft]
    G --> H[Manager Reviews]
    H --> I{Approve?}
    I -- Reject --> J[Revise & Resubmit]
    J --> H
    I -- Approve --> K[Status: Approved]
    K --> L[Process Bank Transfer\nor Cash Payment]
    L --> M[Set PaymentDate\nStatus: Paid]
    M --> N([End])
```

---

### 3.4 Leave Application Flow

```mermaid
flowchart TD
    A([Staff Submits Leave]) --> B[Fill Leave Details\nCategory, Type, Dates, Reason]
    B --> C[Status: Draft]
    C --> D[Submit Application\nStatus: Submitted]
    D --> E[Manager Notified]
    E --> F{Decision}
    F -- Approve --> G[Status: Approved]
    F -- Reject --> H[Status: Rejected\nNotify Staff]
    G --> I[Deduct from Leave Balance\nFlag in Payroll]
    I --> J([End])
    H --> J
```

---

## 4. Module Summary

| Module | Key Entities | Relations |
|---|---|---|
| HR | Staff, Payroll, Leave Management | Staff → Payroll, Staff → Leave |
| Appointments | Client/Student, Appointment, Service, AppointmentService | Client/Student → Appointment → Services |
| Courses | Student, CourseCategory, Course, Enrollment | Student → Enrollment → Course |
| Payments | EnrollmentPaymentLog, AppointmentPaymentLog | Embedded in Enrollment / Appointment |
| Configuration | Settings | Tenant-level singleton |
