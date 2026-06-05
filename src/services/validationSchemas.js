/**
 * Validation Schemas
 * Using Yup for form validation with Formik
 */

import * as yup from "yup";

// Common field validators
const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nationalIdRegex = /^[A-Za-z0-9]{9,}$/;

/**
 * Client/Customer validation schema
 */
export const clientValidationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  nationalId: yup
    .string()
    .required("National ID is required")
    .matches(nationalIdRegex, "National ID must be valid"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegex, "Phone number must be 10 digits"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Email must be valid"),
  skin: yup.string().required("Skin type is required"),
});

/**
 * Student enrollment validation schema
 */
export const studentValidationSchema = yup.object({
  student: yup.string().required("Student name is required"),
  course: yup.string().required("Course is required"),
  nationalId: yup
    .string()
    .required("National ID is required")
    .matches(nationalIdRegex, "National ID must be valid"),
  code: yup.string().required("Student code is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Email must be valid"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegex, "Phone number must be 10 digits"),
  address: yup.string().required("Address is required"),
  startDate: yup
    .date()
    .required("Start date is required")
    .typeError("Start date must be valid"),
  duration: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration cannot exceed 365 days"),
  courseRate: yup
    .number()
    .required("Course rate is required")
    .min(0, "Course rate must be positive"),
  scholarship: yup.number().min(0, "Scholarship must be positive").default(0),
  deposit: yup
    .number()
    .required("Deposit is required")
    .min(0, "Deposit must be positive"),
});

/**
 * Appointment/Booking validation schema
 */
export const appointmentValidationSchema = yup.object({
  customerName: yup.string().required("Customer name is required"),
  customerId: yup.string().required("Customer is required"),
  service: yup.string().required("Service is required"),
  date: yup.date().required("Date is required").typeError("Date must be valid"),
  time: yup.string().required("Time is required"),
  therapist: yup.string().required("Therapist is required"),
  status: yup.string().required("Status is required"),
  notes: yup.string(),
});

/**
 * Course validation schema
 */
export const courseValidationSchema = yup.object({
  name: yup
    .string()
    .required("Course name is required")
    .min(5, "Course name must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  duration: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 day"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  instructor: yup.string().required("Instructor is required"),
  level: yup.string().required("Level is required"),
  status: yup.string().required("Status is required"),
});

/**
 * Staff validation schema
 */
export const staffValidationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  position: yup.string().required("Position is required"),
  department: yup.string().required("Department is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegex, "Phone number must be 10 digits"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Email must be valid"),
  salary: yup
    .number()
    .required("Salary is required")
    .min(0, "Salary must be positive"),
  status: yup.string().required("Status is required"),
});
