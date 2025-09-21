'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { apiConfig, apiRequest } from '@/lib/api';

interface FileUploadProps {
  onFileUploaded: (
    fileUrl: string,
    fileSize: number,
    duration?: number
  ) => void;
  fileType?: 'audio' | 'image';
  accept?: string;
  maxSize?: number; // in bytes
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function FileUpload({
  onFileUploaded,
  fileType = 'audio',
  accept = 'audio/*',
  maxSize = 100 * 1024 * 1024, // 100MB default
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxSize) {
      setError(
        `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      );
      return;
    }

    // Validate file type
    if (fileType === 'audio' && !selectedFile.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }

    if (fileType === 'image' && !selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Step 1: Get pre-signed URL from backend
      const { upload_url, file_url } = await apiRequest(
        apiConfig.endpoints.presignedUrl,
        {
          method: 'POST',
          body: JSON.stringify({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
          }),
        }
      );

      // Step 2: Upload file directly to DigitalOcean Spaces
      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Step 3: Get file duration for audio files
      let duration = 0;
      if (fileType === 'audio') {
        duration = await getAudioDuration(file);
      }

      setSuccess(true);
      onFileUploaded(file_url, file.size, duration);

      // Reset form
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise(resolve => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve(Math.round(audio.duration));
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve(0);
      });

      audio.src = url;
    });
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">
          Upload {fileType === 'audio' ? 'Audio' : 'Image'} File
        </Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="flex-1"
          />
          {file && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Max size: {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      </div>

      {file && (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
                {fileType === 'audio' && file.type.startsWith('audio/') && (
                  <span className="ml-2">• {file.type}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {success && <CheckCircle className="h-5 w-5 text-green-500" />}
              {error && <AlertCircle className="h-5 w-5 text-red-500" />}
            </div>
          </div>

          {uploadProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
              File uploaded successfully!
            </div>
          )}

          <Button
            type="button"
            onClick={uploadFile}
            disabled={uploading || success}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : success ? 'Uploaded' : 'Upload File'}
          </Button>
        </div>
      )}
    </div>
  );
}
