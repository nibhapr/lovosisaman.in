import { useState } from 'react';
import Image from 'next/image';
import { IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  index?: number;
}

export default function ImageUpload({ value, onChange, label = 'Image', index = 0 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
          {value ? (
            <>
              <Image
                src={value}
                alt="Upload preview"
                fill
                sizes="(max-width: 96px) 100vw, 96px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <IoTrashOutline className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <IoCloudUploadOutline className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id={`image-upload-${label}-${index}`}
          />
          <label
            htmlFor={`image-upload-${label}-${index}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </label>
        </div>
      </div>
    </div>
  );
} 