import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const AccountContent = ({ userProfile, InputField }) => {
  if (!userProfile || !InputField) {
    return null;
  }

  const [bioContent, setBioContent] = useState(userProfile.bio || "");
  const maxLength = 500;

  const handleBioChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setBioContent(text);
    }
  };

  return (
    <div className="space-y-6">
      <InputField
        label="Full Name"
        defaultValue={userProfile.name}
        className="text-white"
        disabled
      />
      <InputField
        label="Gender"
        defaultValue={userProfile.role}
        className="text-white"
        disabled
      />
      <InputField
        label="Email"
        type="email"
        defaultValue={userProfile.email}
        className="text-white"
      />
      <InputField
        label="Role"
        defaultValue={userProfile.role}
        className="text-white"
        disabled
      />
      <InputField
        label="Address"
        defaultValue={userProfile.address}
        className="text-white"
      />
      <InputField
        label="Birthday"
        defaultValue={userProfile.birthDay}
        className="text-white"
        disabled
      />
      <InputField
        label="Pregnant"
        defaultValue={userProfile.isPregnant}
        className="text-white"
        disabled
      />
      <InputField
        label="Person With Disability"
        defaultValue={userProfile.isPwd}
        className="text-white"
      />
      <InputField
        label="Solo Parent"
        defaultValue={userProfile.isSoloParent}
        className="text-white"
      />
      <InputField
        label="Position"
        defaultValue={userProfile.position}
        className="text-white"
        disabled
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-white/90">Bio</label>
          <span className="text-sm text-white/70">
            {bioContent.length}/{maxLength} characters
          </span>
        </div>
        <textarea
          value={bioContent}
          onChange={handleBioChange}
          rows={5}
          className="w-full p-4 rounded-lg bg-white/5 text-gray-700 border border-white/10 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none
            transition-all duration-200 placeholder-white/30 hover:bg-white/10 resize-none"
          placeholder="Tell us about yourself"
          maxLength={maxLength}
        />
      </div>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg 
          transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 
          hover:-translate-y-1"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default AccountContent;
