'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from '@/components/ui/sonner';

interface CreatePostProps {
  onSubmit?: (post: {
    title: string;
    content: string;
    impact: string;
    file?: File | null;
    district: string | null;        // <— changed from schoolId
  }) => void;
  triggerText?: string;
  triggerClassName?: string;
}

// District list from your JSON
const DISTRICTS = [
  'Central & Western','Wan Chai','Eastern','Southern','Yau Tsim Mong','Sham Shui Po',
  'Kowloon City','Wong Tai Sin','Kwun Tong','Tsuen Wan','Tuen Mun','Yuen Long',
  'North','Tai Po','Sha Tin','Kwai Tsing','Sai Kung','Islands',
];

const CreatePost: React.FC<CreatePostProps> = ({
  onSubmit,
  triggerText = '+ New Post',
  triggerClassName,
}) => {
  const [newPost, setNewPost] = useState({ title: '', content: '', impact: '' });
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null); // <—
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.impact.trim() || !selectedDistrict) return;

    onSubmit?.({
      ...newPost,
      file,
      district: selectedDistrict,     // <—
    });

    toast('Post published', {
      description: 'Your post has been published successfully.',
      action: { label: 'Undo', onClick: () => console.log('Undo') },
      position: 'top-center',
    });

    setNewPost({ title: '', content: '', impact: '' });
    setFile(null);
    setSelectedDistrict(null);
    setOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop, multiple: false, maxFiles: 1,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
  });

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-plant-growth text-white hover:bg-plant-growth/80 ${triggerClassName || ''}`}>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Post Title" value={newPost.title}
                 onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))} />

          <Input placeholder="Impact (e.g., '200 students reached')" value={newPost.impact}
                 onChange={(e) => setNewPost((p) => ({ ...p, impact: e.target.value }))} />

          {/* Target District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target District</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedDistrict ?? ''}
              onChange={(e) => setSelectedDistrict(e.target.value || null)}
            >
              <option value="">Select a district</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div {...getRootProps()}
               className={`border-2 border-dashed p-4 text-center cursor-pointer rounded-md ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            {isDragActive ? 'Drop the image here...' : 'Drag & drop an image here, or click to select one'}
          </div>

          {file && previewUrl && (
            <div className="mt-2 space-y-2">
              <div className="max-h-64 overflow-auto rounded border border-gray-300">
                <img src={previewUrl} alt="Preview" className="rounded border border-gray-300" />
              </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setFile(null)}>
                Remove Image
              </Button>
            </div>
          )}

          {fileRejections.length > 0 && (
            <p className="text-red-500 text-sm">Invalid file type or size. Only JPG/PNG files are allowed.</p>
          )}

          <Textarea placeholder="Event / Activity Description" rows={4} value={newPost.content}
                    onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))} />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!newPost.title.trim() || !newPost.content.trim() || !newPost.impact.trim() || !selectedDistrict}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;