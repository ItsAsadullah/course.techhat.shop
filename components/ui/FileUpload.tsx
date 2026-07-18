"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, X, File as FileIcon, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCloudinarySignature } from "@/lib/actions/cloudinary";

interface FileUploadProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  value?: string;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  folder?: string;
}

export default function FileUpload({
  onUpload,
  onRemove,
  value,
  label = "Upload File",
  accept = "image/*,application/pdf",
  maxSizeMB = 5,
  folder = "admissions"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // 1. Get signature from Server Action
      const { signature, timestamp } = await getCloudinarySignature(folder);
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

      if (!cloudName || !apiKey) {
        throw new Error("Cloudinary environment variables are missing");
      }

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      // 3. Upload to Cloudinary using XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUpload(response.secure_url);
          setIsUploading(false);
        } else {
          setError("Upload failed. Please try again.");
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred during upload.");
        setIsUploading(false);
      };

      xhr.send(formData);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsUploading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>}
      
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4"
          >
            <div className="flex items-center gap-4">
              {value.match(/\.(jpeg|jpg|gif|png)$/i) || value.includes("image/upload") ? (
                <img src={value} alt="Preview" className="w-16 h-16 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <FileIcon className="w-8 h-8 text-blue-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Document Uploaded Successfully</p>
                <div className="flex items-center gap-1.5 mt-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </div>
              </div>
              <button
                type="button"
                onClick={onRemove}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 text-center
              ${isDragging 
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/5" 
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50"}
              ${isUploading ? "pointer-events-none opacity-80" : ""}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={accept}
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
            
            <div className="flex flex-col items-center justify-center gap-3">
              {isUploading ? (
                <>
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-600">{progress}%</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uploading securely...</p>
                </>
              ) : (
                <>
                  <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors ${isDragging ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      PDF, JPG, PNG or GIF (Max. {maxSizeMB}MB)
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {error && (
              <div className="absolute bottom-3 inset-x-4">
                <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-500/10 py-1.5 px-3 rounded-lg inline-block">
                  {error}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
