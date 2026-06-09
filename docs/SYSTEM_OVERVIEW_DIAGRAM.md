# Saloon Management System — Visual Overview

## System Architecture Diagram

```mermaid
graph TB
    Auth["🔐 Authentication & Authorization<br/>Login | Role-based Access<br/>OrgAdmin | InternalStaff | Finance | SuperAdmin"]
    
    Dashboard["📊 Dashboard<br/>Today's Stats | Revenue<br/>Appointments | Enrollments"]
    
    subgraph Core["CORE BUSINESS MODULES"]
        CM["👥 Customer Management<br/>Add/Edit/View Customers<br/>Track Customer Types<br/>Receivable Balance"]
        
        SM["👔 Staff Management<br/>Add/Edit Staff<br/>Assign Roles<br/>Track Appointments"]
        
        AM["📅 Appointment Management<br/>Create Bookings<br/>Assign Services<br/>Manage Timeline"]
    end
    
    subgraph Services["SERVICES & PRODUCTS"]
        SC["🛍️ Service Catalogue<br/>Services | Products<br/>Categories | Pricing<br/>Inventory Management"]
    end
    
    subgraph Billing["💳 CHECKOUT & BILLING"]
        CO["💰 Checkout<br/>Service Line Items<br/>Additional Charges<br/>Payment Collection"]
        
        SR["📝 Sales Records<br/>Track Revenue<br/>Payment Methods<br/>Customer Payments"]
    end
    
    subgraph Financial["💼 FINANCIAL RECORDS"]
        SP["🏪 Supplier Management<br/>Supplier CRUD<br/>Purchase Tracking<br/>Pending Payments"]
        
        CR["💳 Customer Receivables<br/>Outstanding Balance<br/>Payment Collection<br/>Refund Management"]
        
        EX["📋 Expense Tracking<br/>Record Expenses<br/>Expense Types<br/>Financial Summary"]
    end
    
    subgraph Education["🎓 EDUCATION MODULES"]
        CM2["📚 Course Management<br/>Create Courses<br/>Set Fees<br/>Track Instructors"]
        
        SM2["👨‍🎓 Student Management<br/>Enroll Students<br/>Track Fees<br/>Payment Status"]
    end
    
    Analytics["📈 Analytics & Reporting<br/>Sales Reports | Payment Statement<br/>Supplier Payments | Credit Summary<br/>Customer Receivable | Period Filters<br/>Export: CSV | PDF"]
    
    Auth --> Dashboard
    Auth --> Core
    Auth --> Services
    Auth --> Billing
    Auth --> Financial
    Auth --> Education
    Auth --> Analytics
    
    Dashboard -.->|Quick Access| AM
    Dashboard -.->|View Stats| Financial
    Dashboard -.->|Monitor| Education
    
    Core --> Services
    Core --> Billing
    
    AM -->|Services Selected| CO
    AM -->|Appointment Complete| CO
    
    CO -->|Finalize Payment| SR
    SR -->|Track Revenue| Analytics
    
    SM -->|Staff Assigned| AM
    CM -->|Customer Selected| AM
    CM -->|Payment Record| CR
    
    SP -->|Purchase Items| SR
    SP -.->|Pending Payments| Financial
    
    EX -->|Track Costs| Analytics
    CR -->|Outstanding Balance| Analytics
    
    CM2 -->|Enroll Students| SM2
    SM2 -->|Record Fees| Education
    SM2 -.->|Fee Collection| CR
    
    Financial -->|Financial Data| Analytics
    
    style Auth fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style Dashboard fill:#4ecdc4,stroke:#1a9b8e,color:#fff
    style Core fill:#45b7d1,stroke:#0d7377,color:#fff
    style Services fill:#96ceb4,stroke:#558b6f,color:#fff
    style Billing fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style Financial fill:#dfe6e9,stroke:#636e72,color:#333
    style Education fill:#a29bfe,stroke:#6c5ce7,color:#fff
    style Analytics fill:#fd79a8,stroke:#e84393,color:#fff
```

---

## Feature Breakdown by Module

### 🔐 **Authentication & Authorization**
- **Login:** Email + Password authentication with JWT
- **Role-based Access Control:** 4 roles with specific permissions
  - **OrgAdmin:** Full access to business operations
  - **InternalStaff:** Limited to appointments & customer interaction
  - **Finance:** Financial records & reporting
  - **SuperAdmin:** System-wide access
- **Session Management:** JWT token (8-hour expiry) + Org Code isolation

---

### 📊 **Dashboard**
- **Real-time KPIs:**
  - Today's total sales (NPR)
  - Appointments today (clients vs students)
  - Completed appointments + rate
  - Active course enrollments
  - Total revenue (period selector)
  - Top services & inventory status

- **Visualizations:**
  - Weekly appointment volume (bar chart)
  - Upcoming appointments timeline
  - Appointment status distribution (donut chart)

- **Role-based Views:**
  - OrgAdmin/Finance: Full financial view
  - InternalStaff: Operational data only (no revenue)

---

### 👥 **Customer Management**
- **CRUD Operations:**
  - Create customer with optional quick-add from booking
  - View customer profile & history
  - Edit customer details (name, contact, type, etc.)
  - Soft-delete customers

- **Customer Attributes:**
  - Basic info (name, phone, email, address)
  - National ID (unique)
  - Skin type (salon-specific)
  - Customer type classification

- **Customer Dashboard:**
  - Appointment history
  - Outstanding receivable balance
  - Total spent

---

### 👔 **Staff Management**
- **Staff CRUD:**
  - Create staff with auto-generated login credentials
  - Assign roles (OrgAdmin, InternalStaff, Finance)
  - Set salary & department
  - Edit profile information
  - Deactivate staff (soft-delete)

- **Staff Visibility:**
  - Active staff available for appointment assignment
  - Historical records preserved for appointment tracking

---

### 🛍️ **Service & Product Catalogue**
- **Service Management:**
  - Create/Edit/Delete services
  - Set pricing & duration
  - Categorize services
  - Toggle status (Active/Inactive)
  - Price changes don't affect past appointments

- **Product Management:**
  - Track inventory & stock quantities
  - Manage product pricing
  - Link to suppliers for purchases

- **Category Management:**
  - Parent & child category hierarchy
  - Category constraints (can't delete if items linked)

---

### 📅 **Appointment Management**
- **Appointment Lifecycle:**
  - **Create:** Select customer, date, staff, services
  - **Booked Status:** Available for editing
  - **Completed:** Triggers checkout flow
  - **Cancelled:** Non-reversible state

- **Multi-Service Support:**
  - Multiple services per appointment
  - Service-specific pricing & duration
  - Combined total calculation

- **Timeline View:**
  - Upcoming appointments
  - Staff assignment visibility
  - Status tracking

---

### 💳 **Checkout & Billing**
- **Service Line Items:**
  - Review & modify service pricing at checkout
  - Add/remove services before completion
  - Custom service pricing override

- **Additional Billing:**
  - Add non-service charges (products, extras)
  - Describe items or select from catalogue
  - Per-item quantity & pricing

- **Payment Collection:**
  - Multiple payment methods (Cash, Card, Bank Transfer, QR)
  - Partial payment support
  - Zero-payment completion (full credit)
  - Outstanding balance tracking

- **Financial Impact:**
  - Creates SaleRecord
  - Generates PaymentTransaction
  - Creates/updates CustomerReceivable if unpaid

---

### 🏪 **Supplier Management**
- **Supplier CRUD:**
  - Create supplier with contact details
  - Edit supplier information
  - Track supplier history

- **Purchase Orders:**
  - Select supplier & set purchase date
  - Add line items (product + quantity + unit price)
  - Partial payment support
  - Auto-create pending payment if not fully paid

- **Stock Management:**
  - Automatically update product stock on purchase
  - Track stock levels

---

### 💼 **Financial Records**
- **Supplier Payments:**
  - Track supplier payment history
  - Manage pending payment records
  - Payment method logging
  - Receive payment from purchases

- **Customer Receivables:**
  - Outstanding balance by customer
  - Payment collection with multi-method support
  - Refund issuance
  - Status tracking (Outstanding/Partially Paid/Settled)

- **Expense Tracking:**
  - Create expense types
  - Record daily expenses
  - Payment method logging
  - Remarks for context

- **Credit Summary:**
  - Aggregated customer credit view
  - Total credited vs collected
  - Current balance per customer

---

### 📚 **Course Management**
- **Course CRUD:**
  - Create courses with name, description, duration
  - Set course fee/rate
  - Assign instructor (staff member or external)
  - Toggle status (Active/Inactive)

- **Enrollment Management:**
  - View enrolled students per course
  - Track student payment status
  - Fee changes don't affect existing enrollments

- **Dashboard Integration:**
  - Active enrollment count
  - Pending course fees monitoring

---

### 👨‍🎓 **Student Management**
- **Student CRUD:**
  - Register students with contact details
  - Enroll in courses
  - Track personal information
  - Edit student profile

- **Enrollment & Fee Tracking:**
  - Multiple course enrollments per student
  - Fee recording by enrollment
  - Status tracking (Pending/Completed)
  - Partial payment support

- **Payment Collection:**
  - Record fee payments
  - Track remaining balance
  - Auto-mark as completed when fully paid
  - Creates CustomerReceivable for outstanding

---

### 📈 **Analytics & Reporting**
- **Dashboard Reports:**
  - **Sales Report:** Revenue by date, service, customer, payment method
  - **Payment Statement:** All transactions with reference tracking
  - **Supplier Payment Report:** Supplier payments & due dates
  - **Supplier Pending Payments:** Outstanding supplier balances
  - **Credit Summary:** Customer credit overview
  - **Customer Receivable:** Outstanding customer balances

- **Filtering & Export:**
  - Date range selector (Week/Month/Custom)
  - Multi-criteria filtering
  - Export to CSV & PDF
  - Role-based access (Finance role only for sensitive reports)

- **Visualizations:**
  - Revenue vs Expenses over time
  - Top services by volume
  - Payment method distribution
  - Customer credit trends

---

## Key Data Flows

### 1️⃣ **Appointment to Revenue**
```
Create Appointment → Assign Services → Complete Appointment 
→ Checkout & Collect Payment → Create SaleRecord & PaymentTransaction
```

### 2️⃣ **Unpaid Appointment to Receivable**
```
Complete Appointment → Zero/Partial Payment 
→ Create CustomerReceivable → Collection/Refund Workflow
```

### 3️⃣ **Course Enrollment to Fee Collection**
```
Enroll Student → Set Course Fee → Record Fee Payment 
→ Update Receivable if Incomplete
```

### 4️⃣ **Purchase to Supplier Payment**
```
Create Purchase → Add Line Items → Partial/Full Payment 
→ Create/Update SupplierPendingPayment Record
```

### 5️⃣ **Financial Data to Analytics**
```
SaleRecord + PaymentTransaction + CustomerReceivable + Expense 
→ Aggregation & Filtering → Analytics Dashboard
```

---

## System Access Patterns

```mermaid
graph LR
    User["User Logs In"]
    
    User -->|OrgAdmin| OA["Full Access<br/>All Modules<br/>All Reports<br/>Settings"]
    User -->|InternalStaff| IS["Limited Access<br/>Appointments<br/>Customers<br/>Services<br/>No Finance"]
    User -->|Finance| FIN["Finance Focus<br/>Receivables<br/>Payments<br/>Expenses<br/>Reports"]
    User -->|SuperAdmin| SA["System Access<br/>Tenant Config<br/>Multi-org View<br/>Audit Logs"]
    
    style OA fill:#45b7d1,stroke:#0d7377,color:#fff
    style IS fill:#96ceb4,stroke:#558b6f,color:#fff
    style FIN fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style SA fill:#ff6b6b,stroke:#c92a2a,color:#fff
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, Next.js (Next.js migration in progress) |
| **Backend** | .NET 8 (ASP.NET Core) |
| **Database** | Multi-tenant database (Master DB + Tenant DBs) |
| **Authentication** | JWT + Role-based Authorization |
| **API** | RESTful API with standardized response envelope |

---

## Tenant Isolation

```mermaid
graph TB
    Frontend["React Frontend"]
    
    API["API Server<br/>TenantResolutionMiddleware"]
    
    MasterDB["Master Database<br/>AspNetUsers<br/>Organizations<br/>TenantInfo"]
    
    Tenant1["Tenant 1 DB<br/>Saloon A Data"]
    Tenant2["Tenant 2 DB<br/>Saloon B Data"]
    TenantN["Tenant N DB<br/>Saloon N Data"]
    
    Frontend -->|JWT + X-Org-Code| API
    API -->|Lookup| MasterDB
    API -->|Route| Tenant1
    API -->|Route| Tenant2
    API -->|Route| TenantN
    
    style MasterDB fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style Tenant1 fill:#4ecdc4,stroke:#1a9b8e,color:#fff
    style Tenant2 fill:#4ecdc4,stroke:#1a9b8e,color:#fff
    style TenantN fill:#4ecdc4,stroke:#1a9b8e,color:#fff
```

---

---

## Activity Diagrams

### 📅 Appointment Booking & Completion Activity Flow

```mermaid
graph TD
    A["👤 Staff Initiates<br/>New Booking"] --> B["🔍 Search/Add Customer"]
    B --> C{"Customer<br/>Exists?"}
    C -->|No| D["➕ Create New Customer"]
    C -->|Yes| E["📅 Select Date & Time"]
    D --> E
    E --> F["👔 Assign Staff Member"]
    F --> G["🛍️ Add Services<br/>Multi-select"]
    G --> H["💭 Add Remarks<br/>Optional"]
    H --> I["📝 Review & Confirm"]
    I --> J["POST Create Appointment<br/>Status: Booked"]
    J --> K["⏰ Appointment Scheduled"]
    K --> L["🕐 On Appointment Date"]
    L --> M["🔴 Mark Complete<br/>Open Checkout Modal"]
    M --> N["🔍 Review Service Lines"]
    N --> O["➕ Add Extra Items<br/>Optional"]
    O --> P["💰 Collect Payment"]
    P --> Q{"Payment<br/>Complete?"}
    Q -->|Full Payment| R["✅ Settled"]
    Q -->|Partial| S["⏳ Outstanding Created"]
    Q -->|Zero| T["📋 Full Credit Record"]
    R --> U["📊 Update Dashboard"]
    S --> U
    T --> U
    U --> V["✔️ Appointment Completed"]
    
    style A fill:#4ecdc4,stroke:#0d7377,color:#fff
    style K fill:#96ceb4,stroke:#558b6f,color:#fff
    style M fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style V fill:#a29bfe,stroke:#6c5ce7,color:#fff
```

---

### 📚 Course Enrollment & Fee Collection Activity Flow

```mermaid
graph TD
    A["👨‍🏫 Admin Creates Course"] --> B["📖 Set Course Details<br/>Name, Fee, Duration"]
    B --> C["✅ Course Published<br/>Status: Active"]
    C --> D["👨‍🎓 Student Registration"]
    D --> E["📝 Enter Student Info"]
    E --> F["🎓 Select Course to Enroll"]
    F --> G["💰 Set Fee for Enrollment"]
    G --> H["POST Create Enrollment<br/>Status: Pending"]
    H --> I["⏳ Fee Payment Pending"]
    I --> J["💳 Record Fee Payment"]
    J --> K{"Payment<br/>Complete?"}
    K -->|Full Amount| L["✅ Enrollment Completed"]
    K -->|Partial| M["⏳ Balance Outstanding"]
    L --> N["📊 Add to Dashboard<br/>Active Enrollments"]
    M --> N
    N --> O["📈 Track in Reports"]
    
    style A fill:#4ecdc4,stroke:#0d7377,color:#fff
    style C fill:#96ceb4,stroke:#558b6f,color:#fff
    style H fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style L fill:#a29bfe,stroke:#6c5ce7,color:#fff
```

---

### 🏪 Purchase & Supplier Payment Activity Flow

```mermaid
graph TD
    A["📦 Create Purchase Order"] --> B["🏢 Select Supplier"]
    B --> C["📅 Set Purchase Date"]
    C --> D["➕ Add Line Items"]
    D --> E["🛒 Select Product/Quantity"]
    E --> F{"More<br/>Items?"}
    F -->|Yes| E
    F -->|No| G["💵 Calculate Total Amount"]
    G --> H["💳 Record Payment"]
    H --> I{"Payment<br/>Complete?"}
    I -->|Full| J["✅ Purchase Closed"]
    I -->|Partial| K["⏳ Create Pending Payment"]
    J --> L["📦 Update Stock Levels"]
    K --> L
    L --> M["📊 Available in Reports"]
    
    style A fill:#4ecdc4,stroke:#0d7377,color:#fff
    style D fill:#96ceb4,stroke:#558b6f,color:#fff
    style H fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style J fill:#a29bfe,stroke:#6c5ce7,color:#fff
```

---

## Flow Diagrams (Decision Trees)

### 🔐 Authentication & Authorization Flow

```mermaid
graph TD
    A["🌐 User Visits App"] --> B{"JWT Valid<br/>in Storage?"}
    B -->|Yes| C["✅ Auto-Redirect<br/>to Dashboard"]
    B -->|No| D["🔐 Login Page"]
    D --> E["📧 Enter Email<br/>🔒 Enter Password"]
    E --> F["POST /api/auth/login"]
    F --> G{"Credentials<br/>Valid?"}
    G -->|No| H["❌ Show Error<br/>Invalid credentials"]
    H --> D
    G -->|Yes| I["💾 Store JWT<br/>+ Role + OrgCode"]
    I --> J["Decode JWT<br/>Get Staff ID"]
    J --> K["🔄 Redirect to Dashboard"]
    K --> L["🎯 Dashboard Loads"]
    L --> M{"Check User<br/>Role"}
    M -->|OrgAdmin| N["📊 Full Dashboard<br/>All Metrics"]
    M -->|InternalStaff| O["📋 Limited Dashboard<br/>No Finance"]
    M -->|Finance| P["💼 Finance Dashboard<br/>Reports & Receivables"]
    
    style A fill:#4ecdc4,stroke:#0d7377,color:#fff
    style D fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style I fill:#96ceb4,stroke:#558b6f,color:#fff
    style N fill:#a29bfe,stroke:#6c5ce7,color:#fff
```

---

### 💳 Payment Decision Flow

```mermaid
graph TD
    A["💰 Checkout Initiated"] --> B["💵 Calculate Total Amount"]
    B --> C["🧮 Input Payment Amount"]
    C --> D{"Amount<br/>Valid?"}
    D -->|>Total| E["❌ Validation Error<br/>Cannot exceed total"]
    E --> C
    D -->|≤Total| F{"Amount =<br/>Total?"}
    F -->|Yes| G["✅ Full Payment<br/>Create SaleRecord"]
    F -->|No| H{"Amount<br/>> 0?"}
    H -->|Yes| I["⏳ Partial Payment<br/>Create CustomerReceivable<br/>Status: PartiallyPaid"]
    H -->|No| J["📋 Zero Payment<br/>Create CustomerReceivable<br/>Status: Outstanding"]
    G --> K["🏁 Appointment Completed"]
    I --> K
    J --> K
    K --> L["📊 Update Dashboard"]
    
    style A fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style G fill:#96ceb4,stroke:#558b6f,color:#fff
    style I fill:#fd79a8,stroke:#e84393,color:#fff
    style J fill:#fd79a8,stroke:#e84393,color:#fff
    style K fill:#a29bfe,stroke:#6c5ce7,color:#fff
```

---

### 📊 Report Access Decision Flow

```mermaid
graph TD
    A["👤 User Requests Report"] --> B{"User<br/>Role?"}
    B -->|OrgAdmin| C["✅ All Reports Available"]
    B -->|Finance| D["✅ Financial Reports<br/>Sales, Receivables,<br/>Supplier Payments"]
    B -->|InternalStaff| E["❌ Access Denied<br/>Insufficient Permissions"]
    B -->|SuperAdmin| F["✅ All Reports +<br/>Audit & System Logs"]
    C --> G["📈 Load Report"]
    D --> G
    F --> G
    E --> H["⚠️ Show Error Message"]
    G --> I["🔍 Apply Filters<br/>Date Range, Criteria"]
    I --> J["📊 Render Data<br/>Table + Charts"]
    J --> K["💾 Export to CSV/PDF<br/>Optional"]
    
    style C fill:#96ceb4,stroke:#558b6f,color:#fff
    style D fill:#96ceb4,stroke:#558b6f,color:#fff
    style E fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style G fill:#ffeaa7,stroke:#fdcb6e,color:#333
```

---

## System Component Diagram

```mermaid
graph TB
    subgraph Frontend["FRONTEND LAYER (React/Next.js)"]
        Pages["📄 Pages<br/>Dashboard | Customers<br/>Staff | Appointments<br/>Courses | Analytics"]
        
        Components["🧩 Components<br/>Modal | Forms<br/>Table | Timeline<br/>Charts"]
        
        Services["🔌 Services<br/>authService | apiClient<br/>customerService<br/>appointmentService"]
        
        Hooks["🪝 Hooks<br/>useProfile | useState<br/>useEffect"]
    end
    
    subgraph API["API LAYER (RESTful + Interceptors)"]
        Auth["🔐 Auth Middleware<br/>JWT Validation<br/>Role Check"]
        
        TenantMiddleware["🏢 Tenant Resolution<br/>X-Org-Code Lookup<br/>DB Context Injection"]
        
        ErrorHandler["⚠️ Error Handler<br/>401 Redirect<br/>Error Response"]
    end
    
    subgraph Backend["BACKEND LAYER (.NET 8)"]
        Controllers["📡 Controllers<br/>CustomerController<br/>AppointmentController<br/>ReportController"]
        
        Services2["⚙️ Services/Business Logic<br/>AppointmentService<br/>CheckoutService<br/>ReportService"]
        
        Repositories["💾 Repositories<br/>CustomerRepo<br/>AppointmentRepo<br/>FinancialRepo"]
    end
    
    subgraph Database["DATABASE LAYER"]
        Master["🔑 Master Database<br/>Users | Organizations<br/>Tenants | Config"]
        
        Tenant["🗄️ Tenant Databases<br/>Customers | Staff<br/>Appointments | Courses<br/>Financial Records"]
    end
    
    Pages --> Components
    Pages --> Services
    Components --> Services
    Services --> Auth
    Services --> TenantMiddleware
    
    Auth --> Controllers
    TenantMiddleware --> Controllers
    
    Controllers --> Services2
    Services2 --> Repositories
    
    Repositories --> Master
    Repositories --> Tenant
    
    Controllers --> ErrorHandler
    ErrorHandler -.->|401| Services
    
    style Frontend fill:#4ecdc4,stroke:#0d7377,color:#fff
    style API fill:#45b7d1,stroke:#0d7377,color:#fff
    style Backend fill:#96ceb4,stroke:#558b6f,color:#fff
    style Database fill:#ff6b6b,stroke:#c92a2a,color:#fff
```

---

## Sequence Diagram - Complete Appointment Workflow

```mermaid
sequenceDiagram
    actor Staff as 👨‍💼 Staff
    participant Frontend as 🖥️ Frontend
    participant API as 🔌 API Server
    participant DB as 💾 Database
    
    Staff->>Frontend: Click "New Booking"
    Frontend->>API: GET /api/customers?search=
    API->>DB: Query Customers
    DB-->>API: Customer List
    API-->>Frontend: Render Options
    
    Staff->>Frontend: Select Customer
    Frontend->>API: GET /api/services?status=Active
    API->>DB: Query Services
    DB-->>API: Active Services
    API-->>Frontend: Render Services
    
    Staff->>Frontend: Add Multiple Services
    Frontend->>API: GET /api/staff?status=Active
    API->>DB: Query Staff
    DB-->>API: Active Staff
    API-->>Frontend: Render Staff Options
    
    Staff->>Frontend: Select Staff & Date
    Frontend->>API: POST /api/appointments
    API->>DB: Create Appointment (Booked)
    DB-->>API: Appointment Created
    API-->>Frontend: Success Response
    Frontend->>Staff: Show Confirmation
    
    Staff->>Frontend: Navigate to Appointment
    Frontend->>API: GET /api/appointments/{id}
    API->>DB: Fetch Appointment
    DB-->>API: Appointment Details
    API-->>Frontend: Display Details
    
    Staff->>Frontend: Click "Complete"
    Frontend->>Staff: Open Checkout Modal
    
    Staff->>Frontend: Review Services & Add Items
    Frontend->>Frontend: Calculate Total
    
    Staff->>Frontend: Enter Payment Details
    Frontend->>Frontend: Validate Payment ≤ Total
    
    Staff->>Frontend: Click "Finalize"
    Frontend->>API: POST /api/appointments/{id}/complete
    API->>DB: Create SaleRecord
    API->>DB: Create PaymentTransaction
    
    alt Full Payment
        API->>DB: paymentStatus = Paid
    else Partial Payment
        API->>DB: Create CustomerReceivable (PartiallyPaid)
    else Zero Payment
        API->>DB: Create CustomerReceivable (Outstanding)
    end
    
    DB-->>API: Updated Records
    API-->>Frontend: Success Response
    Frontend->>Staff: Show Completion Message
    Frontend->>API: GET /api/dashboard/today-stats
    API->>DB: Query Updated Stats
    DB-->>API: Dashboard Data
    API-->>Frontend: Update KPIs
```

---

## Data Flow Diagram - Revenue Generation Pipeline

```mermaid
graph LR
    A["📅 Appointment<br/>Created"] -->|Booked Status| B["⏰ Scheduled"]
    B -->|On Date| C["🎯 Complete<br/>Appointment"]
    C -->|Open Checkout| D["🛍️ Service Lines<br/>+ Additional Items"]
    D -->|Calculate| E["💰 Total Amount"]
    E -->|Collect Payment| F["💳 Payment"]
    
    F -->|Full Payment| G["💵 SaleRecord<br/>Full Amount"]
    F -->|Partial| H["💵 SaleRecord<br/>Partial Amount"]
    F -->|Zero| I["💵 SaleRecord<br/>Zero Amount"]
    
    G -->|paymentStatus| J["✅ Paid"]
    H -->|paymentStatus| K["⏳ Unpaid"]
    I -->|paymentStatus| L["⏳ Unpaid"]
    
    K -->|Create| M["📋 CustomerReceivable<br/>Partial Balance"]
    L -->|Create| N["📋 CustomerReceivable<br/>Full Balance"]
    
    G -->|Aggregate| O["📊 Dashboard<br/>Today's Sales"]
    M -->|Aggregate| O
    N -->|Aggregate| O
    
    J -->|Include| P["📈 Sales Report"]
    K -->|Include| P
    L -->|Include| P
    
    M -->|Track| Q["💳 Receivables<br/>Report"]
    N -->|Track| Q
    
    style A fill:#4ecdc4,stroke:#0d7377,color:#fff
    style C fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style G fill:#96ceb4,stroke:#558b6f,color:#fff
    style O fill:#fd79a8,stroke:#e84393,color:#fff
    style P fill:#a29bfe,stroke:#6c5ce7,color:#fff
```

---

## Data Model Relationship Diagram

```mermaid
graph TB
    Customer["👥 Customer<br/>ID | Name | Phone<br/>Email | Type"]
    
    Appointment["📅 Appointment<br/>ID | CustomerID<br/>Date | Status<br/>PaymentStatus"]
    
    Service["🛍️ Service<br/>ID | Name | Price<br/>Duration | Status"]
    
    AppointmentService["🔗 AppointmentService<br/>AppointmentID<br/>ServiceID | Price"]
    
    Staff["👔 Staff<br/>ID | Name | Role<br/>Status | Salary"]
    
    SaleRecord["💰 SaleRecord<br/>ID | AppointmentID<br/>Amount | Date"]
    
    Payment["💳 PaymentTransaction<br/>ID | SaleID<br/>Amount | Method<br/>Date"]
    
    Receivable["📋 CustomerReceivable<br/>ID | CustomerID<br/>AppointmentID<br/>Amount | Balance"]
    
    Course["📚 Course<br/>ID | Name | Fee<br/>Duration | Status"]
    
    Student["👨‍🎓 Student<br/>ID | Name | Phone<br/>Email | Address"]
    
    Enrollment["🎓 StudentEnrollment<br/>ID | StudentID | CourseID<br/>Fee | PaidAmount"]
    
    Purchase["📦 Purchase<br/>ID | SupplierID<br/>Date | TotalAmount"]
    
    PurchaseItem["🛒 PurchaseItem<br/>ID | PurchaseID<br/>ProductID | Qty"]
    
    Product["📦 Product<br/>ID | Name | Stock<br/>Price | Category"]
    
    Supplier["🏢 Supplier<br/>ID | Name | Phone<br/>Email | Address"]
    
    Expense["📋 Expense<br/>ID | Type | Amount<br/>Date | Method"]
    
    Customer -->|books| Appointment
    Appointment -->|uses| AppointmentService
    Service -->|used in| AppointmentService
    Appointment -->|assigned to| Staff
    Appointment -->|generates| SaleRecord
    SaleRecord -->|has| Payment
    Appointment -->|creates| Receivable
    Customer -->|owes| Receivable
    
    Student -->|enrolls in| Enrollment
    Course -->|has| Enrollment
    Enrollment -->|creates| Receivable
    
    Supplier -->|provides| Product
    Purchase -->|from| Supplier
    Purchase -->|contains| PurchaseItem
    Product -->|in| PurchaseItem
    
    style Customer fill:#4ecdc4,stroke:#0d7377,color:#fff
    style Appointment fill:#4ecdc4,stroke:#0d7377,color:#fff
    style SaleRecord fill:#96ceb4,stroke:#558b6f,color:#fff
    style Receivable fill:#fd79a8,stroke:#e84393,color:#fff
    style Course fill:#a29bfe,stroke:#6c5ce7,color:#fff
    style Purchase fill:#ffeaa7,stroke:#fdcb6e,color:#333
```

---

## Module Dependency Diagram

```mermaid
graph TB
    Auth["🔐 Authentication<br/>(Foundation)"]
    
    Customer["👥 Customers"]
    Staff["👔 Staff"]
    Service["🛍️ Services"]
    
    Core["📅 Core Modules"]
    Appointment["📅 Appointments"]
    
    Billing["💳 Billing & Checkout"]
    Financial["💼 Financial Records"]
    
    Education["🎓 Education"]
    Course["📚 Courses"]
    Student["👨‍🎓 Students"]
    
    Reporting["📈 Reporting"]
    
    Auth --> Customer
    Auth --> Staff
    Auth --> Service
    
    Customer --> Appointment
    Staff --> Appointment
    Service --> Appointment
    
    Appointment --> Billing
    Billing --> Financial
    
    Course --> Student
    Student --> Financial
    
    Financial --> Reporting
    Appointment --> Reporting
    
    style Auth fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style Appointment fill:#4ecdc4,stroke:#0d7377,color:#fff
    style Billing fill:#ffeaa7,stroke:#fdcb6e,color:#333
    style Financial fill:#fd79a8,stroke:#e84393,color:#fff
    style Reporting fill:#a29bfe,stroke:#6c5ce7,color:#fff
```

---

*This diagram document provides comprehensive visual representations of the Saloon Management System including activity flows, decision flows, system components, sequence flows, and data relationships. For detailed specifications, refer to the individual documentation files.*
