"use client";

import { useFormContext, useWatch } from "react-hook-form";
import FileUpload from "@/components/ui/FileUpload";
import { labelCls } from "../shared";

interface FileUploadFieldProps {
  name: string;
  label: string;
  /** Cloudinary folder, e.g. "courses" | "trainers". */
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
}

/**
 * Bridges the controlled <FileUpload> (Cloudinary) to a react-hook-form field.
 * Writing with { shouldDirty: true } triggers the wizard's watch → autosave.
 */
export function FileUploadField({
  name,
  label,
  folder = "courses",
  accept = "image/*",
  maxSizeMB = 5,
}: FileUploadFieldProps) {
  const { control, setValue } = useFormContext();
  const value: string = useWatch({ control, name }) || "";

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <FileUpload
        value={value}
        folder={folder}
        accept={accept}
        maxSizeMB={maxSizeMB}
        onUpload={(url) => setValue(name, url, { shouldDirty: true })}
        onRemove={() => setValue(name, "", { shouldDirty: true })}
      />
    </div>
  );
}
