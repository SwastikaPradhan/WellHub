"use client";

import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { ID, storage } from "@/lib/appwrite";

const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_URL!;

interface ImageUploadProps {
  onImageSelect: (file: File, appwriteUrl: string) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string); // show selected image immediately
    };
    reader.readAsDataURL(file);

    try {
      // Upload to Appwrite
      const id = ID.unique();
      const response = await storage.createFile(bucketId, id, file);

      const appwriteUrl = `${endpoint}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${projectId}`;
      setFileId(response.$id);
      onImageSelect(file, appwriteUrl); // Pass file + hosted URL back to parent
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setFileId(null);
  };

  return (
    <div className="relative">
      <label className="absolute bottom-4 left-4 cursor-pointer text-2xl">
        <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        <IoMdAdd />
      </label>

      {previewUrl && (
        <div className="mt-2 relative inline-block">
          <img src={previewUrl} alt="Preview" className="max-h-40 rounded border" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 shadow hover:bg-red-100"
            title="Remove image"
          >
            <RxCross2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

