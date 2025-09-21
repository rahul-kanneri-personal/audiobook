'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { FileUpload } from '@/components/admin/file-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { apiConfig, apiRequest } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AudioFile {
  id?: string;
  chapter_number: number;
  chapter_title: string;
  file_url: string;
  duration_seconds: number;
  file_size_bytes: number;
  mime_type: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

export default function CreateAudiobookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    isbn: '',
    description: '',
    ai_summary: '',
    duration_seconds: 0,
    price_cents: 0,
    sample_url: '',
    cover_image_url: '',
    publication_date: '',
    language: 'en',
    author_name: '',
    narrator_name: '',
    category_ids: [] as string[],
  });

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiRequest(apiConfig.endpoints.categories);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      category_ids: checked
        ? [...prev.category_ids, categoryId]
        : prev.category_ids.filter(id => id !== categoryId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create audiobook
      const audiobook = await apiRequest(apiConfig.endpoints.audiobooks, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Create audio files
      for (const audioFile of audioFiles) {
        await apiRequest(apiConfig.endpoints.audioFiles, {
          method: 'POST',
          body: JSON.stringify({
            ...audioFile,
            audiobook_id: audiobook.id,
          }),
        });
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating audiobook:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAudioFile = () => {
    const newAudioFile: AudioFile = {
      chapter_number: audioFiles.length + 1,
      chapter_title: `Chapter ${audioFiles.length + 1}`,
      file_url: '',
      duration_seconds: 0,
      file_size_bytes: 0,
      mime_type: 'audio/mpeg',
    };
    setAudioFiles(prev => [...prev, newAudioFile]);
  };

  const removeAudioFile = (index: number) => {
    setAudioFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateAudioFile = (
    index: number,
    field: keyof AudioFile,
    value: string | number
  ) => {
    setAudioFiles(prev =>
      prev.map((file, i) => (i === index ? { ...file, [field]: value } : file))
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Audiobook
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Add a new audiobook to your catalog.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Audiobook title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="audiobook-slug"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author_name">Author *</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        author_name: e.target.value,
                      }))
                    }
                    placeholder="Author name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="narrator_name">Narrator</Label>
                  <Input
                    id="narrator_name"
                    value={formData.narrator_name}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        narrator_name: e.target.value,
                      }))
                    }
                    placeholder="Narrator name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, isbn: e.target.value }))
                    }
                    placeholder="ISBN number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    placeholder="en"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Audiobook description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Media */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_cents">Price (cents) *</Label>
                  <Input
                    id="price_cents"
                    type="number"
                    value={formData.price_cents}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        price_cents: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="1299"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_seconds">Duration (seconds)</Label>
                  <Input
                    id="duration_seconds"
                    type="number"
                    value={formData.duration_seconds}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        duration_seconds: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="16200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publication_date">Publication Date</Label>
                  <Input
                    id="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        publication_date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <FileUpload
                    fileType="image"
                    accept="image/*"
                    maxSize={10 * 1024 * 1024} // 10MB
                    onFileUploaded={fileUrl => {
                      setFormData(prev => ({
                        ...prev,
                        cover_image_url: fileUrl,
                      }));
                    }}
                  />
                  {formData.cover_image_url && (
                    <div className="text-sm text-gray-600">
                      <p>Cover Image URL: {formData.cover_image_url}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Sample Audio</Label>
                  <FileUpload
                    fileType="audio"
                    accept="audio/*"
                    maxSize={50 * 1024 * 1024} // 50MB
                    onFileUploaded={fileUrl => {
                      setFormData(prev => ({ ...prev, sample_url: fileUrl }));
                    }}
                  />
                  {formData.sample_url && (
                    <div className="text-sm text-gray-600">
                      <p>Sample Audio URL: {formData.sample_url}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Select Categories</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.id}
                        checked={formData.category_ids.includes(category.id)}
                        onCheckedChange={checked =>
                          handleCategoryChange(category.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={category.id} className="text-sm">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.category_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.category_ids.map(categoryId => {
                      const category = categories.find(
                        c => c.id === categoryId
                      );
                      return (
                        <Badge key={categoryId} variant="secondary">
                          {category?.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Audio Files */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={addAudioFile}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Audio File
              </Button>

              {audioFiles.map((audioFile, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Chapter {audioFile.chapter_number}
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAudioFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chapter Title</Label>
                      <Input
                        value={audioFile.chapter_title}
                        onChange={e =>
                          updateAudioFile(
                            index,
                            'chapter_title',
                            e.target.value
                          )
                        }
                        placeholder="Chapter title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chapter Number</Label>
                      <Input
                        type="number"
                        value={audioFile.chapter_number}
                        onChange={e =>
                          updateAudioFile(
                            index,
                            'chapter_number',
                            parseInt(e.target.value) || 1
                          )
                        }
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (seconds)</Label>
                      <Input
                        type="number"
                        value={audioFile.duration_seconds}
                        onChange={e =>
                          updateAudioFile(
                            index,
                            'duration_seconds',
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="3600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>File Size (bytes)</Label>
                      <Input
                        type="number"
                        value={audioFile.file_size_bytes}
                        onChange={e =>
                          updateAudioFile(
                            index,
                            'file_size_bytes',
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="50000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Audio File</Label>
                    <FileUpload
                      fileType="audio"
                      accept="audio/*"
                      onFileUploaded={(fileUrl, fileSize, duration) => {
                        updateAudioFile(index, 'file_url', fileUrl);
                        updateAudioFile(index, 'file_size_bytes', fileSize);
                        if (duration) {
                          updateAudioFile(index, 'duration_seconds', duration);
                        }
                      }}
                    />
                    {audioFile.file_url && (
                      <div className="text-sm text-gray-600">
                        <p>File URL: {audioFile.file_url}</p>
                        <p>
                          Size:{' '}
                          {Math.round(audioFile.file_size_bytes / 1024 / 1024)}
                          MB
                        </p>
                        {audioFile.duration_seconds > 0 && (
                          <p>
                            Duration:{' '}
                            {Math.floor(audioFile.duration_seconds / 60)}:
                            {(audioFile.duration_seconds % 60)
                              .toString()
                              .padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Audiobook'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
