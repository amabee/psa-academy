"use client";

import axios from "axios";
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;
const SECRET_KEY = process.env.SECRET_KEY;

const generateUniqueId = () => {
  // Method 1: Using crypto.getRandomValues if available
  if (window.crypto && window.crypto.getRandomValues) {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  // Method 2: Fallback to timestamp + random number
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const uploadFileChunks = async (file, onProgress) => {
  const chunkSize = 5120 * 5120;
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileId = generateUniqueId();
  let uploadedChunks = 0;

  console.log("Starting chunked upload:", {
    fileId,
    totalChunks,
    chunkSize,
    totalSize: file.size,
  });

  const uploadChunkWithRetry = async (chunk, chunkIndex, retries = 3) => {
    const formData = new FormData();
    formData.append("chunk", new Blob([chunk]), "chunk");
    formData.append("chunkIndex", chunkIndex);
    formData.append("totalChunks", totalChunks);
    formData.append("fileId", fileId);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);

    try {
      console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks}`, {
        size: chunk.size,
        fileId,
        retryAttemptsLeft: retries,
      });

      const response = await axios(`${BASE_URL}upload_chunkz.php`, {
        method: "POST",
        data: formData,
        headers: {
          Authorization: SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`Chunk ${chunkIndex + 1} response:`, response.data);

      if (response.data.success) {
        uploadedChunks++;
        const progress = Math.round((uploadedChunks / totalChunks) * 100);
        console.log(`Upload progress: ${progress}%`);
        onProgress?.(progress);
        return response.data;
      }

      throw new Error(
        `Server returned success: false for chunk ${chunkIndex + 1}`
      );
    } catch (error) {
      console.error(`Chunk ${chunkIndex + 1} upload error:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        retryAttemptsLeft: retries,
      });

      if (retries > 0) {
        console.log(
          `Retrying chunk ${chunkIndex + 1}, ${retries} attempts left`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return uploadChunkWithRetry(chunk, chunkIndex, retries - 1);
      }
      throw error;
    }
  };

  // Split file into chunks
  const chunks = [];
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min((chunkIndex + 1) * chunkSize, file.size);
    const chunk = file.slice(start, end);
    chunks.push({ chunk, chunkIndex });
  }

  try {
    // Upload all chunks except the last one concurrently
    const concurrencyLimit = 3;
    const nonLastChunks = chunks.slice(0, -1);

    console.log(
      `Uploading ${nonLastChunks.length} chunks with concurrency limit of ${concurrencyLimit}`
    );

    for (let i = 0; i < nonLastChunks.length; i += concurrencyLimit) {
      const chunkBatch = nonLastChunks.slice(i, i + concurrencyLimit);
      console.log(
        `Processing batch of ${chunkBatch.length} chunks starting at index ${i}`
      );

      await Promise.all(
        chunkBatch.map(({ chunk, chunkIndex }) =>
          uploadChunkWithRetry(chunk, chunkIndex)
        )
      );
    }

    // Upload the last chunk separately to ensure we get the filename
    const lastChunk = chunks[chunks.length - 1];
    console.log("Uploading final chunk:", {
      chunkIndex: lastChunk.chunkIndex,
      size: lastChunk.chunk.size,
    });

    const finalResponse = await uploadChunkWithRetry(
      lastChunk.chunk,
      lastChunk.chunkIndex
    );

    console.log("Final chunk upload response:", finalResponse);
    return finalResponse.data?.fileName;
  } catch (error) {
    console.error("Chunked upload failed:", {
      error: error.message,
      fileId,
      uploadedChunks,
      totalChunks,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    console.log("Starting file upload:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    });

    try {
      const fileName = await uploadFileChunks(file, (progress) => {
        console.log(`Setting upload progress: ${progress}%`);
        setUploadProgress(progress);
      });

      if (!fileName) {
        console.error("Upload failed: No filename received from server");
        throw new Error("No filename received from server");
      }

      console.log("Upload completed successfully:", {
        originalName: file.name,
        serverFileName: fileName,
      });

      setUploadProgress(100);
      return fileName;
    } catch (error) {
      console.error("Upload failed:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
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
