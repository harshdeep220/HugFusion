
import React, { useState, useCallback, useRef } from 'react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../constants';
import type { ImageFile } from '../types';
import { UploadIcon, ClearIcon } from './icons';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (file: ImageFile | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please use JPG, JPEG, or PNG.');
      onImageUpload(null);
      setImagePreview(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      onImageUpload(null);
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      onImageUpload({ dataUrl, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const onClear = () => {
    setImagePreview(null);
    onImageUpload(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const baseClasses = "w-full h-64 sm:h-80 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all duration-300 cursor-pointer";
  const inactiveClasses = "bg-white/20 border-white/50 text-white";
  const draggingClasses = "bg-white/40 border-white scale-105 shadow-2xl";

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`${baseClasses} ${isDragging ? draggingClasses : inactiveClasses}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept={ALLOWED_FILE_TYPES.join(',')}
          className="hidden"
        />
        {imagePreview ? (
            <div className="relative w-full h-full">
                <img src={imagePreview} alt={label} className="w-full h-full object-cover rounded-lg"/>
                <button 
                    onClick={(e) => { e.stopPropagation(); onClear(); }} 
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                    aria-label="Clear image"
                >
                    <ClearIcon />
                </button>
            </div>
        ) : (
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <UploadIcon />
            <span className="font-bold text-lg">{label}</span>
            <span className="text-sm">Drag & drop or click to upload</span>
            <span className="text-xs text-white/80">PNG, JPG, JPEG up to 10MB</span>
          </div>
        )}
      </div>
       {error && <p className="text-red-300 text-sm text-center bg-red-900/50 rounded-md py-1">{error}</p>}
    </div>
  );
};
