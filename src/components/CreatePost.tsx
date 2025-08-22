import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; 
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "@/components/ui/sonner";

interface NewPostDialogProps {
  onSubmit?: (post: {
    title: string;
    content: string;
    file?: File | null;
    schoolId: string | null;
  }) => void;
  triggerText?: string;
}

const NewPostDialog: React.FC<NewPostDialogProps> = ({
  onSubmit,
  triggerText = "+ New Post",
}) => {
    // Hardcoded list of schools
    const schools = [
        { id: "school-1", name: "Greenwood High" },
        { id: "school-2", name: "Riverdale Elementary" },
        { id: "school-3", name: "Sunnydale Middle School" },
    ];

    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = () => {
        if (!newPost.title.trim() || !newPost.content.trim() || !selectedSchool) return;

        onSubmit?.({ ...newPost, file, schoolId: selectedSchool });

        toast("Post published", {
        description: "Your post has been published successfully.",
        action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
        },
        position: "top-center"
    });

    setNewPost({ title: "", content: "" });
    setFile(null);
    setSelectedSchool(null);
    setOpen(false);
    };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  // Memoize preview URL
  const previewUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : null;
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

   return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-plant-growth text-white hover:bg-plant-growth/80">
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target School
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedSchool ?? ""}
              onChange={(e) => setSelectedSchool(e.target.value || null)}
            >
              <option value="">Select a school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-4 text-center cursor-pointer rounded-md ${
              isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive
              ? "Drop the image here..."
              : "Drag & drop an image here, or click to select one"}
          </div>

          {file && previewUrl && (
            <div className="mt-2 space-y-2">
              <div className="max-h-64 overflow-auto rounded border border-gray-300">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded border border-gray-300"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setFile(null)}
              >
                Remove Image
              </Button>
            </div>
          )}

          {fileRejections.length > 0 && (
            <p className="text-red-500 text-sm">
              Invalid file type or size. Only JPG/PNG files are allowed.
            </p>
          )}

          <Textarea
            placeholder="Event/ Activity Description"
            rows={4}
            value={newPost.content}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              !newPost.title.trim() ||
              !newPost.content.trim() ||
              !selectedSchool
            }
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewPostDialog;