import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AccountContent = ({
  userProfile,
  onSave,
  InputField,
  SelectField,
  isDisabled,
}) => {
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    gender: userProfile?.gender || "",
    email: userProfile?.email || "",
    role: userProfile?.role || "",
    address: userProfile?.address || "",
    birthDay: userProfile?.birthDay || "",
    isPregnant: userProfile?.isPregnant || "No",
    isPwd: userProfile?.isPwd || "No",
    isSoloParent: userProfile?.isSoloParent || "No",
    position: userProfile?.position || "",
    bio: userProfile?.bio || "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        gender: userProfile.gender || "",
        email: userProfile.email || "",
        role: userProfile.role || "",
        address: userProfile.address || "",
        birthDay: userProfile.birthDay || "",
        isPregnant: userProfile.isPregnant || "No",
        isPwd: userProfile.isPwd || "No",
        isSoloParent: userProfile.isSoloParent || "No",
        position: userProfile.position || "",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Full Name"
        value={formData.name}
        onChange={handleInputChange("name")}
        className="text-white"
        disabled
      />
      <InputField
        label="Gender"
        value={formData.gender}
        onChange={handleInputChange("gender")}
        className="text-white"
        disabled
      />
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange("email")}
        className="text-white"
      />
      <InputField
        label="Role"
        value={formData.role}
        onChange={handleInputChange("role")}
        className="text-white"
        disabled
      />
      <InputField
        label="Address"
        value={formData.address}
        onChange={handleInputChange("address")}
        className="text-white"
      />
      <InputField
        label="Birthday"
        value={formData.birthDay}
        onChange={handleInputChange("birthDay")}
        className="text-white"
        disabled
      />
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
      <InputField
        label="Position"
        value={formData.position}
        onChange={handleInputChange("position")}
        className="text-white"
        disabled
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-white/90">Bio</label>
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
