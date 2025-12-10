import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
const galleryPath = path.join(process.cwd(), 'data', 'gallery.json');

// GET - Fetch categories with item counts
export async function GET() {
    try {
        // Read categories
        const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
        const categories = JSON.parse(categoriesData);

        // Read gallery items
        const galleryData = fs.readFileSync(galleryPath, 'utf8');
        const galleryItems = JSON.parse(galleryData);

        // Count items per category (only published)
        const publishedItems = galleryItems.filter(item => item.status === 'published');

        const categoriesWithCounts = categories.map(category => {
            let count = 0;

            if (category.id === 'all') {
                count = publishedItems.length;
            } else {
                count = publishedItems.filter(item => item.category === category.id).length;
            }

            return {
                ...category,
                count
            };
        });

        return NextResponse.json(categoriesWithCounts);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
