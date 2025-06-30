"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, User, Calendar, Shield, Baby, Heart, Edit, Loader2 } from "lucide-react";

const AccountContent = ({
  userProfile,
  onSave,
  InputField,
  SelectField,
  isDisabled,
}) => {
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: userProfile?.first_name || "",
    middle_name: userProfile?.middle_name || "",
    last_name: userProfile?.last_name || "",
    suffix: userProfile?.suffix || "",
    age: userProfile?.age || "",
    date_of_birth: userProfile?.date_of_birth || "",
    sex: userProfile?.sex || "",
    gender: userProfile?.gender || "",
    blood_type: userProfile?.blood_type || "",
    civil_status: userProfile?.civil_status || "",
    type_of_disability: userProfile?.type_of_disability || "",
    religion: userProfile?.religion || "",
    educational_attainment: userProfile?.educational_attainment || "",
    allergies: userProfile?.allergies || "",
    ip: userProfile?.ip || "",
    
    // Contact Information
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    
    // Address Information
    address: userProfile?.address || "",
    barangay: userProfile?.barangay || "",
    municipality: userProfile?.municipality || "",
    province: userProfile?.province || "",
    region: userProfile?.region || "",
    
    // Employment Information
    employment_type: userProfile?.employment_type || "",
    civil_service_eligibility: userProfile?.civil_service_eligibility || "",
    salary_grade: userProfile?.salary_grade || "",
    present_position: userProfile?.present_position || "",
    office: userProfile?.office || "",
    service: userProfile?.service || "",
    division_province: userProfile?.division_province || "",
    office_id: userProfile?.office_id || "",
    position: userProfile?.position || "",
    
    // Emergency Contact
    emergency_contact_name: userProfile?.emergency_contact_name || "",
    emergency_contact_relationship: userProfile?.emergency_contact_relationship || "",
    emergency_contact_address: userProfile?.emergency_contact_address || "",
    emergency_contact_number: userProfile?.emergency_contact_number || "",
    emergency_contact_email: userProfile?.emergency_contact_email || "",
    
    // Special Categories
    isPregnant: userProfile?.isPregnant || "No",
    isPwd: userProfile?.isPwd || "No",
    isSoloParent: userProfile?.isSoloParent || "No",
    
    // Bio
    bio: userProfile?.bio || "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        middle_name: userProfile.middle_name || "",
        last_name: userProfile.last_name || "",
        suffix: userProfile.suffix || "",
        age: userProfile.age || "",
        date_of_birth: userProfile.date_of_birth || "",
        sex: userProfile.sex || "",
        gender: userProfile.gender || "",
        blood_type: userProfile.blood_type || "",
        civil_status: userProfile.civil_status || "",
        type_of_disability: userProfile.type_of_disability || "",
        religion: userProfile.religion || "",
        educational_attainment: userProfile.educational_attainment || "",
        allergies: userProfile.allergies || "",
        ip: userProfile.ip || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        barangay: userProfile.barangay || "",
        municipality: userProfile.municipality || "",
        province: userProfile.province || "",
        region: userProfile.region || "",
        employment_type: userProfile.employment_type || "",
        civil_service_eligibility: userProfile.civil_service_eligibility || "",
        salary_grade: userProfile.salary_grade || "",
        present_position: userProfile.present_position || "",
        office: userProfile.office || "",
        service: userProfile.service || "",
        division_province: userProfile.division_province || "",
        office_id: userProfile.office_id || "",
        position: userProfile.position || "",
        emergency_contact_name: userProfile.emergency_contact_name || "",
        emergency_contact_relationship: userProfile.emergency_contact_relationship || "",
        emergency_contact_address: userProfile.emergency_contact_address || "",
        emergency_contact_number: userProfile.emergency_contact_number || "",
        emergency_contact_email: userProfile.emergency_contact_email || "",
        isPregnant: userProfile.isPregnant || "No",
        isPwd: userProfile.isPwd || "No",
        isSoloParent: userProfile.isSoloParent || "No",
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const maxLength = 500;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={formData.first_name}
            onChange={handleInputChange("first_name")}
            className="text-white"
          />
          <InputField
            label="Middle Name"
            value={formData.middle_name}
            onChange={handleInputChange("middle_name")}
            className="text-white"
          />
          <InputField
            label="Last Name"
            value={formData.last_name}
            onChange={handleInputChange("last_name")}
            className="text-white"
          />
          <InputField
            label="Suffix"
            value={formData.suffix}
            onChange={handleInputChange("suffix")}
            className="text-white"
          />
          <InputField
            label="Age"
            type="number"
            value={formData.age}
            onChange={handleInputChange("age")}
            className="text-white"
          />
          <InputField
            label="Date of Birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleInputChange("date_of_birth")}
            className="text-white"
          />
          <InputField
            label="Sex"
            value={formData.sex}
            onChange={handleInputChange("sex")}
            className="text-white"
          />
          <InputField
            label="Gender"
            value={formData.gender}
            onChange={handleInputChange("gender")}
            className="text-white"
          />
          <InputField
            label="Blood Type"
            value={formData.blood_type}
            onChange={handleInputChange("blood_type")}
            className="text-white"
          />
          <InputField
            label="Civil Status"
            value={formData.civil_status}
            onChange={handleInputChange("civil_status")}
            className="text-white"
          />
          <InputField
            label="Type of Disability"
            value={formData.type_of_disability}
            onChange={handleInputChange("type_of_disability")}
            className="text-white"
          />
          <InputField
            label="Religion"
            value={formData.religion}
            onChange={handleInputChange("religion")}
            className="text-white"
          />
          <InputField
            label="Educational Attainment"
            value={formData.educational_attainment}
            onChange={handleInputChange("educational_attainment")}
            className="text-white"
          />
          <InputField
            label="Allergies"
            value={formData.allergies}
            onChange={handleInputChange("allergies")}
            className="text-white"
          />
          <InputField
            label="IP (Indigenous People)"
            value={formData.ip}
            onChange={handleInputChange("ip")}
            className="text-white"
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            className="text-white"
          />
          <InputField
            label="Phone Number"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            className="text-white"
          />
        </div>
      </div>

      {/* Address Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Address"
            value={formData.address}
            onChange={handleInputChange("address")}
            className="text-white"
          />
          <InputField
            label="Barangay"
            value={formData.barangay}
            onChange={handleInputChange("barangay")}
            className="text-white"
          />
          <InputField
            label="Municipality"
            value={formData.municipality}
            onChange={handleInputChange("municipality")}
            className="text-white"
          />
          <InputField
            label="Province"
            value={formData.province}
            onChange={handleInputChange("province")}
            className="text-white"
          />
          <InputField
            label="Region"
            value={formData.region}
            onChange={handleInputChange("region")}
            className="text-white"
          />
        </div>
      </div>

      {/* Employment Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
          Employment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Employment Type"
            value={formData.employment_type}
            onChange={handleInputChange("employment_type")}
            className="text-white"
          />
          <InputField
            label="Civil Service Eligibility"
            value={formData.civil_service_eligibility}
            onChange={handleInputChange("civil_service_eligibility")}
            className="text-white"
          />
          <InputField
            label="Salary Grade"
            value={formData.salary_grade}
            onChange={handleInputChange("salary_grade")}
            className="text-white"
          />
          <InputField
            label="Present Position"
            value={formData.present_position}
            onChange={handleInputChange("present_position")}
            className="text-white"
          />
          <InputField
            label="Office"
            value={formData.office}
            onChange={handleInputChange("office")}
            className="text-white"
          />
          <InputField
            label="Service"
            value={formData.service}
            onChange={handleInputChange("service")}
            className="text-white"
          />
          <InputField
            label="Division/Province"
            value={formData.division_province}
            onChange={handleInputChange("division_province")}
            className="text-white"
          />
          <InputField
            label="Office ID"
            value={formData.office_id}
            onChange={handleInputChange("office_id")}
            className="text-white"
          />
          <InputField
            label="Position"
            value={formData.position}
            onChange={handleInputChange("position")}
            className="text-white"
          />
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Emergency Contact Name"
            value={formData.emergency_contact_name}
            onChange={handleInputChange("emergency_contact_name")}
            className="text-white"
          />
          <InputField
            label="Relationship"
            value={formData.emergency_contact_relationship}
            onChange={handleInputChange("emergency_contact_relationship")}
            className="text-white"
          />
          <InputField
            label="Emergency Contact Address"
            value={formData.emergency_contact_address}
            onChange={handleInputChange("emergency_contact_address")}
            className="text-white"
          />
          <InputField
            label="Emergency Contact Number"
            value={formData.emergency_contact_number}
            onChange={handleInputChange("emergency_contact_number")}
            className="text-white"
          />
          <InputField
            label="Emergency Contact Email"
            type="email"
            value={formData.emergency_contact_email}
            onChange={handleInputChange("emergency_contact_email")}
            className="text-white"
          />
        </div>
      </div>

      {/* Special Categories Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
          Special Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Pregnant"
            value={formData.isPregnant}
            onChange={handleInputChange("isPregnant")}
            options={["Yes", "No"]}
            className="w-32 text-white-100 border-white"
            isBooleanValue={true}
          />
          <SelectField
            label="Person With Disability"
            value={formData.isPwd}
            onChange={handleInputChange("isPwd")}
            options={["Yes", "No"]}
            className="w-32 text-white-100 border-white"
            isBooleanValue={true}
          />
          <SelectField
            label="Solo Parent"
            value={formData.isSoloParent}
            onChange={handleInputChange("isSoloParent")}
            options={["Yes", "No"]}
            className="w-32 text-white-100 border-white"
            isBooleanValue={true}
          />
        </div>
      </div>

      {/* Bio Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
          Bio
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white/90">About Me</label>
            <span className="text-sm text-white/70">
              {formData.bio.length}/{maxLength} characters
            </span>
          </div>
          <textarea
            value={formData.bio}
            onChange={handleInputChange("bio")}
            rows={5}
            className="w-full p-4 rounded-lg bg-inherit text-white-100 border border-white/10 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none
              transition-all duration-200 placeholder-white/30 hover:bg-white/10 resize-none"
            placeholder="Tell us about yourself"
            maxLength={maxLength}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg 
          transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 
          hover:-translate-y-1"
        disabled={isDisabled}
      >
        {isDisabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Changes...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default AccountContent; 
