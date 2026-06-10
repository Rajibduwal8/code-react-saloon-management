# Saloon Management System — Complete .NET Backend Implementation Prompt

> **For:** ASP.NET Core Web API Backend Developer  
> **Target Framework:** .NET 8.0+  
> **Database:** EF Core with SQL Server (or PostgreSQL)  
> **Architecture:** Clean Architecture with Repository Pattern, CQRS-inspired handlers, Dependency Injection  

---

## OVERVIEW & CONTEXT

This is a **multi-tenant SaaS application** for salon/wellness studio management. The frontend (React) is already built and expects a REST API that follows specific conventions. Your backend will implement 5 core modules:

1. **Course API** — Course categories and courses with enrollment support
2. **Staff API** — Employee/instructor management with payroll details
3. **Leave Management API** — Staff leave applications and approvals
4. **Student Enrollment API** — Student records and course enrollment tracking
5. **Walk-In Client Billing API** — Anonymous/quick billing without pre-booked appointments

**Key Architectural Decisions:**
- All entities inherit from `_AuditEntity` (soft-delete pattern)
- Multi-tenant support via tenant headers (`tenantOutletId`, `tenantCostCenterId`)
- Bearer token authentication (JWT)
- Standard `ApiResponse<T>` wrapper for all responses
- FluentValidation for all DTOs
- AutoMapper for entity ↔ DTO mapping
- Pagination and search/filter on all list endpoints

---

## DATABASE SCHEMA (EF Core Models)

### Base Audit Entity (All entities inherit from this)

```csharp
public abstract class _AuditEntity
{
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public string CreatedByUserName { get; set; }
    
    public DateTime? ModifiedDate { get; set; }
    public string ModifiedByUserName { get; set; }
    
    public DateTime? DeletedDate { get; set; }
    public string DeletedByUserName { get; set; }
    public string DeletedReason { get; set; }
    
    // Soft-delete query helper
    public bool IsDeleted => DeletedDate.HasValue;
}
```

### Entity Models

#### 1. CourseCategory (inherits `_AuditEntity`)
```
Code (string, PK, unique per tenant)
Title (string, required)
Description (string, nullable)
TenantOutletId (string, required — tenant scoping)

Navigation:
  - Courses (ICollection<Course>)
```

#### 2. Course (inherits `_AuditEntity`)
```
Code (string, PK, unique per tenant)
Title (string, required)
Description (string, nullable)
Rate (decimal, > 0)
Status (string enum: Active | Inactive)
InstructorStaffId (string, FK → Staff.Code, nullable)
DurationHours (int, > 0)
Level (string enum: Beginner | Intermediate | Advanced)
CategoryCode (string, FK → CourseCategory.Code)
TenantOutletId (string, required)

Navigation:
  - Category (CourseCategory)
  - InstructorStaff (Staff)
  - Enrollments (ICollection<Enrollment>)
```

#### 3. Staff (inherits `_AuditEntity`)
```
Code (string, PK, unique per tenant)
Name (string, required)
Address (string, nullable)
Mobile (string, nullable)
Email (string, required, unique per tenant)
Status (string enum: Active | Inactive)
Balance (decimal, read-only in API layer)
Roles (string array — serialized as comma-separated or JSON)
TenantOutletId (string, required)

Embedded Objects:
  PayrollDetails:
    - JoinDate (date)
    - BasicAmount (decimal)
    - GradeAmount (decimal)
    - Allowances (decimal)
    - Deductions (decimal)
    - NetAmount (decimal, computed: Basic + Grade + Allowances - Deductions)
    - TerminationDate (date, nullable)
    
  BankDetails:
    - BankName (string, nullable)
    - AccountNo (string, nullable)
    - AccountTitle (string, nullable)
    - BranchName (string, nullable)

Navigation:
  - CourseInstructor (ICollection<Course>)
  - AppointmentServices (ICollection<AppointmentService>)
  - Payrolls (ICollection<Payroll>)
  - LeaveApplications (ICollection<LeaveManagement>)
  - WalkInBillingItems (ICollection<WalkInBillingItem>)
```

#### 4. Student (inherits `_AuditEntity`)
```
Code (string, PK, unique per tenant)
Name (string, required)
Address (string, nullable)
Mobile (string, nullable)
Email (string, required, unique per tenant)
Status (string enum: Active | Inactive)
Balance (decimal, read-only)
TenantOutletId (string, required)

Navigation:
  - Enrollments (ICollection<Enrollment>)

NOTE: NationalId is EXCLUDED — no such field in Student
```

#### 5. Enrollment (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
StudentCode (string, FK → Student.Code)
CourseCode (string, FK → Course.Code)
StartDate (date)
DurationDays (int)
Rate (decimal, locked snapshot at enrollment)
DiscountAmount (decimal, default 0)
PayableAmount (decimal, computed: Rate - DiscountAmount)
PaidAmount (decimal, computed from PaymentLogs)
DueAmount (decimal, computed: PayableAmount - PaidAmount)
Status (string enum: Active | Completed | Cancelled)
Remarks (string, nullable)
CertificateIssuedDate (date, nullable)
CancelledAt (datetime, nullable)
TenantOutletId (string, required)

Navigation:
  - Student (Student)
  - Course (Course)
  - CommunicationLogs (ICollection<EnrollmentCommunicationLog>)
  - PaymentLogs (ICollection<EnrollmentPaymentLog>)
```

#### 6. EnrollmentCommunicationLog (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
EnrollmentId (int, FK → Enrollment.Id)
DateAndTime (datetime)
Comments (string)
TenantOutletId (string, required)

Navigation:
  - Enrollment (Enrollment)
```

#### 7. EnrollmentPaymentLog (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
EnrollmentId (int, FK → Enrollment.Id)
Date (date)
TxnRef (string)
PaymentMethod (string enum: Cash | QR | Cheque)
PaidAmount (decimal)
Remarks (string, nullable)
TenantOutletId (string, required)

Navigation:
  - Enrollment (Enrollment)
```

#### 8. LeaveManagement (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
StaffCode (string, FK → Staff.Code)
SubmittedDate (date)
LeaveFromDate (date)
LeaveToDate (date)
LeaveCategory (string enum: Sick | Casual | Annual | Unpaid)
LeaveType (string enum: HalfDay | FullDay | MultipleDays)
Status (string enum: Draft | Submitted | Approved | Rejected)
LeaveReason (string)
TenantOutletId (string, required)

Navigation:
  - Staff (Staff)
```

#### 9. Payroll (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
Year (int)
Month (int)
StaffCode (string, FK → Staff.Code)
TotalPayable (decimal)
PaidAmount (decimal)
PresentDays (int)
AbsentDays (int)
DeductionDays (int)
DeductionAmt (decimal)
TaxAmt (decimal)
NetAmount (decimal)
PaymentDate (date, nullable)
Status (string enum: Draft | Approved | Paid)
TenantOutletId (string, required)

Navigation:
  - Staff (Staff)
```

#### 10. WalkInBilling (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
ClientCode (string, FK → Client.Code, nullable)
ClientName (string, required — used for anonymous billing)
BillingDate (date)
BillingTime (time)
StaffCode (string, FK → Staff.Code)
TotalAmount (decimal, computed from BillingItems)
DiscountAmount (decimal, default 0)
PayableAmount (decimal, computed: TotalAmount - DiscountAmount)
PaidAmount (decimal, computed from PaymentLogs)
DueAmount (decimal, computed: PayableAmount - PaidAmount)
Status (string enum: Draft | Completed | Cancelled)
Remarks (string, nullable)
TenantOutletId (string, required)

Navigation:
  - BillingItems (ICollection<WalkInBillingItem>)
  - PaymentLogs (ICollection<WalkInBillingPaymentLog>)
```

#### 11. WalkInBillingItem (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
WalkInBillingId (int, FK → WalkInBilling.Id)
ServiceCode (string, FK → Service.Code)
ServiceTitle (string, snapshot denormalized from Service.Title)
Rate (decimal)
AssignedStaffCode (string, FK → Staff.Code, nullable)
Remarks (string, nullable)
TenantOutletId (string, required)

Navigation:
  - WalkInBilling (WalkInBilling)
```

#### 12. WalkInBillingPaymentLog (inherits `_AuditEntity`)
```
Id (int, PK, auto-generated)
WalkInBillingId (int, FK → WalkInBilling.Id)
Date (date)
TxnRef (string)
PaymentMethod (string enum: Cash | QR | Cheque)
PaidAmount (decimal)
Remarks (string, nullable)
TenantOutletId (string, required)

Navigation:
  - WalkInBilling (WalkInBilling)
```

---

## COMPLETE FOLDER STRUCTURE

```
SaloonManagementAPI/
├── src/
│   ├── SaloonManagementAPI.csproj
│   ├── Program.cs                           # DI, middleware, CORS, Swagger
│   │
│   ├── Data/
│   │   ├── ApplicationDbContext.cs           # EF Core context with all DbSets
│   │   ├── ContextExtensions.cs              # Helper queries (soft-delete filters, etc.)
│   │   └── Migrations/
│   │
│   ├── Models/
│   │   ├── Common/
│   │   │   └── _AuditEntity.cs
│   │   ├── Course/
│   │   │   ├── CourseCategory.cs
│   │   │   └── Course.cs
│   │   ├── Staff/
│   │   │   ├── Staff.cs
│   │   │   ├── PayrollDetails.cs             # Embedded type
│   │   │   ├── BankDetails.cs                # Embedded type
│   │   │   └── Payroll.cs
│   │   ├── Student/
│   │   │   ├── Student.cs
│   │   │   ├── Enrollment.cs
│   │   │   ├── EnrollmentCommunicationLog.cs
│   │   │   └── EnrollmentPaymentLog.cs
│   │   ├── LeaveManagement.cs
│   │   ├── WalkInBilling/
│   │   │   ├── WalkInBilling.cs
│   │   │   ├── WalkInBillingItem.cs
│   │   │   └── WalkInBillingPaymentLog.cs
│   │   └── Common/
│   │       └── ApiResponse.cs
│   │
│   ├── DTOs/
│   │   ├── Common/
│   │   │   ├── ApiResponse.cs
│   │   │   └── PaginatedResult.cs
│   │   ├── CourseCategory/
│   │   │   ├── CourseCategoryRequestDto.cs
│   │   │   └── CourseCategoryResponseDto.cs
│   │   ├── Course/
│   │   │   ├── CourseRequestDto.cs
│   │   │   ├── CourseResponseDto.cs
│   │   │   └── CourseListItemDto.cs
│   │   ├── Staff/
│   │   │   ├── StaffRequestDto.cs
│   │   │   ├── StaffResponseDto.cs
│   │   │   ├── StaffListItemDto.cs
│   │   │   └── StaffDropdownDto.cs
│   │   ├── LeaveManagement/
│   │   │   ├── LeaveApplicationRequestDto.cs
│   │   │   ├── LeaveApplicationResponseDto.cs
│   │   │   └── LeaveApplicationListItemDto.cs
│   │   ├── Student/
│   │   │   ├── StudentRequestDto.cs
│   │   │   ├── StudentResponseDto.cs
│   │   │   └── StudentListItemDto.cs
│   │   ├── Enrollment/
│   │   │   ├── EnrollmentRequestDto.cs
│   │   │   ├── EnrollmentResponseDto.cs
│   │   │   ├── EnrollmentListItemDto.cs
│   │   │   ├── EnrollmentPaymentLogRequestDto.cs
│   │   │   └── EnrollmentCommunicationLogRequestDto.cs
│   │   └── WalkInBilling/
│   │       ├── WalkInBillingRequestDto.cs
│   │       ├── WalkInBillingResponseDto.cs
│   │       ├── WalkInBillingListItemDto.cs
│   │       ├── WalkInBillingItemRequestDto.cs
│   │       └── WalkInBillingPaymentLogRequestDto.cs
│   │
│   ├── Validators/
│   │   ├── CourseCategory/
│   │   │   └── CourseCategoryValidator.cs
│   │   ├── Course/
│   │   │   └── CourseValidator.cs
│   │   ├── Staff/
│   │   │   └── StaffValidator.cs
│   │   ├── LeaveManagement/
│   │   │   └── LeaveApplicationValidator.cs
│   │   ├── Student/
│   │   │   └── StudentValidator.cs
│   │   ├── Enrollment/
│   │   │   ├── EnrollmentValidator.cs
│   │   │   ├── EnrollmentPaymentLogValidator.cs
│   │   │   └── EnrollmentCommunicationLogValidator.cs
│   │   └── WalkInBilling/
│   │       ├── WalkInBillingValidator.cs
│   │       ├── WalkInBillingItemValidator.cs
│   │       └── WalkInBillingPaymentLogValidator.cs
│   │
│   ├── Services/
│   │   ├── Common/
│   │   │   └── BaseService.cs                # Base class with tenant scoping
│   │   ├── CourseCategory/
│   │   │   └── CourseCategoryService.cs
│   │   ├── Course/
│   │   │   └── CourseService.cs
│   │   ├── Staff/
│   │   │   └── StaffService.cs
│   │   ├── LeaveManagement/
│   │   │   └── LeaveApplicationService.cs
│   │   ├── Student/
│   │   │   ├── StudentService.cs
│   │   │   └── EnrollmentService.cs
│   │   └── WalkInBilling/
│   │       └── WalkInBillingService.cs
│   │
│   ├── Repositories/
│   │   ├── Common/
│   │   │   └── BaseRepository.cs             # Base with soft-delete filters
│   │   ├── CourseCategory/
│   │   │   └── CourseCategoryRepository.cs
│   │   ├── Course/
│   │   │   └── CourseRepository.cs
│   │   ├── Staff/
│   │   │   └── StaffRepository.cs
│   │   ├── LeaveManagement/
│   │   │   └── LeaveApplicationRepository.cs
│   │   ├── Student/
│   │   │   ├── StudentRepository.cs
│   │   │   └── EnrollmentRepository.cs
│   │   └── WalkInBilling/
│   │       └── WalkInBillingRepository.cs
│   │
│   ├── Controllers/
│   │   ├── Common/
│   │   │   └── BaseController.cs             # Base with tenant extraction
│   │   ├── CourseCategoriesController.cs
│   │   ├── CoursesController.cs
│   │   ├── StaffController.cs
│   │   ├── LeaveApplicationsController.cs
│   │   ├── StudentsController.cs
│   │   ├── EnrollmentsController.cs
│   │   └── WalkInBillingsController.cs
│   │
│   ├── Mapping/
│   │   ├── MappingProfile.cs                 # AutoMapper profiles for all entities
│   │   └── ...
│   │
│   ├── Middleware/
│   │   ├── ErrorHandlingMiddleware.cs
│   │   ├── TenantMiddleware.cs               # Extract & validate tenant headers
│   │   └── LoggingMiddleware.cs
│   │
│   └── Helpers/
│       ├── PaginationHelper.cs
│       ├── SearchFilterHelper.cs
│       └── Constants.cs

└── tests/
    ├── SaloonManagementAPI.Tests.csproj
    ├── Services/
    │   ├── CourseServiceTests.cs
    │   ├── StaffServiceTests.cs
    │   └── ...
    └── Controllers/
        ├── CoursesControllerTests.cs
        └── ...
```

---

## API ENDPOINT SPECIFICATIONS

### Module 1: Course Categories & Courses

#### CourseCategories

| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | `/api/course-categories` | Query: `search?`, `pageNumber`, `pageSize` | `ApiResponse<PaginatedResult<CourseCategoryResponseDto>>` | 200 |
| GET | `/api/course-categories/{code}` | — | `ApiResponse<CourseCategoryResponseDto>` | 200 / 404 |
| POST | `/api/course-categories` | `CourseCategoryRequestDto` | `ApiResponse<CourseCategoryResponseDto>` | 201 |
| PUT | `/api/course-categories/{code}` | `CourseCategoryRequestDto` | `ApiResponse<CourseCategoryResponseDto>` | 200 / 404 |
| DELETE | `/api/course-categories/{code}` | — | `ApiResponse<object>` | 204 / 400 / 404 |

#### Courses

| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | `/api/courses` | Query: `search?`, `status?`, `categoryCode?`, `level?`, `instructorStaffCode?`, `pageNumber`, `pageSize` | `ApiResponse<PaginatedResult<CourseListItemDto>>` | 200 |
| GET | `/api/courses/{code}` | — | `ApiResponse<CourseResponseDto>` | 200 / 404 |
| POST | `/api/courses` | `CourseRequestDto` | `ApiResponse<CourseResponseDto>` | 201 |
| PUT | `/api/courses/{code}` | `CourseRequestDto` | `ApiResponse<CourseResponseDto>` | 200 / 404 |
| DELETE | `/api/courses/{code}` | — | `ApiResponse<object>` | 204 / 400 / 404 |

### Module 2: Staff

| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | `/api/staff` | Query: `search?`, `status?`, `role?`, `pageNumber`, `pageSize` | `ApiResponse<PaginatedResult<StaffListItemDto>>` | 200 |
| GET | `/api/staff/{code}` | — | `ApiResponse<StaffResponseDto>` | 200 / 404 |
| GET | `/api/staff/dropdown` | — | `ApiResponse<List<StaffDropdownDto>>` | 200 |
| POST | `/api/staff` | `StaffRequestDto` | `ApiResponse<StaffResponseDto>` | 201 |
| PUT | `/api/staff/{code}` | `StaffRequestDto` | `ApiResponse<StaffResponseDto>` | 200 / 404 |
| DELETE | `/api/staff/{code}` | — | `ApiResponse<object>` | 204 / 400 / 404 |

### Module 3: Leave Applications

| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | `/api/leave-applications` | Query: `staffCode?`, `status?`, `category?`, `fromDate?`, `toDate?`, `pageNumber`, `pageSize` | `ApiResponse<PaginatedResult<LeaveApplicationListItemDto>>` | 200 |
| GET | `/api/leave-applications/{id}` | — | `ApiResponse<LeaveApplicationResponseDto>` | 200 / 404 |
| POST | `/api/leave-applications` | `LeaveApplicationRequestDto` | `ApiResponse<LeaveApplicationResponseDto>` | 201 |
| PUT | `/api/leave-applications/{id}` | `LeaveApplicationRequestDto` | `ApiResponse<LeaveApplicationResponseDto>` | 200 / 404 / 400 |
| PUT | `/api/leave-applications/{id}/submit` | — | `ApiResponse<LeaveApplicationResponseDto>` | 200 / 404 / 400 |
| PUT | `/api/leave-applications/{id}/approve` | — | `ApiResponse<LeaveApplicationResponseDto>` | 200 / 404 / 400 |
| PUT | `/api/leave-applications/{id}/reject` | — | `ApiResponse<LeaveApplicationResponseDto>` | 200 / 404 / 400 |
| DELETE | `/api/leave-applications/{id}` | — | `ApiResponse<object>` | 204 / 400 / 404 |

### Module 4: Students & Enrollments

#### Students

| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | `/api/students` | Query: `search?`, `status?`, `pageNumber`, `pageSize` | `ApiResponse<PaginatedResult<StudentListItemDto>>` | 200 |
| GET | `/api/students/{code}` | — | `ApiResponse<StudentResponseDto>` | 200 / 404 |
| POST | `/api/students` | `StudentRequestDto` | `ApiResponse<StudentResponseDto>` | 201 |
| PUT | `/api/students/{code}` | `StudentRequestDto` | `ApiResponse<StudentResponseDto>` | 200 / 404 |
| DELETE | `/api/students/{code}` | — | `ApiResponse<object>` | 204 / 400 / 404 |

#### Enrollments

| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | `/api/enrollments` | Query: `studentCode?`, `courseCode?`, `status?`, `pageNumber`, `pageSize` | `ApiResponse<PaginatedResult<EnrollmentListItemDto>>` | 200 |
| GET | `/api/enrollments/{id}` | — | `ApiResponse<EnrollmentResponseDto>` | 200 / 404 |
| POST | `/api/enrollments` | `EnrollmentRequestDto` | `ApiResponse<EnrollmentResponseDto>` | 201 |
| PUT | `/api/enrollments/{id}` | `EnrollmentRequestDto` | `ApiResponse<EnrollmentResponseDto>` | 200 / 404 |
| PUT | `/api/enrollments/{id}/cancel` | — | `ApiResponse<EnrollmentResponseDto>` | 200 / 404 / 400 |
| PUT | `/api/enrollments/{id}/complete` | — | `ApiResponse<EnrollmentResponseDto>` | 200 / 404 / 400 |
| PUT | `/api/enrollments/{id}/issue-certificate` | — | `ApiResponse<EnrollmentResponseDto>` | 200 / 404 / 400 |
| POST | `/api/enrollments/{id}/payment-logs` | `EnrollmentPaymentLogRequestDto` | `ApiResponse<EnrollmentPaymentLogResponseDto>` | 201 |
| POST | `/api/enrollments/{id}/communication-logs` | `EnrollmentCommunicationLogRequestDto` | `ApiResponse<EnrollmentCommunicationLogResponseDto>` | 201 |
| DELETE | `/api/enrollments/{id}` | — | `ApiResponse<object>` | 204 / 400 / 404 |

### Module 5: Walk-In Billing

| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | `/api/walkin-billings` | Query: `staffCode?`, `status?`, `fromDate?`, `toDate?`, `search?`, `pageNumber`, `pageSize` | `ApiResponse<PaginatedResult<WalkInBillingListItemDto>>` | 200 |
| GET | `/api/walkin-billings/{id}` | — | `ApiResponse<WalkInBillingResponseDto>` | 200 / 404 |
| POST | `/api/walkin-billings` | `WalkInBillingRequestDto` | `ApiResponse<WalkInBillingResponseDto>` | 201 |
| PUT | `/api/walkin-billings/{id}` | `WalkInBillingRequestDto` | `ApiResponse<WalkInBillingResponseDto>` | 200 / 404 / 400 |
| DELETE | `/api/walkin-billings/{id}` | — | `ApiResponse<object>` | 204 / 400 / 404 |
| PUT | `/api/walkin-billings/{id}/complete` | — | `ApiResponse<WalkInBillingResponseDto>` | 200 / 404 / 400 |
| PUT | `/api/walkin-billings/{id}/cancel` | — | `ApiResponse<WalkInBillingResponseDto>` | 200 / 404 / 400 |
| POST | `/api/walkin-billings/{id}/payment-logs` | `WalkInBillingPaymentLogRequestDto` | `ApiResponse<WalkInBillingPaymentLogResponseDto>` | 201 |
| POST | `/api/walkin-billings/{id}/billing-items` | `WalkInBillingItemRequestDto` | `ApiResponse<WalkInBillingItemResponseDto>` | 201 |
| DELETE | `/api/walkin-billings/{id}/billing-items/{itemId}` | — | `ApiResponse<object>` | 204 / 400 / 404 |

---

## BUSINESS RULES & VALIDATION

### Course API

- **CourseCategoryValidator:**
  - `Title` is required, max 200 chars
  - `Code` is required, unique per tenant, alphanumeric + hyphens, max 50 chars

- **CourseValidator:**
  - `Code` is required, unique per tenant
  - `Title` is required, max 200 chars
  - `Rate` must be > 0
  - `DurationHours` must be > 0
  - `Level` must be one of: Beginner, Intermediate, Advanced
  - `InstructorStaffId` if provided, must reference an Active Staff member
  - `CategoryCode` must reference an existing CourseCategory

- **Business Rules:**
  - Cannot soft-delete a Course if active Enrollments exist against it
  - Cannot set an inactive Staff member as InstructorStaffId
  - When listing Courses, include resolved InstructorStaffName and CategoryTitle

### Staff API

- **StaffValidator:**
  - `Code` is required, unique per tenant, alphanumeric + hyphens
  - `Name` is required, max 200 chars
  - `Email` is required, valid format, unique per tenant
  - `Mobile` if provided, must be valid phone format
  - `JoinDate` must not be in the future
  - `BasicAmount`, `GradeAmount`, `Allowances`, `Deductions` must be >= 0
  - When Status changes to Inactive, `TerminationDate` must be provided
  - Roles (if array) cannot be empty

- **Business Rules:**
  - `Balance` is system-managed, never accepts user input
  - `NetAmount` is computed on save: `BasicAmount + GradeAmount + Allowances - Deductions`
  - Cannot deactivate or soft-delete a Staff if they are the `InstructorStaffId` on any active Course
  - Cannot soft-delete if they have pending/draft Payroll records
  - Cannot soft-delete if they have pending Appointments

### Leave Management API

- **LeaveApplicationValidator:**
  - `StaffCode` must reference an active Staff member
  - `LeaveFromDate` must not be in the past
  - `LeaveToDate` must be >= `LeaveFromDate`
  - If `LeaveType` is HalfDay: `LeaveFromDate` must equal `LeaveToDate`
  - If `LeaveType` is MultipleDays: `LeaveToDate` must be > `LeaveFromDate`
  - `LeaveCategory` must be one of: Sick, Casual, Annual, Unpaid
  - `LeaveReason` is required, max 500 chars

- **Business Rules:**
  - New applications start with Status = Draft
  - Draft records can be edited or deleted
  - Submit action: Draft → Submitted
  - Approve action: Submitted → Approved (only managers/admins)
  - Reject action: Submitted → Rejected (only managers/admins)
  - Once Approved or Rejected, the record is locked (no further edits)
  - On Approval, the leave is queryable for payroll processing by StaffCode + date range
  - Cannot reject after already approving

### Student & Enrollment API

- **StudentValidator:**
  - `Code` is required, unique per tenant
  - `Name` is required, max 200 chars
  - `Email` is required, valid format, unique per tenant
  - **NO `NationalId` field — excluded by design**
  - `Mobile` if provided, must be valid format
  - `Status` must be one of: Active, Inactive

- **EnrollmentValidator:**
  - `StudentCode` must reference an existing active Student
  - `CourseCode` must reference an existing active Course
  - `StartDate` must not be in the past
  - `DurationDays` must be > 0
  - `Rate` must be > 0
  - `DiscountAmount` must be >= 0 and < Rate
  - Discount cannot exceed Rate

- **Enrollment Payment Logic:**
  - On creation: `PayableAmount = Rate - DiscountAmount`; `PaidAmount = 0`; `DueAmount = PayableAmount`
  - `PaidAmount` is computed as sum of all EnrollmentPaymentLog.PaidAmount values
  - `DueAmount = PayableAmount - PaidAmount` (auto-computed, cannot go below 0)
  - On each payment addition: recompute PaidAmount and DueAmount
  - Payment cannot exceed DueAmount

- **Enrollment Status Transitions:**
  - New enrollments start with Status = Active
  - Active → Completed: via `/complete` endpoint; requires all payments made (optional)
  - Active → Cancelled: via `/cancel` endpoint; sets CancelledAt timestamp
  - Cannot cancel if Status is already Completed
  - Certificate can only be issued when Status = Completed
  - Cannot delete an Enrollment if payments have been made

- **Business Rules:**
  - Cannot delete an Enrollment if Status ≠ Active or any payments exist
  - Enrollment can only be edited when Status = Active (only non-financial fields like Remarks)
  - Child collections (PaymentLogs, CommunicationLogs) are added via separate endpoints
  - When listing, include resolved StudentName and CourseName

### Walk-In Billing API

- **WalkInBillingValidator:**
  - `BillingDate` must not be in the future
  - `StaffCode` must reference an active Staff member
  - `ClientName` is required (for both identified and anonymous billing)
  - `ClientCode` is optional (nullable for anonymous clients)
  - `DiscountAmount` must be >= 0
  - Initial Status = Draft

- **WalkInBillingItem Validation:**
  - `ServiceCode` must reference an existing Service
  - `Rate` must be > 0
  - `AssignedStaffCode` if provided, must reference active Staff
  - `ServiceTitle` is snapshotted from Service.Title at creation time

- **Billing Amount Calculations:**
  - `TotalAmount = sum of all BillingItems.Rate`
  - `PayableAmount = TotalAmount - DiscountAmount`
  - `PaidAmount = sum of all PaymentLogs.PaidAmount`
  - `DueAmount = PayableAmount - PaidAmount` (auto-computed on every change)
  - Recompute all amounts whenever items are added/removed or payments added

- **Business Rules:**
  - Cannot complete a bill with zero billing items
  - Cannot add payment logs to a Cancelled bill
  - Cannot add items to a Completed or Cancelled bill
  - Can only delete items when Status = Draft
  - Status transitions: Draft → Completed or Cancelled (one-way, locked after)
  - Cannot edit a bill once Status = Completed or Cancelled
  - Payment cannot exceed DueAmount

---

## STANDARD RESPONSE WRAPPER

All API responses must follow this wrapper structure:

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public Dictionary<string, string[]> Errors { get; set; }  // For validation errors
    public int? StatusCode { get; set; }
}
```

### Response Examples

**Success:**
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": { ... },
  "statusCode": 200
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Rate": ["Rate must be greater than 0"],
    "Title": ["Title is required"]
  },
  "statusCode": 400
}
```

**Not Found:**
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

---

## DEPENDENCY INJECTION & CONFIGURATION

### Program.cs Configuration

```csharp
// 1. Add DbContext
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

// 2. Add AutoMapper
services.AddAutoMapper(typeof(MappingProfile));

// 3. Add FluentValidation
services.AddValidatorsFromAssemblyContaining<CourseCategoryValidator>();

// 4. Add Repositories (generic pattern)
services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
services.AddScoped<ICourseCategoryRepository, CourseCategoryRepository>();
services.AddScoped<ICourseRepository, CourseRepository>();
// ... add all others

// 5. Add Services
services.AddScoped<ICourseCategoryService, CourseCategoryService>();
services.AddScoped<ICourseService, CourseService>();
// ... add all others

// 6. Add MediatR (if using CQRS)
services.AddMediatR(typeof(Program));

// 7. Add CORS (for frontend)
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
        builder.WithOrigins("http://localhost:3000", "http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials());
});

// 8. Add Authentication (JWT)
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { ... });

// 9. Add Swagger/OpenAPI
services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Saloon Management API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { ... });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { ... });
});

// 10. Use middleware
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<TenantMiddleware>();
app.UseMiddleware<LoggingMiddleware>();

// 11. Use authentication
app.UseAuthentication();
app.UseAuthorization();

// 12. Map endpoints
app.MapControllers();
```

---

## KEY IMPLEMENTATION PATTERNS

### 1. Base Repository Pattern (Soft-Delete Aware)

```csharp
public abstract class BaseRepository<T> where T : _AuditEntity
{
    protected readonly ApplicationDbContext _context;

    public BaseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public virtual IQueryable<T> GetQuery(string tenantId)
    {
        return _context.Set<T>()
            .Where(x => x.TenantOutletId == tenantId && !x.IsDeleted);
    }

    public virtual async Task<T> GetByIdAsync(int id, string tenantId)
    {
        return await GetQuery(tenantId).FirstOrDefaultAsync(x => x.Id == id);
    }

    public virtual async Task<List<T>> GetAllAsync(string tenantId)
    {
        return await GetQuery(tenantId).ToListAsync();
    }

    public virtual async Task AddAsync(T entity)
    {
        _context.Set<T>().Add(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async Task UpdateAsync(T entity)
    {
        _context.Set<T>().Update(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async Task SoftDeleteAsync(T entity, string deletedByUserName, string reason)
    {
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedByUserName = deletedByUserName;
        entity.DeletedReason = reason;
        await UpdateAsync(entity);
    }
}
```

### 2. Base Service Pattern (Tenant-Scoped)

```csharp
public abstract class BaseService
{
    protected readonly IMapper _mapper;
    protected string TenantId { get; set; }
    protected string CurrentUser { get; set; }

    public BaseService(IMapper mapper)
    {
        _mapper = mapper;
    }

    public virtual void SetTenantContext(string tenantId, string currentUser)
    {
        TenantId = tenantId;
        CurrentUser = currentUser;
    }
}
```

### 3. Base Controller Pattern (Tenant Extraction)

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public abstract class BaseController : ControllerBase
{
    protected string GetTenantId() => Request.Headers["tenantOutletId"].ToString();
    protected string GetCurrentUser() => User.FindFirst("sub")?.Value ?? "system";

    protected IActionResult ResponseOk<T>(T data, string message = "Success")
    {
        return Ok(new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = StatusCodes.Status200OK
        });
    }

    protected IActionResult ResponseCreated<T>(T data, string message = "Created")
    {
        return StatusCode(StatusCodes.Status201Created, new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = StatusCodes.Status201Created
        });
    }

    protected IActionResult ResponseNotFound(string message = "Resource not found")
    {
        return NotFound(new ApiResponse<object>
        {
            Success = false,
            Message = message,
            StatusCode = StatusCodes.Status404NotFound
        });
    }

    protected IActionResult ResponseBadRequest(string message, Dictionary<string, string[]> errors = null)
    {
        return BadRequest(new ApiResponse<object>
        {
            Success = false,
            Message = message,
            Errors = errors,
            StatusCode = StatusCodes.Status400BadRequest
        });
    }
}
```

### 4. Pagination Helper

```csharp
public class PaginatedResult<T>
{
    public List<T> Items { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (TotalCount + PageSize - 1) / PageSize;

    public static async Task<PaginatedResult<T>> CreateAsync(
        IQueryable<T> query,
        int pageNumber,
        int pageSize)
    {
        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<T>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }
}
```

### 5. Middleware: Tenant Context Extraction

```csharp
public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var tenantId = context.Request.Headers["tenantOutletId"].ToString();
        if (string.IsNullOrEmpty(tenantId))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new ApiResponse<object>
            {
                Success = false,
                Message = "Missing tenantOutletId header"
            });
            return;
        }

        context.Items["TenantId"] = tenantId;
        await _next(context);
    }
}
```

### 6. Middleware: Global Error Handling

```csharp
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Unhandled exception: {ex.Message}");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new ApiResponse<object>
            {
                Success = false,
                Message = "An internal server error occurred"
            });
        }
    }
}
```

---

## NOTES FOR IMPLEMENTATION

1. **Enums as Strings**: All enum fields (Status, PaymentMethod, LeaveCategory, etc.) must be stored and mapped as strings, not ints. Use string comparison in queries.

2. **Soft-Delete Pattern**: Every list/get query must filter out deleted records (`!x.IsDeleted`). Create a helper in DbContext to auto-apply this filter.

3. **Tenant Scoping**: Every query must filter by TenantId. Make this a standard part of BaseRepository.

4. **Computed Fields**: Fields like `PayableAmount`, `DueAmount`, `TotalAmount`, `NetAmount` are computed on read (selected in DTOs) or on every write (via stored procedures or C#).

5. **Child Collections**: Payment logs and communication logs are added via separate POST endpoints, not in the main CRUD endpoint.

6. **Unique Codes**: All `Code` fields must be unique per tenant (composite unique index: Code + TenantId).

7. **Authorization**: All endpoints must require `[Authorize]` attribute. Role-based authorization for approve/reject operations.

8. **Validation**: Use FluentValidation for all DTOs. Attach validator middleware or use ActionFilter.

9. **Logging**: Log all CRUD operations with user, tenant, and timestamp.

10. **Testing**: Write unit tests for all services using xUnit + Moq. Test soft-delete, pagination, search, and business rule enforcement.

---

## DELIVERABLES CHECKLIST

- [ ] Models (all 12 entities with relationships)
- [ ] DbContext with DbSets and Fluent configurations
- [ ] DTOs for all entities (request, response, list, dropdown variants)
- [ ] FluentValidation validators for all DTOs
- [ ] AutoMapper profiles for entity ↔ DTO mapping
- [ ] Base repository with tenant/soft-delete logic
- [ ] Specific repositories for each entity
- [ ] Base service with tenant context
- [ ] Specific services for each module (CRUD + business logic)
- [ ] Base controller with response helpers
- [ ] Controllers for all 7 endpoints groups (CourseCategories, Courses, Staff, LeaveApplications, Students, Enrollments, WalkInBillings)
- [ ] Pagination helper
- [ ] Middleware (TenantMiddleware, ErrorHandlingMiddleware, LoggingMiddleware)
- [ ] Program.cs DI configuration
- [ ] Swagger/OpenAPI setup with XML comments
- [ ] Database migrations
- [ ] Unit tests (sample coverage)

---

## FRONTEND INTEGRATION NOTES

The React frontend expects:

1. **Bearer Token Authentication**: All endpoints require `Authorization: Bearer <token>` header
2. **Tenant Headers**: All endpoints require `tenantOutletId` header
3. **Response Format**: Wrapped in `ApiResponse<T>` with `success`, `message`, `data` fields
4. **Error Responses**: Include `errors` dictionary for validation failures
5. **Pagination**: Expects `PaginatedResult` with `items`, `totalCount`, `pageNumber`, `pageSize`
6. **CORS**: API must allow requests from frontend domain (http://localhost:5173 for dev)

---

## REFERENCES

- Database Schema: `saloon_tenant_db_context.md` (provided)
- Frontend Structure: React project using Formik validation, React Router, Axios
- Authentication: JWT Bearer tokens
- ORM: EF Core with Migrations

---

**End of Implementation Prompt**
