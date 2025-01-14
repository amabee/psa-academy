import React from "react";
import Header from "@/components/shared/header";
import { Camera, Mail, MapPin, Calendar, Settings, Edit } from "lucide-react";

const UserProfilePage = () => {
  const userProfile = {
    name: "Sarah Anderson",
    role: "Product Designer",
    location: "San Francisco, CA",
    email: "sarah.anderson@example.com",
    joinDate: "January 2024",
    bio: "Passionate about creating beautiful and intuitive user experiences. Love exploring new design trends and technologies.",
    avatarUrl: "/api/placeholder/150/150",
  };

  return (
    <>
      <div className="bg-inherit min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img
                  src={userProfile.avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-md"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
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
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
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

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bio Section */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md shadow-slate-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  About
                </h3>
                <p className="text-white leading-relaxed">
                  {userProfile.bio}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Settings
                  </h3>
                  <Settings className="w-5 h-5 text-gray-500" />
                </div>
                <div className="space-y-3">
                  {["Account", "Privacy", "Notifications", "Security"].map(
                    (setting) => (
                      <button
                        key={setting}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        {setting}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
