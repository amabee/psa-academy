"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Upload, User, X } from "lucide-react";
import { toast } from "sonner";

const ProfileImageSection = ({ userProfile, onUpdate, isDisabled }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      await onUpdate(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      {/* Current Profile Image */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Current Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
                {userProfile.avatarUrl && userProfile.avatarUrl !== `${process.env.NEXT_PUBLIC_ROOT_URL}profile_image_serve.php?image=` ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                {userProfile.name}
              </h3>
              <p className="text-slate-300 text-sm">
                {userProfile.role} • Member since {userProfile.joinDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload New Image */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!selectedFile ? (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-slate-300 text-sm">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <Button
                    onClick={handleBrowseClick}
                    disabled={isDisabled}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Browse Files
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-green-200 shadow-lg">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-slate-300 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={handleUpload}
                      disabled={isDisabled}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isDisabled ? "Uploading..." : "Upload Image"}
                    </Button>
                    <Button
                      onClick={handleRemoveFile}
                      disabled={isDisabled}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Guidelines */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Image Guidelines:</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Supported formats: JPG, PNG, GIF
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Maximum file size: 5MB
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Recommended size: 400x400 pixels or larger
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Square images work best for profile pictures
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileImageSection; 
