"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/dashboard/tiptap";
import { useCreatePost } from "@/hooks/usePosts";
import CategorySelector from "@/components/CategorySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostStatus } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CreatePost() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [status] = useState<PostStatus>("draft");
    const [content, setContent] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [author, setAuthor] = useState("Admin"); // Default author
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createPost = useCreatePost();

    // Auto-generate slug from title
    const handleTitleChange = (value: string) => {
        setTitle(value);
        const generatedSlug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setSlug(generatedSlug);
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setThumbnail(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setThumbnailPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content) {
            alert("Please fill in title and content");
            return;
        }

        setIsSubmitting(true);

        try {
            let thumbnailUrl = "";

            // Upload thumbnail if selected
            if (thumbnail) {
                const formData = new FormData();
                formData.append('file', thumbnail);

                const uploadResponse = await fetch('/api/upload/thumbnail', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    thumbnailUrl = uploadResult.url;
                }
            }

            const postData = {
                title: title.trim(),
                slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                status,
                content,
                author,
                thumbnail: thumbnailUrl,
                categoryIds: selectedCategories
            };

            await createPost.mutateAsync(postData);
            alert("Post created successfully!");
            router.push("/admin/posts");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 max-w-8xl grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="col-span-3">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Create New Post</h1>
                    <p className="text-gray-600">Fill in the details below to create a new post</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-lg font-bold mb-2">
                            Title *
                        </label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter post title..."
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-lg font-bold mb-2">
                            Slug
                        </label>
                        <Input
                            id="slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="auto-generated-from-title"
                        />
                        <p className="text-xs text-ring mt-1">URL-friendly version of the title</p>
                    </div>

                    {/* Author */}
                    <div>
                        <label htmlFor="author" className="block text-lg font-bold mb-2">
                            Author *
                        </label>
                        <Input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Author name..."
                            required
                        />
                    </div>



                    {/* Status
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Status *
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="draft"
                                checked={status === "draft"}
                                onChange={(e) => setStatus(e.target.value as PostStatus)}
                                className="mr-2"
                            />
                            Draft
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="published"
                                checked={status === "published"}
                                onChange={(e) => setStatus(e.target.value as PostStatus)}
                                className="mr-2"
                            />
                            Published
                        </label>
                    </div>
                </div> */}



                    {/* Content Editor */}
                    <div>
                        <label className="block text-lg font-bold mb-2">
                            Content *
                        </label>
                        <TiptapEditor
                            onChange={setContent}
                            placeholder="Write your UAV/drone content here. Share insights, reviews, tutorials, or news about the drone industry..."
                            characterLimit={15000}
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6"
                        >
                            {isSubmitting ? "Creating..." : "Create Post"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/posts")}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
            <div className="col-span-1 space-y-4">
                {/* Thumbnail Upload */}

                <Card className="bg-white min-h-64">
                    <CardHeader className="font-sans bg-popover shadow-b-md">

                        <label htmlFor="thumbnail" className="block text-lg font-serif font-bold">
                            Featured Image (Thumbnail)
                        </label>
                    </CardHeader>
                    <CardContent>

                        <div className="space-y-4">
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-xs file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                            {thumbnailPreview && (
                                <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="w-full max-w-md h-48 object-cover rounded-xs border"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            setThumbnail(null);
                                            setThumbnailPreview("");
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                            <p className="text-xs text-gray-500">
                                Upload a featured image for your post. Recommended size: 1200x630px
                            </p>
                        </div>
                    </CardContent>
                </Card>
                {/* Categories */}
                <Card className="bg-white">
                    <CardHeader className="font-serif bg-popover">

                        <label className="block text-lg font-bold">
                            Categories
                        </label>
                    </CardHeader>
                    <CardContent>

                        <CategorySelector
                            selectedCategories={selectedCategories}
                            onCategoryToggle={handleCategoryToggle}
                        />
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}