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
} from "@/lib/actions/speaker/profile";
import { toast } from "sonner";
import ProfileImageSection from "./profile_image";

const SpeakerProfilePage = () => {
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
        return "Program Manager";
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
    email: userDetail?.user.email || "sarah.anderson@example.com",
    joinDate: formatDate(userDetail?.user.date_created),
    bio: userDetail?.user.user_about,
    avatarUrl: `${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=${userDetail?.user.profile_image}`,
    birthDay: formatDate(userDetail?.user.date_of_birth),
    gender: userDetail?.user.gender,
    isPwd: userDetail?.user.is_Pwd,
    isSoloParent: userDetail?.user.is_SoloParent,
    isPregnant: userDetail?.user.is_Pregnant,
    position: userDetail?.user.position,
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
        user.email,
        user.bio,
        user.address,
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
        email: user.email,
        user_about: user.bio,
        address: user.address,
        is_Pregnant: user.isPregnant,
        is_Pwd: user.isPwd,
        is_SoloParent: user.isSoloParent,
        date_updated: new Date().toISOString().slice(0, 19).replace("T", " "), // Update the timestamp
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
      const { success, data, message } = await updateProfileImage(
        userDetail.user.user_id,
        file
      );

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success("Profile image updated successfully");

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...currentUser,
        profile_image: data,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.message || "Failed to update profile image");
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
      case "Privacy":
        return (
          <PrivacyContent
            SelectField={SelectField}
            CustomSwitch={CustomSwitch}
          />
        );
      case "Notifications":
        return <NotificationsContent CustomSwitch={CustomSwitch} />;
      case "Security":
        return <SecurityContent InputField={InputField} />;
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
      case "Privacy":
        return <Lock className="w-4 h-4" />;
      case "Notifications":
        return <Bell className="w-4 h-4" />;
      case "Security":
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-inherit min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <MagicCard
          className="mb-6 cursor-default hover:shadow-xl transition-shadow duration-300"
          gradientColor={gradientColor}
          gradientOpacity={0.1}
          gradientSize={500}
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="relative group">
                <ProfileImageSection
                  userProfile={userProfile}
                  userDetail={userDetail}
                  onImageUpdate={handleUpdateProfileImage}
                />
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-3xl font-bold text-white">
                      {userProfile.name}
                    </h2>

                    <Separator
                      orientation="vertical"
                      className="h-6 w-[2px] bg-gray-400"
                    />

                    <p className="text-white/80 text-lg">
                      @{userProfile.username}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center text-white/80 hover:text-white transition-colors">
                    <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                    <span>{userProfile.address}</span>
                  </div>
                  <div className="flex items-center text-white/80 hover:text-white transition-colors">
                    <Mail className="w-5 h-5 mr-2 text-blue-400" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center text-white/80 hover:text-white transition-colors">
                    <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                    <span>Joined {userProfile.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MagicCard>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MagicCard
              className="cursor-default hover:shadow-xl transition-shadow duration-300 w-full"
              gradientColor={gradientColor}
              gradientOpacity={0.1}
              gradientSize={500}
            >
              <div className="p-8 w-full">
                <h3 className="text-2xl font-semibold text-white mb-8">
                  {activeSection}
                </h3>
                {renderContent()}
              </div>
            </MagicCard>
          </div>

          <div className="md:col-span-1">
            <MagicCard
              className="cursor-default hover:shadow-xl transition-shadow duration-300 h-[450]"
              gradientColor={gradientColor}
              gradientOpacity={0.1}
              gradientSize={500}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Settings</h3>
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2">
                  {[
                    "About",
                    "Account",
                    "Privacy",
                    "Notifications",
                    "Security",
                  ].map((setting) => (
                    <Button
                      key={setting}
                      onClick={() => setActiveSection(setting)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300
                        ${
                          activeSection === setting
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 -translate-y-1"
                            : "text-white hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {getIcon(setting)}
                        <span>{setting}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeSection === setting ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Profile Status</h4>
                      <p className="text-sm text-white/60">
                        Your profile is complete
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                {/* <Button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                  <Lock className="w-4 h-4" />
                  <span>Logout</span>
                </Button> */}
              </div>
            </MagicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerProfilePage;
