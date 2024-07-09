"use client";
import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};
const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      onChange(acceptedFiles);
    },
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className=" file-upload">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="upload"
          className=" overflow-hidden max-h-[400px] object-cover"
        />
      ) : (
        <>
          <Image
            src={"/assets/icons/upload.svg"}
            width={32}
            height={32}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
                <span className="text-green-500">Click to upload</span> or drag and drop
            </p>
            <p>SVG, PNG, JPG, or GIF (max 800x400)</p>
          </div>
        </>
      )}
  
    </div>
  );
};

export default FileUploader;