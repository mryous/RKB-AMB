import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REUNIONS_FILE = path.join(process.cwd(), 'data', 'reunions.json');

// Ensure file exists
function ensureFileExists() {
    if (!fs.existsSync(REUNIONS_FILE)) {
        fs.writeFileSync(REUNIONS_FILE, JSON.stringify([], null, 2));
    }
}

// GET - Fetch all reunions
export async function GET() {
    try {
        ensureFileExists();
        const data = fs.readFileSync(REUNIONS_FILE, 'utf-8');
        const reunions = JSON.parse(data);
        return NextResponse.json(reunions);
    } catch (error) {
        console.error('Error reading reunions:', error);
        return NextResponse.json({ error: 'Failed to fetch reunions' }, { status: 500 });
    }
}

// POST - Create or Update reunion
export async function POST(request) {
    try {
        ensureFileExists();
        const reunion = await request.json();
        const data = fs.readFileSync(REUNIONS_FILE, 'utf-8');
        let reunions = JSON.parse(data);

        if (reunion.id) {
            // Update existing reunion
            const index = reunions.findIndex(r => r.id === reunion.id);
            if (index !== -1) {
                reunions[index] = reunion;
            } else {
                return NextResponse.json({ error: 'Reunion not found' }, { status: 404 });
            }
        } else {
            // Create new reunion
            reunion.id = Date.now().toString();
            reunion.createdAt = new Date().toISOString();
            reunions.push(reunion);
        }

        fs.writeFileSync(REUNIONS_FILE, JSON.stringify(reunions, null, 2));
        return NextResponse.json(reunion);
    } catch (error) {
        console.error('Error saving reunion:', error);
        return NextResponse.json({ error: 'Failed to save reunion' }, { status: 500 });
    }
}

// DELETE - Delete reunion
export async function DELETE(request) {
    try {
        ensureFileExists();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const data = fs.readFileSync(REUNIONS_FILE, 'utf-8');
        let reunions = JSON.parse(data);

        reunions = reunions.filter(r => r.id !== id);

        fs.writeFileSync(REUNIONS_FILE, JSON.stringify(reunions, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting reunion:', error);
        return NextResponse.json({ error: 'Failed to delete reunion' }, { status: 500 });
    }
}
