import { NextResponse } from 'next/server';
import { blogService } from '@/lib/blogService';

export async function GET() {
    const posts = await blogService.getAllPosts();
    return NextResponse.json(posts);
}

export async function POST(request) {
    const data = await request.json();
    const post = await blogService.savePost(data);
    return NextResponse.json(post);
}
