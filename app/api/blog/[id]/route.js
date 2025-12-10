import { NextResponse } from 'next/server';
import { blogService } from '@/lib/blogService';

export async function GET(request, { params }) {
    const { id } = await params;
    const post = await blogService.getPostById(id);
    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const data = await request.json();
    const post = await blogService.savePost({ ...data, id });
    return NextResponse.json(post);
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    await blogService.deletePost(id);
    return NextResponse.json({ success: true });
}
