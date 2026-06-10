# Integrate Dynamic API for Clients (Customers)

This plan outlines the steps to replace the static mock data for Clients with the new dynamic API endpoints (`/api/customer` and `/api/customermetafield`).

## Proposed Changes

### 1. New API Services
We will create two new service files using the `_BaseAPIService`:
*   `src/services/OrderingServices/CustomerService.js` (for `GET`, `POST`, `PUT`, `DELETE` on `/api/customer`)
*   `src/services/OrderingServices/CustomerMetaFieldService.js` (for fetching available meta fields to render dynamically in the form).

### 2. Update Validation Schema
We will update `clientValidationSchema` in `src/services/validationSchemas.js` to match the new payload structure:
*   **Remove:** `nationalId`, `skin`
*   **Add/Rename:** `phone` becomes `phoneNo`, add optional `phoneNo2`, add `address`, add `customerTypeId` (required), and support dynamic validation for `customerMetaValues`.

### 3. Client List Page (`Client.jsx`)
*   Replace the manual HTML table with `react-data-table-component` to easily support the server-side pagination payload (`totalCount`, `pageNumber`, `pageSize`).
*   Columns will be: `S.N`, `Name` (firstName + lastName), `Email`, `Address`, `Phone`, `Type` (customerTypeName), and `Actions` (View, Edit, Delete).
*   Add filtering (Search text, Status).

### 4. Dynamic Customer Form (`AddCustomerModal.jsx`)
*   Fetch `CustomerTypeService.getList()` on load to populate a dropdown for `customerTypeId`.
*   Fetch `CustomerMetaFieldService.getList()` on load. For each active meta field, we will render a dynamic input in the form.
*   On submit, map the dynamic form fields into the `customerMetaValues` array format expected by the API: `[{ metaFieldCode: "IS STUDENT", value: "..." }]`.

## Open Questions & Review Required

> [!IMPORTANT]
> **API Endpoints Confirmation:**
> I will assume the endpoints for Meta Fields are:
> *   `GET /api/customermetafield`
> *   `POST /api/customermetafield`
> Is this correct, or is the endpoint path different (e.g., `/api/customer/metafields`)?

> [!NOTE]
> **Data Table Component:**
> I will use `react-data-table-component` for the Client list to match what we did for Customer Types, which easily handles the `totalCount` and `pageNumber` from your API response. Is that acceptable?

## Verification Plan
1.  Verify the list page fetches `/api/customer` and properly paginates the results.
2.  Verify the "Add Customer" modal fetches `Customer Types` and `Customer Meta Fields` to render dynamic dropdowns and inputs.
3.  Verify that submitting the form sends the correct JSON payload with `firstName`, `lastName`, and the formatted `customerMetaValues` array.
