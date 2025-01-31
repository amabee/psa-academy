"use client";
import React, { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Label } from "@/components/ui/label";

const SpeakerProfilePage = () => {
  const [activeSection, setActiveSection] = useState("About");
  const gradientColor = "#93a9ad";

  const userProfile = {
    name: "Sarah Anderson",
    role: "Senior Product Designer",
    location: "Zone 1 Bulua, Cagayan De Oro City",
    email: "sarah.anderson@example.com",
    joinDate: "January 2024",
    bio: "Passionate about creating beautiful and intuitive user experiences. With over 8 years of experience in product design, I specialize in creating seamless user experiences that bridge the gap between complex functionality and elegant simplicity.",
    avatarUrl: "https://github.com/shadcn.png",
  };

  const InputField = ({
    label,
    type = "text",
    defaultValue = "",
    className = "",
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/90">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className={`w-full p-4 rounded-lg bg-white/5 text-gray-700 border border-white/10 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none
        transition-all duration-200 placeholder-white/30 hover:bg-white/10 ${className}`}
        placeholder={`Enter your ${label.toLowerCase()}`}
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

  const SelectField = ({ label, description, options, defaultValue }) => (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-white font-medium">{label}</h4>
          <p className="text-sm text-white/60 mt-1">{description}</p>
        </div>
        <select
          className="bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:bg-white/[0.15] transition-colors"
          defaultValue={defaultValue}
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

  const AccountContent = () => (
    <div className="space-y-6">
      <InputField label="Full Name" defaultValue={userProfile.name} />
      <InputField label="Email" type="email" defaultValue={userProfile.email} />
      <InputField label="Role" defaultValue={userProfile.role} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/90">Bio</label>
        <textarea
          defaultValue={userProfile.bio}
          rows={4}
          className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/10 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none
          transition-all duration-200 placeholder-white/30 hover:bg-white/10"
        />
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1">
        Save Changes
      </Button>
    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-4">
      <SelectField
        label="Profile Visibility"
        description="Control who can see your profile"
        options={["Public", "Private", "Connections Only"]}
        defaultValue="Public"
      />
      <CustomSwitch
        label="Activity Status"
        description="Show when you're online"
        defaultChecked={true}
      />
      <CustomSwitch
        label="Search Visibility"
        description="Allow others to find your profile"
        defaultChecked={true}
      />
    </div>
  );

  const NotificationsContent = () => (
    <div className="space-y-4">
      <CustomSwitch
        label="Email Notifications"
        description="Receive important updates and announcements via email"
        defaultChecked={true}
      />
      <CustomSwitch
        label="Push Notifications"
        description="Get instant notifications for messages and mentions"
        defaultChecked={true}
      />
      <CustomSwitch
        label="Event Reminders"
        description="Receive reminders about upcoming events and sessions"
        defaultChecked={true}
      />
      <CustomSwitch
        label="Marketing Communications"
        description="Stay updated with our latest features and offerings"
        defaultChecked={false}
      />
    </div>
  );

  const SecurityContent = () => (
    <div className="space-y-6">
      <InputField label="Current Password" type="password" />
      <InputField label="New Password" type="password" />
      <InputField label="Confirm New Password" type="password" />
      <div className="flex flex-col space-y-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1">
          Update Password
        </Button>
        <Button className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1">
          Enable Two-Factor Authentication
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "Account":
        return <AccountContent />;
      case "Privacy":
        return <PrivacyContent />;
      case "Notifications":
        return <NotificationsContent />;
      case "Security":
        return <SecurityContent />;
      default:
        return (
          <div className="space-y-6">
            <p className="text-white/80 leading-relaxed">{userProfile.bio}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "UI Design",
                    "UX Research",
                    "Prototyping",
                    "Design Systems",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {["English", "Spanish", "French"].map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
                <Avatar className="h-24 w-24 ring-2 ring-white/20 group-hover:ring-blue-500/50 transition-all duration-300">
                  <AvatarImage
                    src={userProfile.avatarUrl}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 group-hover:scale-110">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {userProfile.name}
                    </h2>
                    <p className="text-white/80 text-lg">{userProfile.role}</p>
                  </div>
                  <Button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-500/25">
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center text-white/80 hover:text-white transition-colors">
                    <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                    <span>{userProfile.location}</span>
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
              className="cursor-default hover:shadow-xl transition-shadow duration-300"
              gradientColor={gradientColor}
              gradientOpacity={0.1}
              gradientSize={500}
            >
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-8">
                  {activeSection}
                </h3>
                {renderContent()}
              </div>
            </MagicCard>
          </div>

          <div className="md:col-span-1">
            <MagicCard
              className="cursor-default hover:shadow-xl transition-shadow duration-300"
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

                <Button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                  <Lock className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </MagicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerProfilePage;
