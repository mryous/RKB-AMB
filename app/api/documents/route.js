import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data', 'documents.json');

async function readData() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    try {
        const documents = await readData();
        // Sort by uploadDate descending
        documents.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        return NextResponse.json(documents);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newDoc = await request.json();
        const documents = await readData();

        // Generate ID if not provided
        if (!newDoc.id) {
            newDoc.id = Date.now().toString();
        }

        // Set default date if not provided
        if (!newDoc.uploadDate) {
            newDoc.uploadDate = new Date().toISOString().split('T')[0];
        }

        documents.push(newDoc);
        await writeData(documents);

        return NextResponse.json(newDoc);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const updatedDoc = await request.json();
        const documents = await readData();

        const index = documents.findIndex(d => d.id === updatedDoc.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        documents[index] = { ...documents[index], ...updatedDoc };
        await writeData(documents);

        return NextResponse.json(documents[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        let documents = await readData();
        documents = documents.filter(d => d.id !== id);
        await writeData(documents);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
