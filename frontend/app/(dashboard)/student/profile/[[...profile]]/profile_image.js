import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Camera, X, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ProfileImageSection = ({ userProfile, userDetail, onImageUpdate }) => {
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set proper canvas dimensions, making sure we have a square
    const size = Math.min(pixelCrop.width, pixelCrop.height);
    canvas.width = size;
    canvas.height = size;

    // Fill with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factor to maintain aspect ratio
    const scale = Math.max(
      canvas.width / image.width,
      canvas.height / image.height
    );

    // Calculate dimensions after scaling
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    // Calculate positioning to center the image
    const dx = (canvas.width - scaledWidth) / 2;
    const dy = (canvas.height - scaledHeight) / 2;

    // Apply rotation if needed
    if (rotation !== 0) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Draw the image with proper scaling and positioning
    ctx.drawImage(image, dx, dy, scaledWidth, scaledHeight);

    if (rotation !== 0) {
      ctx.restore();
    }

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      const croppedFile = new File([croppedBlob], originalFile.name, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });

      await onImageUpdate(croppedFile);

      setIsModalOpen(false);
      setImageSrc(null);
      setOriginalFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    } catch (error) {
      console.error("Error saving cropped image:", error);
    }
  };

  return (
    <>
      <div className="relative group">
        <button
          onClick={handleButtonClick}
          className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
        >
          <Avatar className="h-24 w-24 ring-2 ring-white/20 group-hover:ring-blue-500/50 transition-all duration-300">
            <AvatarImage
              src={userProfile.avatarUrl}
              alt="Profile"
              className="object-fit rounded-full"
            />
            <AvatarFallback>
              {`${userDetail.user.first_name.charAt(
                0
              )} ${userDetail.user.last_name.charAt(0)}`}
            </AvatarFallback>
          </Avatar>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          onClick={handleButtonClick}
          className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 group-hover:scale-110"
          aria-label="Upload new profile picture"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-lg font-semibold mb-4">
            Edit Profile Picture
          </DialogTitle>

          <div className="relative h-96 w-full">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2 w-1/3">
              <label htmlFor="zoom" className="text-sm font-medium">
                Zoom
              </label>
              <input
                id="zoom"
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col items-center gap-2 w-1/3">
              <label htmlFor="rotation" className="text-sm font-medium">
                Rotation
              </label>
              <input
                id="rotation"
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-label="Rotation"
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileImageSection;
