"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Mail,
  MapPin,
  Calendar,
  Settings,
  Edit,
  Shield,
  Bell,
  User,
  Lock,
  ChevronRight,
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";

import AccountContent from "./account_content";
import PrivacyContent from "./privacy";
import NotificationsContent from "./notifications";
import SecurityContent from "./security_content";
import { useUser } from "@/app/providers/UserProvider";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  updateProfileDetails,
  updateProfileImage,
} from "@/lib/actions/resource-person/profile";
import { toast } from "sonner";
import ProfileImageSection from "./profile_image";

const ResourcePersonProfilePage = () => {
  const [activeSection, setActiveSection] = useState("About");
  const gradientColor = "#93a9ad";
  const userDetail = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (userDetail) {
      setIsLoading(false);
    }
  }, [userDetail]);

  const mapUserType = (userType) => {
    switch (userType) {
      case 1:
        return "Admin";
      case 2:
        return "Resource Person";
      case 3:
        return "Speaker";
      case 4:
        return "Student";
      default:
        return "Guest";
    }
  };

  const userProfile = useMemo(() => ({
    name: userDetail
      ? `${userDetail.user.first_name} ${userDetail?.user.middle_name} ${userDetail.user.last_name}`.trim()
      : "No Name",
    username: userDetail?.user.username,
    role: mapUserType(userDetail.user.userType_id),
    address: userDetail?.user.address,
    email: userDetail?.user.email || "",
    joinDate: formatDate(userDetail?.user.date_created),
    bio: userDetail?.user.user_about,
    avatarUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${userDetail?.user.profile_image}`,
    birthDay: formatDate(userDetail?.user.date_of_birth),
    gender: userDetail?.user.gender,
    isPwd: userDetail?.user.is_Pwd,
    isSoloParent: userDetail?.user.is_SoloParent,
    isPregnant: userDetail?.user.is_Pregnant,
    position: userDetail?.user.position,
    first_name: userDetail?.user.first_name || "",
    middle_name: userDetail?.user.middle_name || "",
    last_name: userDetail?.user.last_name || "",
    suffix: userDetail?.user.suffix || "",
    age: userDetail?.user.age || "",
    date_of_birth: userDetail?.user.date_of_birth || "",
    sex: userDetail?.user.sex || "",
    phone: userDetail?.user.phone || "",
    barangay: userDetail?.user.barangay || "",
    municipality: userDetail?.user.municipality || "",
    province: userDetail?.user.province || "",
    region: userDetail?.user.region || "",
    employment_type: userDetail?.user.employment_type || "",
    civil_service_eligibility: userDetail?.user.civil_service_eligibility || "",
    salary_grade: userDetail?.user.salary_grade || "",
    present_position: userDetail?.user.present_position || "",
    office: userDetail?.user.office || "",
    service: userDetail?.user.service || "",
    division_province: userDetail?.user.division_province || "",
    emergency_contact_name: userDetail?.user.emergency_contact_name || "",
    emergency_contact_relationship: userDetail?.user.emergency_contact_relationship || "",
    emergency_contact_address: userDetail?.user.emergency_contact_address || "",
    emergency_contact_number: userDetail?.user.emergency_contact_number || "",
    emergency_contact_email: userDetail?.user.emergency_contact_email || "",
    blood_type: userDetail?.user.blood_type || "",
    civil_status: userDetail?.user.civil_status || "",
    type_of_disability: userDetail?.user.type_of_disability || "",
    religion: userDetail?.user.religion || "",
    educational_attainment: userDetail?.user.educational_attainment || "",
    allergies: userDetail?.user.allergies || "",
    ip: userDetail?.user.ip || "",
    office_id: userDetail?.user.office_id || "",
  }));

  const InputField = ({
    label,
    type = "text",
    value = "",
    onChange = {},
    className = "",
    disabled = false,
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/90">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-4 rounded-lg bg-inherit text-white-100 border border-white/10 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none
        transition-all duration-200 placeholder-white/30 hover:bg-white/10 ${className}  disabled:text-gray-400`}
        placeholder={`Enter your ${label.toLowerCase()}`}
        disabled={disabled}
      />
    </div>
  );

  const CustomSwitch = ({ label, description, defaultChecked = false }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        <p className="text-sm text-white/60 mt-1">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  const SelectField = ({
    label,
    description,
    options,
    value,
    onChange,
    className = "",
    isBooleanValue = false,
  }) => (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-white font-medium">{label}</h4>
          <p className="text-sm text-white/60 mt-1">{description}</p>
        </div>
        <select
          className={`${className} bg-gray-800 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:bg-white/[0.15] transition-colors`}
          value={isBooleanValue ? (value === 1 ? "Yes" : "No") : value}
          onChange={(e) => {
            if (isBooleanValue) {
              onChange({
                target: { value: e.target.value === "Yes" ? 1 : 0 },
              });
            } else {
              onChange(e);
            }
          }}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-gray-800">
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const handleUpdateProfile = async (user) => {
    try {
      setIsDisabled(true);
      const { success, data, message } = await updateProfileDetails(
        userDetail.user.user_id,
        user.first_name,
        user.middle_name,
        user.last_name,
        user.suffix,
        user.age,
        user.date_of_birth,
        user.sex,
        user.gender,
        user.email,
        user.phone,
        user.address,
        user.barangay,
        user.municipality,
        user.province,
        user.region,
        user.employment_type,
        user.civil_service_eligibility,
        user.salary_grade,
        user.present_position,
        user.office,
        user.service,
        user.division_province,
        user.emergency_contact_name,
        user.emergency_contact_relationship,
        user.emergency_contact_address,
        user.emergency_contact_number,
        user.emergency_contact_email,
        user.blood_type,
        user.civil_status,
        user.type_of_disability,
        user.religion,
        user.educational_attainment,
        user.allergies,
        user.ip,
        user.office_id,
        user.position,
        user.bio,
        user.isPregnant,
        user.isPwd,
        user.isSoloParent
      );

      if (!success) {
        toast.error(message);
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...currentUser,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        suffix: user.suffix,
        age: user.age,
        date_of_birth: user.date_of_birth,
        sex: user.sex,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        address: user.address,
        barangay: user.barangay,
        municipality: user.municipality,
        province: user.province,
        region: user.region,
        employment_type: user.employment_type,
        civil_service_eligibility: user.civil_service_eligibility,
        salary_grade: user.salary_grade,
        present_position: user.present_position,
        office: user.office,
        service: user.service,
        division_province: user.division_province,
        emergency_contact_name: user.emergency_contact_name,
        emergency_contact_relationship: user.emergency_contact_relationship,
        emergency_contact_address: user.emergency_contact_address,
        emergency_contact_number: user.emergency_contact_number,
        emergency_contact_email: user.emergency_contact_email,
        blood_type: user.blood_type,
        civil_status: user.civil_status,
        type_of_disability: user.type_of_disability,
        religion: user.religion,
        educational_attainment: user.educational_attainment,
        allergies: user.allergies,
        ip: user.ip,
        office_id: user.office_id,
        position: user.position,
        user_about: user.bio,
        is_Pregnant: user.isPregnant,
        is_Pwd: user.isPwd,
        is_SoloParent: user.isSoloParent,
        date_updated: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      // Save back to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Successfully updated profile");
    } catch (error) {
      toast.error("Failed to update user profile");
    } finally {
      setIsDisabled(false);
    }
  };

  const handleUpdateProfileImage = async (file) => {
    try {
      setIsDisabled(true);
      const { success, data, message } = await updateProfileImage(
        userDetail.user.user_id,
        file
      );

      if (!success) {
        toast.error(message);
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...currentUser,
        profile_image: data,
        date_updated: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      // Save back to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Successfully updated profile image");
    } catch (error) {
      toast.error("Failed to update profile image");
    } finally {
      setIsDisabled(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Account":
        return (
          <AccountContent
            onSave={handleUpdateProfile}
            userProfile={userProfile}
            InputField={InputField}
            SelectField={SelectField}
            isDisabled={isDisabled}
          />
        );
      case "Profile Image":
        return (
          <ProfileImageSection
            userProfile={userProfile}
            onUpdate={handleUpdateProfileImage}
            isDisabled={isDisabled}
          />
        );
      case "Security":
        return <SecurityContent InputField={InputField} />;
      case "Privacy":
        return (
          <PrivacyContent
            SelectField={SelectField}
            CustomSwitch={CustomSwitch}
          />
        );
      case "Notifications":
        return <NotificationsContent CustomSwitch={CustomSwitch} />;
      default:
        return (
          <div className="space-y-6">
            <p className="text-white/80 text-md leading-relaxed">
              {userProfile.bio}
            </p>
          </div>
        );
    }
  };

  const getIcon = (section) => {
    switch (section) {
      case "Account":
        return <User className="w-4 h-4" />;
      case "Profile Image":
        return <Camera className="w-4 h-4" />;
      case "Security":
        return <Shield className="w-4 h-4" />;
      case "Privacy":
        return <Lock className="w-4 h-4" />;
      case "Notifications":
        return <Bell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const sections = [
    "Account",
    "Profile Image",
    "Security",
    "Privacy",
    "Notifications",
  ];

  if (isLoading) {
    return (
      <div className="bg-inherit min-h-screen p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-inherit min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <MagicCard
          className="mb-6 cursor-default hover:shadow-xl transition-shadow duration-300"
          gradientColor={gradientColor}
        >
          <div className="flex items-center space-x-4 p-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
                {userProfile.avatarUrl && userProfile.avatarUrl !== `${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=` ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {userProfile.name}
              </h1>
              <p className="text-slate-300 text-sm mb-2">{userProfile.role}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{userProfile.email || "No email"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userProfile.address || "No address"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </MagicCard>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <MagicCard className="p-4">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      activeSection === section
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {getIcon(section)}
                    <span className="font-medium">{section}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                ))}
              </div>
            </MagicCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <MagicCard className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {activeSection}
                </h2>
                <Separator className="bg-slate-700" />
              </div>
              {renderContent()}
            </MagicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePersonProfilePage; 
