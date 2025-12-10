import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const galleryPath = path.join(process.cwd(), 'data', 'gallery.json');

// GET - Fetch gallery items with optional filtering
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');
        const status = searchParams.get('status') || 'published';
        const featured = searchParams.get('featured');

        // Read gallery data
        const data = fs.readFileSync(galleryPath, 'utf8');
        let items = JSON.parse(data);

        // Filter by status
        items = items.filter(item => item.status === status);

        // Filter by category
        if (category && category !== 'all') {
            items = items.filter(item => item.category === category);
        }

        // Filter by tag
        if (tag) {
            items = items.filter(item =>
                item.tags && item.tags.some(t =>
                    t.toLowerCase().includes(tag.toLowerCase())
                )
            );
        }

        // Filter by featured
        if (featured === 'true') {
            items = items.filter(item => item.featured === true);
        }

        // Sort by uploadedAt (newest first)
        items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

// POST - Create or update gallery item
export async function POST(request) {
    try {
        const item = await request.json();

        // Read existing data
        const data = fs.readFileSync(galleryPath, 'utf8');
        let items = JSON.parse(data);

        if (item.id) {
            // Update existing item
            const index = items.findIndex(i => i.id === item.id);
            if (index !== -1) {
                items[index] = {
                    ...items[index],
                    ...item,
                    updatedAt: new Date().toISOString()
                };
            } else {
                return NextResponse.json({ error: 'Item not found' }, { status: 404 });
            }
        } else {
            // Create new item
            const newItem = {
                id: `gallery-${Date.now()}`,
                title: item.title || '',
                description: item.description || '',
                imageUrl: item.imageUrl || '',
                thumbnailUrl: item.thumbnailUrl || item.imageUrl || '',

                uploadedBy: item.uploadedBy || 'Admin',
                uploadedAt: new Date().toISOString(),
                photographer: item.photographer || '',
                location: item.location || '',
                dateTaken: item.dateTaken || '',

                category: item.category || 'family',
                tags: item.tags || [],

                relatedTo: item.relatedTo || null,

                status: item.status || 'published',
                featured: item.featured || false,
                viewCount: 0
            };
            items.push(newItem);
        }

        // Save to file
        fs.writeFileSync(galleryPath, JSON.stringify(items, null, 2));

        return NextResponse.json({ success: true, items });
    } catch (error) {
        console.error('Error saving gallery item:', error);
        return NextResponse.json({ error: 'Failed to save gallery item' }, { status: 500 });
    }
}

// DELETE - Delete gallery item
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Read existing data
        const data = fs.readFileSync(galleryPath, 'utf8');
        let items = JSON.parse(data);

        // Filter out the item to delete
        const filteredItems = items.filter(item => item.id !== id);

        if (filteredItems.length === items.length) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Save to file
        fs.writeFileSync(galleryPath, JSON.stringify(filteredItems, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}
