'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/sonner';

export interface ImpactStory {
  id: number;
  district: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  image: string; // '' when no image
}

interface EditPostProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  editing: ImpactStory | null;
  setEditing: (p: ImpactStory | null) => void;
  onSave: (post: ImpactStory) => void;
  onDelete: (id: number) => void;
}

// District list from your JSON
const DISTRICTS = [
  'Central & Western','Wan Chai','Eastern','Southern','Yau Tsim Mong','Sham Shui Po',
  'Kowloon City','Wong Tai Sin','Kwun Tong','Tsuen Wan','Tuen Mun','Yuen Long',
  'North','Tai Po','Sha Tin','Kwai Tsing','Sai Kung','Islands',
];

const EditPost: React.FC<EditPostProps> = ({ open, setOpen, editing, setEditing, onSave, onDelete }) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop, multiple: false, maxFiles: 1,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
  });

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return editing?.image || null;
  }, [file, editing]);

  useEffect(() => () => { if (file && previewUrl) URL.revokeObjectURL(previewUrl); }, [file]);

  if (!editing) return null;

  const setField = <K extends keyof ImpactStory>(k: K, v: ImpactStory[K]) => setEditing({ ...editing, [k]: v });

  const handleSave = () => {
    const updated: ImpactStory = { ...editing, image: file ? (previewUrl as string) : editing.image };
    onSave(updated);
    toast('Post updated', { description: 'Your changes have been saved successfully.', position: 'top-center' });
    setFile(null); setOpen(false);
  };

  const handleDelete = () => {
    onDelete(editing.id);
    toast('Post deleted', { description: `"${editing.title}" has been removed.`, position: 'top-center' });
    setFile(null); setOpen(false);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setEditing({ ...editing, image: '' });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setFile(null); setOpen(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Post Title" value={editing.title} onChange={(e) => setField('title', e.target.value)} />
          <Input placeholder="Impact (e.g., '200 students reached')" value={editing.impact}
                 onChange={(e) => setField('impact', e.target.value)} />

          {/* Target District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target District</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={editing.district}
              onChange={(e) => setField('district', e.target.value)}
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
            {isDragActive ? 'Drop the new image here...' : 'Drag & drop a new image here, or click to select one'}
          </div>

          {(file || editing.image) && (
            <div className="mt-2 space-y-2">
              <div className="max-h-64 overflow-auto rounded border border-gray-300">
                <img src={file ? (previewUrl as string) : editing.image} alt="Preview" className="rounded border border-gray-300" />
              </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleRemoveImage}>
                Remove Image
              </Button>
            </div>
          )}

          {fileRejections.length > 0 && (
            <p className="text-red-500 text-sm">Invalid file type or size. Only JPG/PNG files are allowed.</p>
          )}

          <Textarea placeholder="Event / Activity Description" rows={4} value={editing.description}
                    onChange={(e) => setField('description', e.target.value)} />
        </div>

        <DialogFooter className="flex w-full justify-between">
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={!editing.title.trim() || !editing.description.trim() || !editing.impact.trim() || !editing.district}
            >
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPost;