"use client";

import axios from "axios";
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;
const SECRET_KEY = process.env.SECRET_KEY;

const uploadFileChunks = async (file, onProgress) => {
  const chunkSize = 5120 * 5120;
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileId = crypto.randomUUID();
  let uploadedChunks = 0;

  const uploadChunkWithRetry = async (chunk, chunkIndex, retries = 3) => {
    const formData = new FormData();
    formData.append("chunk", new Blob([chunk]), "chunk");
    formData.append("chunkIndex", chunkIndex);
    formData.append("totalChunks", totalChunks);
    formData.append("fileId", fileId);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);

    try {
      const response = await axios(`${BASE_URL}upload_chunkz.php`, {
        method: "POST",
        data: formData,
        headers: {
          Authorization: SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        uploadedChunks++;
        onProgress?.(Math.round((uploadedChunks / totalChunks) * 100));
        return response.data;
      }
      throw new Error("Upload failed");
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return uploadChunkWithRetry(chunk, chunkIndex, retries - 1);
      }
      throw error;
    }
  };

  // Upload chunks sequentially for the last chunk to ensure we get the filename
  const chunks = [];
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const chunk = file.slice(
      chunkIndex * chunkSize,
      Math.min((chunkIndex + 1) * chunkSize, file.size)
    );
    chunks.push({ chunk, chunkIndex });
  }

  try {
    // Upload all chunks except the last one concurrently
    const concurrencyLimit = 3;
    const nonLastChunks = chunks.slice(0, -1);
    for (let i = 0; i < nonLastChunks.length; i += concurrencyLimit) {
      const chunkBatch = nonLastChunks.slice(i, i + concurrencyLimit);
      await Promise.all(
        chunkBatch.map(({ chunk, chunkIndex }) =>
          uploadChunkWithRetry(chunk, chunkIndex)
        )
      );
    }

    // Upload the last chunk separately to ensure we get the filename
    const lastChunk = chunks[chunks.length - 1];
    const finalResponse = await uploadChunkWithRetry(
      lastChunk.chunk,
      lastChunk.chunkIndex
    );

    return finalResponse.data?.fileName;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = await uploadFileChunks(file, (progress) => {
        setUploadProgress(progress);
      });

      if (!fileName) {
        throw new Error("No filename received from server");
      }

      setUploadProgress(100);
      return fileName;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
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
