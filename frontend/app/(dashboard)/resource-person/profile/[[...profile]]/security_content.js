"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, Eye, EyeOff, Shield, Key } from "lucide-react";
import { updatePassword } from "@/lib/actions/resource-person/profile";
import { useUser } from "@/app/providers/UserProvider";
import { toast } from "sonner";

const SecurityContent = () => {
  const userDetail = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*[0-9])/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const { success, message } = await updatePassword(
        userDetail.user.user_id,
        formData.currentPassword,
        formData.newPassword
      );

      if (success) {
        toast.success("Password updated successfully");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Lock className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-slate-300">Account Status</p>
                <p className="text-white font-medium">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Key className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-slate-300">Last Password Change</p>
                <p className="text-white font-medium">Not available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white">
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="Enter your current password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-400 text-sm">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">
                New Password
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="Enter your new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-400 text-sm">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm New Password
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <Separator className="bg-slate-700" />

            {/* Password Requirements */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Password Requirements:</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(formData.newPassword) ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  Contains at least one uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/(?=.*[0-9])/.test(formData.newPassword) ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  Contains at least one number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityContent; 
