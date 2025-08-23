'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import CreatePost from '@/components/CreatePost';
import { Separator } from '@/components/ui/separator';

interface ImpactStory {
  id: number;
  district: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  image: string;
}

interface PostType {
  id: number;
  district: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  image: string;
}

const ImpactStoryFeed: React.FC = () => {
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/hk-game/data/impact-stories.json');
        if (!res.ok) throw new Error('Failed to fetch stories');
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error('Error loading stories:', err);
      }
    };

    fetchStories();
  }, []);

  const allPosts = [...posts, ...stories];

  // Hardcoded school map (replace with real data later)
  const schoolMap: Record<string, string> = {
    'school-1': 'Greenwood High',
    'school-2': 'Riverdale Elementary',
    'school-3': 'Sunnydale Middle School',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Heading and New Post Button aligned */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Impact Stories</h1>
        <CreatePost
          onSubmit={(post) => {
            const newPost: PostType = {
              id: Date.now(),
              district: schoolMap[post.schoolId || ''] || 'Unknown School',
              title: post.title,
              description: post.content,
              impact: post.impact,
              date: new Date().toISOString(),
              image: post.file ? URL.createObjectURL(post.file) : '/api/placeholder/300/200',
            };
            setPosts((prev) => [newPost, ...prev]);
          }}
        />
      </div>

      <Separator className="mb-8" />

      {allPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((story) => (
            <Card key={story.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                <p className="text-sm text-muted-foreground">{story.description}</p>
                <p className="text-sm font-medium text-primary">{story.impact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-sm mt-12">
          No stories available yet. Be the first to create one!
        </p>
      )}
    </div>
  );
};

export default ImpactStoryFeed;
