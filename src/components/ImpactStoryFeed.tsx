'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';

import CreatePost from '@/components/CreatePost';
import EditPost, { ImpactStory } from '@/components/EditPost';
import { Eye, Target } from 'lucide-react';

interface PostType extends ImpactStory {}

const ImpactStoryFeed: React.FC = () => {
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);

  // Edit dialog state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ImpactStory | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/hk-game/data/impact-stories.json');
        if (!res.ok) throw new Error('Failed to fetch stories');
        const data = await res.json();
        const storiesWithViews = data.map((story: ImpactStory) => ({
            ...story,
            views: Math.floor(Math.random() * 51), // random between 0-50
        }));

        setStories(storiesWithViews);
      } catch (err) {
        console.error('Error loading stories:', err);
      }
    };
    fetchStories();
  }, []);

  // Combine user-created posts (local) with seed stories (fetched)
  const allPosts = useMemo(() => [...posts, ...stories], [posts, stories]);

  // Handlers for editor
  const onSave = (updated: ImpactStory) => {
    setPosts(prev =>
      prev.some(p => p.id === updated.id)
        ? prev.map(p => (p.id === updated.id ? updated : p))
        : prev
    );
    setStories(prev =>
      prev.some(s => s.id === updated.id)
        ? prev.map(s => (s.id === updated.id ? updated : s))
        : prev
    );
  };

  const onDelete = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setStories(prev => prev.filter(s => s.id !== id));
  };

  return (
    <Card className="shadow-soft">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 pt-4">
            <CardTitle className="flex items-center text-lg sm:text-xl">
                <Target className="w-5 h-5 mr-2 text-plant-growth" />
                Impact Stories
            </CardTitle>
            <CreatePost
                triggerText="+ New Post"
                triggerClassName="bg-[#8B5E3C] hover:bg-[#6E4428] text-white px-6 py-2 rounded"
                onSubmit={(post) => {
                const newPost: PostType = {
                    id: Date.now(),
                    district: post.district || 'Unknown District',
                    title: post.title,
                    description: post.content,
                    impact: post.impact,
                    date: new Date().toISOString(),
                    image: post.file ? URL.createObjectURL(post.file) : '/api/placeholder/300/200',
                    views: Math.floor(Math.random() * 51),
                };
                setPosts(prev => [newPost, ...prev]);
                }}
            />
            </CardHeader>

          <CardContent>
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-10">{/* tighter to navbar */}

            <Separator className="mb-8" />

            {allPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {allPosts.map((story) => (
                    <Card
                    key={story.id}
                    className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    role="button"
                    aria-label={`Edit ${story.title}`}
                    onClick={() => {
                        setEditing(story);
                        setOpen(true);
                    }}
                    >
                    <CardHeader className="relative p-0">
                        <AspectRatio ratio={3 / 2}>
                        <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover"
                        />
                        </AspectRatio>
                        <Badge
                        className="absolute top-3 left-3 z-10 text-xs bg-primary text-white"
                        variant="default"
                        >
                        {story.district}
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                        {story.description}
                        </p>
                        <p className="text-sm font-medium text-primary">
                            {story.impact} 
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" /> {story.views ?? 0} views
                        </p>
                    </CardContent>
                    </Card>
                ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground text-sm mt-12">
                No stories available yet. Add an update!
                </p>
            )}

            {/* Edit / Delete dialog */}
            <EditPost
                open={open}
                setOpen={setOpen}
                editing={editing}
                setEditing={setEditing}
                onSave={onSave}
                onDelete={onDelete}
            />
            </div>
        </CardContent>
    </Card>
  );
};

export default ImpactStoryFeed;