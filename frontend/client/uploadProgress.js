"use client";

import { uploadFileChunks } from "@/lib/actions/speaker/action";
import { useState } from "react";


export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = await uploadFileChunks(file);
      setUploadProgress(100);
      return fileName;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    uploadProgress,
    isUploading,
  };
};
