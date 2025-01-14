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
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";

const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState("About");
  const gradientColor = "#93a9ad";

  const userProfile = {
    name: "Sarah Anderson",
    role: "Product Designer",
    location: "San Francisco, CA",
    email: "sarah.anderson@example.com",
    joinDate: "January 2024",
    bio: "Passionate about creating beautiful and intuitive user experiences. Love exploring new design trends and technologies.",
    avatarUrl: "/api/placeholder/150/150",
  };

  // Content components for different sections
  const AccountContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-white text-sm">Full Name</label>
        <input
          type="text"
          defaultValue={userProfile.name}
          className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-white text-sm">Email</label>
        <input
          type="email"
          defaultValue={userProfile.email}
          className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-white text-sm">Role</label>
        <input
          type="text"
          defaultValue={userProfile.role}
          className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 outline-none"
        />
      </div>
    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Profile Visibility</h4>
          <p className="text-white/70 text-sm">
            Control who can see your profile
          </p>
        </div>
        <select className="bg-white/10 text-white border border-white/20 rounded-lg p-2">
          <option>Public</option>
          <option>Private</option>
          <option>Connections Only</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Activity Status</h4>
          <p className="text-white/70 text-sm">Show when you're online</p>
        </div>
        <div className="relative inline-block w-12 h-6 rounded-full bg-white/10">
          <input type="checkbox" className="sr-only peer" />
          <span className="absolute inset-0 peer-checked:bg-blue-500 rounded-full transition-colors duration-300"></span>
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
        </div>
      </div>
    </div>
  );

  const NotificationsContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Email Notifications</h4>
          <p className="text-white/70 text-sm">Receive updates via email</p>
        </div>
        <div className="relative inline-block w-12 h-6 rounded-full bg-white/10">
          <input type="checkbox" defaultChecked className="sr-only peer" />
          <span className="absolute inset-0 peer-checked:bg-blue-500 rounded-full transition-colors duration-300"></span>
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Push Notifications</h4>
          <p className="text-white/70 text-sm">Receive mobile notifications</p>
        </div>
        <div className="relative inline-block w-12 h-6 rounded-full bg-white/10">
          <input type="checkbox" className="sr-only peer" />
          <span className="absolute inset-0 peer-checked:bg-blue-500 rounded-full transition-colors duration-300"></span>
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
        </div>
      </div>
    </div>
  );

  const SecurityContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-white text-sm">Current Password</label>
        <input
          type="password"
          className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-white text-sm">New Password</label>
        <input
          type="password"
          className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-white text-sm">Confirm New Password</label>
        <input
          type="password"
          className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 outline-none"
        />
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
        return <p className="text-white leading-relaxed">{userProfile.bio}</p>;
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
          className="mb-6 cursor-default"
          gradientColor={gradientColor}
          gradientOpacity={0.1}
          gradientSize={500}
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img
                  src={userProfile.avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-md"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {userProfile.name}
                    </h2>
                    <p className="text-white">{userProfile.role}</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-500/25">
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center text-white">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Calendar className="w-4 h-4 mr-2" />
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
              className="cursor-default"
              gradientColor={gradientColor}
              gradientOpacity={0.1}
              gradientSize={500}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {activeSection}
                </h3>
                {renderContent()}
              </div>
            </MagicCard>
          </div>

          <div className="md:col-span-1">
            <MagicCard
              className="cursor-default"
              gradientColor={gradientColor}
              gradientOpacity={0.1}
              gradientSize={500}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Settings</h3>
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-3">
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
                      className={`w-full flex items-center gap-2 justify-start px-4 py-2 rounded-lg transition-all duration-300 ${
                        activeSection === setting
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 -translate-y-1"
                          : "text-white hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg"
                      }`}
                    >
                      {getIcon(setting)}
                      <span>{setting}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </MagicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
