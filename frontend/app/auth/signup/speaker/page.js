"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { signup } from "@/lib/actions/auth";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormField from "@/components/signup/FormField";
import SectionHeader from "@/components/signup/SectionHeader";

export default function SpeakerRegisterPage() {
  const [signingUp, setSigningUp] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isConfidentialityDialogOpen, setIsConfidentialityDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    contact: false,
    employment: false,
    emergency: false
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  const validatePhilippinePhone = useCallback((phone) => {
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const mobilePattern = /^(\+63|0)9\d{9}$/;
    return mobilePattern.test(cleanPhone);
  }, []);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    sex: "",
    bloodType: "",
    civilStatus: "",
    typeOfDisability: "",
    religion: "",
    educationalAttainment: "",
    
    // Address
    houseNoAndStreet: "",
    barangay: "",
    municipality: "",
    province: "",
    region: "",
    
    // Contact Information
    cellphoneNumber: "",
    emailAddress: "",
    
    // Employment Details
    employmentType: "",
    civilServiceEligibility: "",
    salaryGrade: "",
    presentPosition: "",
    office: "",
    service: "",
    divisionProvince: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactAddress: "",
    emergencyContactNumber: "",
    emergencyContactEmail: "",
    
    // Account Details
    username: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "firstName", "lastName", "dateOfBirth", "sex", "civilStatus",
      "educationalAttainment", "houseNoAndStreet", "barangay", "municipality", 
      "province", "region", "cellphoneNumber", "emailAddress", "username", 
      "password", "confirmPassword"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.cellphoneNumber) {
      if (!validatePhilippinePhone(formData.cellphoneNumber)) {
        newErrors.cellphoneNumber = "Please enter a valid Philippine phone number (e.g., +63 917 123 4567 or 0917 123 4567)";
      }
    }

    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*[0-9])/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must accept the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validatePhilippinePhone]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (name === "terms") {
      if (checked) {
        setIsConfidentialityDialogOpen(true);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleConfidentialityAccept = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      terms: true,
    }));
    setIsConfidentialityDialogOpen(false);
  }, []);

  const handleConfidentialityClose = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      terms: false,
    }));
    setIsConfidentialityDialogOpen(false);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setSigningUp(true);

        // Add userType to formData for speaker registration
        const speakerFormData = {
          ...formData,
          userType: 3 // Speaker user type
        };

        const { success, data, message } = await signup(speakerFormData);

        if (!success) {
          Swal.fire({
            title: "Uh oh",
            text: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            backdrop: true,
            confirmButtonText: "OK",
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Success!",
            text: "Account created successfully!.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            backdrop: true,
            confirmButtonText: "OK",
            icon: "success",
          }).then(() => {
            window.location.href = "/auth/signin";
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          backdrop: true,
          confirmButtonText: "OK",
          icon: "error",
        });
      } finally {
        setSigningUp(false);
      }
    }
  }, [formData, validateForm]);

  const handleCaptchaVerify = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  return (
    <div className="font-[sans-serif]">
      <Dialog
        open={isConfidentialityDialogOpen}
        onOpenChange={handleConfidentialityClose}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confidentiality and Privilege Notice</DialogTitle>
            <DialogDescription>
              Please read and understand the following confidentiality terms:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-sm">
            <p className="bg-gray-50 border-l-4 border-blue-500 text-gray-700 p-3 rounded-md text-md">
              The <strong>Philippine Statistics Authority</strong>, in compliance
              with <span className="font-medium">Republic Act No. 10173</span> (Data
              Privacy Act of 2012), emphasizes that this communication may
              contain confidential and/or privileged information. If you are not
              the intended recipient, any unauthorized disclosure, copying,
              distribution, or use of this message is{" "}
              <span className="font-semibold">prohibited by law</span>. If received
              in error, please delete this email, including attachments, and
              notify the sender immediately.
            </p>

            <p className="font-medium">
              By proceeding, you confirm that you understand and will comply
              with these confidentiality guidelines.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleConfidentialityClose}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfidentialityAccept}>
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-2 md:grid-cols-2 items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-md:order-1 h-screen min-h-full"
        >
          <img
            src="https://opendoodles.s3-us-west-1.amazonaws.com/sitting-reading.svg"
            className="w-full h-full object-fit"
            alt="register-image"
          />
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="max-w-2xl w-full p-6 mx-auto max-h-screen overflow-y-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-gray-800 text-4xl font-extrabold">
              Create Speaker Account
            </h3>
            <p className="text-gray-800 text-sm mt-6">
              Already have an account?
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/auth/signin"
                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Sign in here
              </motion.a>
            </p>
          </motion.div>

          {/* Personal Information Section */}
          <SectionHeader 
            title="Personal Information" 
            isExpanded={expandedSections.personal}
            onToggle={() => toggleSection('personal')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                required
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
              />
              <FormField
                label="Middle Name"
                name="middleName"
                placeholder="Enter your middle name"
                value={formData.middleName}
                onChange={handleInputChange}
                error={errors.middleName}
              />
              <FormField
                label="Last Name"
                name="lastName"
                required
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
              />
              <FormField
                label="Suffix"
                name="suffix"
                placeholder="Jr., Sr., III, etc."
                value={formData.suffix}
                onChange={handleInputChange}
                error={errors.suffix}
              />
              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
              />
              <FormField
                label="Sex"
                name="sex"
                required
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" }
                ]}
                value={formData.sex}
                onChange={handleInputChange}
                error={errors.sex}
              />
              <FormField
                label="Blood Type"
                name="bloodType"
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" }
                ]}
                value={formData.bloodType}
                onChange={handleInputChange}
                error={errors.bloodType}
              />
              <FormField
                label="Civil Status"
                name="civilStatus"
                required
                options={[
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                  { value: "widowed", label: "Widowed" },
                  { value: "separated", label: "Separated" },
                  { value: "civil_partnership", label: "Civil Partnership" },
                  { value: "cohabitation", label: "Cohabitation (live-in)" }
                ]}
                value={formData.civilStatus}
                onChange={handleInputChange}
                error={errors.civilStatus}
              />
              <FormField
                label="Type of Disability"
                name="typeOfDisability"
                options={[
                  { value: "none", label: "None" },
                  { value: "deaf_hard_hearing", label: "Deaf or Hard of Hearing" },
                  { value: "intellectual", label: "Intellectual Disability" },
                  { value: "learning", label: "Learning Disability" },
                  { value: "mental", label: "Mental Disability" },
                  { value: "physical_orthopedic", label: "Physical Disability (Orthopedic)" },
                  { value: "psychosocial", label: "Psychosocial Disability" },
                  { value: "speech_language", label: "Speech and Language Impairment" },
                  { value: "visual", label: "Visual Disability" },
                  { value: "cancer", label: "Cancer (RA11215)" },
                  { value: "rare_disease", label: "Rare Disease (RA10747)" }
                ]}
                value={formData.typeOfDisability}
                onChange={handleInputChange}
                error={errors.typeOfDisability}
              />
              <FormField
                label="Religion"
                name="religion"
                options={[
                  { value: "roman_catholic", label: "Roman Catholic" },
                  { value: "islam", label: "Islam" },
                  { value: "iglesia_ni_cristo", label: "Iglesia ni Cristo" },
                  { value: "ifi", label: "Iglesia Filipina Independiente (IFI)" },
                  { value: "sda", label: "Seventh Day Adventist" },
                  { value: "bible_baptist", label: "Bible Baptist Church" },
                  { value: "uccp", label: "United Church of Christ in the Philippines" },
                  { value: "jehovah_witness", label: "Jehovah's Witness" },
                  { value: "lds", label: "The Church of Jesus Christ of Latter-day Saints" },
                  { value: "pentecostal", label: "Pentecostal" },
                  { value: "lutheran", label: "Lutheran" },
                  { value: "buddhism", label: "Buddhism" },
                  { value: "hinduism", label: "Hinduism" },
                  { value: "atheist", label: "Atheist" }
                ]}
                value={formData.religion}
                onChange={handleInputChange}
                error={errors.religion}
              />
              <FormField
                label="Educational Attainment"
                name="educationalAttainment"
                required
                options={[
                  { value: "elementary", label: "Elementary" },
                  { value: "junior_high", label: "Junior High School" },
                  { value: "senior_high", label: "Senior High School" },
                  { value: "college", label: "College" },
                  { value: "vocational", label: "Vocational" },
                  { value: "post_graduate", label: "Post Graduate" }
                ]}
                value={formData.educationalAttainment}
                onChange={handleInputChange}
                error={errors.educationalAttainment}
              />
            </div>
          </SectionHeader>

          {/* Address Section */}
          <SectionHeader 
            title="Address" 
            isExpanded={expandedSections.contact}
            onToggle={() => toggleSection('contact')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="House No. and Street"
                name="houseNoAndStreet"
                required
                placeholder="Enter house number and street"
                className="md:col-span-2"
                value={formData.houseNoAndStreet}
                onChange={handleInputChange}
                error={errors.houseNoAndStreet}
              />
              <FormField
                label="Barangay"
                name="barangay"
                required
                placeholder="Enter barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                error={errors.barangay}
              />
              <FormField
                label="Municipality"
                name="municipality"
                required
                placeholder="Enter municipality"
                value={formData.municipality}
                onChange={handleInputChange}
                error={errors.municipality}
              />
              <FormField
                label="Province"
                name="province"
                required
                placeholder="Enter province"
                value={formData.province}
                onChange={handleInputChange}
                error={errors.province}
              />
              <FormField
                label="Region"
                name="region"
                required
                placeholder="Enter region"
                value={formData.region}
                onChange={handleInputChange}
                error={errors.region}
              />
            </div>
          </SectionHeader>

          {/* Contact Information Section */}
          <SectionHeader 
            title="Contact Information" 
            isExpanded={expandedSections.contact}
            onToggle={() => toggleSection('contact')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Cellphone Number"
                name="cellphoneNumber"
                type="tel"
                required
                placeholder="0917 123 4567 or +63 917 123 4567"
                value={formData.cellphoneNumber}
                onChange={handleInputChange}
                error={errors.cellphoneNumber}
              />
              <FormField
                label="Email Address"
                name="emailAddress"
                type="email"
                required
                placeholder="Enter email address"
                value={formData.emailAddress}
                onChange={handleInputChange}
                error={errors.emailAddress}
              />
            </div>
          </SectionHeader>

          {/* Employment Details Section */}
          <SectionHeader 
            title="Employment Details" 
            isExpanded={expandedSections.employment}
            onToggle={() => toggleSection('employment')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Type of Employment"
                name="employmentType"
                options={[
                  { value: "permanent_regular", label: "Permanent/Regular" },
                  { value: "contractual", label: "Contractual" },
                  { value: "coterminous", label: "Coterminous" },
                  { value: "contract_service", label: "Contract of Service Worker" }
                ]}
                value={formData.employmentType}
                onChange={handleInputChange}
                error={errors.employmentType}
              />
              <FormField
                label="Civil Service Eligibility Level"
                name="civilServiceEligibility"
                options={[
                  { value: "first_level", label: "First Level (Sub-Professional)" },
                  { value: "second_level", label: "Second Level (Professional)" },
                  { value: "third_level", label: "Third Level (Career Service Executive Eligibility)" }
                ]}
                value={formData.civilServiceEligibility}
                onChange={handleInputChange}
                error={errors.civilServiceEligibility}
              />
              <FormField
                label="Salary Grade"
                name="salaryGrade"
                options={Array.from({ length: 30 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: (i + 1).toString()
                }))}
                value={formData.salaryGrade}
                onChange={handleInputChange}
                error={errors.salaryGrade}
              />
              <FormField
                label="Present Position"
                name="presentPosition"
                placeholder="Enter present position"
                value={formData.presentPosition}
                onChange={handleInputChange}
                error={errors.presentPosition}
              />
              <FormField
                label="Office"
                name="office"
                placeholder="Enter office"
                value={formData.office}
                onChange={handleInputChange}
                error={errors.office}
              />
              <FormField
                label="Service"
                name="service"
                placeholder="Enter service"
                value={formData.service}
                onChange={handleInputChange}
                error={errors.service}
              />
              <FormField
                label="Division/Province"
                name="divisionProvince"
                placeholder="Enter division/province"
                value={formData.divisionProvince}
                onChange={handleInputChange}
                error={errors.divisionProvince}
              />
            </div>
          </SectionHeader>

          {/* Emergency Contact Section */}
          <SectionHeader 
            title="Emergency Contact" 
            isExpanded={expandedSections.emergency}
            onToggle={() => toggleSection('emergency')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Name of Contact Person"
                name="emergencyContactName"
                placeholder="Enter emergency contact name"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                error={errors.emergencyContactName}
              />
              <FormField
                label="Relationship"
                name="emergencyContactRelationship"
                placeholder="Enter relationship"
                value={formData.emergencyContactRelationship}
                onChange={handleInputChange}
                error={errors.emergencyContactRelationship}
              />
              <FormField
                label="Contact Address"
                name="emergencyContactAddress"
                placeholder="Enter contact address"
                className="md:col-span-2"
                value={formData.emergencyContactAddress}
                onChange={handleInputChange}
                error={errors.emergencyContactAddress}
              />
              <FormField
                label="Contact Number"
                name="emergencyContactNumber"
                type="tel"
                placeholder="Enter contact number"
                value={formData.emergencyContactNumber}
                onChange={handleInputChange}
                error={errors.emergencyContactNumber}
              />
              <FormField
                label="Contact Email"
                name="emergencyContactEmail"
                type="email"
                placeholder="Enter contact email"
                value={formData.emergencyContactEmail}
                onChange={handleInputChange}
                error={errors.emergencyContactEmail}
              />
            </div>
          </SectionHeader>

          {/* Account Details Section */}
          <SectionHeader 
            title="Account Details" 
            isExpanded={true}
            onToggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Username"
                name="username"
                required
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                required
                placeholder="Create password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />
            </div>
          </SectionHeader>

          <motion.div
            variants={itemVariants}
            className="flex items-center mt-6"
          >
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={formData.terms}
              onChange={handleInputChange}
              className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-3 block text-sm text-gray-800">
              I agree to the
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="javascript:void(0);"
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                Terms & Conditions
              </motion.a>
            </label>
          </motion.div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
          )}

          <motion.div variants={itemVariants} className="mt-4 w-full">
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
              onVerify={handleCaptchaVerify}
              onExpire={handleCaptchaExpire}
            />
            {errors.captcha && (
              <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>
            )}
          </motion.div>

          {errors.submit && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {errors.submit}
            </p>
          )}

          <motion.div variants={itemVariants} className="mt-12">
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              type="submit"
              disabled={signingUp}
              className="relative w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium tracking-wide rounded-md text-white-100 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {signingUp && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{signingUp ? "Signing Up..." : "Create Speaker Account"}</span>
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
} 
