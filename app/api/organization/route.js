import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data', 'organization.json');

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
        const members = await readData();
        // Sort by order
        members.sort((a, b) => (a.order || 0) - (b.order || 0));
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newMember = await request.json();
        const members = await readData();

        // Generate ID if not provided
        if (!newMember.id) {
            newMember.id = Date.now().toString();
        }

        // Set default order if not provided
        if (newMember.order === undefined) {
            const maxOrder = members.reduce((max, m) => Math.max(max, m.order || 0), 0);
            newMember.order = maxOrder + 1;
        }

        members.push(newMember);
        await writeData(members);

        return NextResponse.json(newMember);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const updatedMember = await request.json();
        const members = await readData();

        const index = members.findIndex(m => m.id === updatedMember.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        members[index] = { ...members[index], ...updatedMember };
        await writeData(members);

        return NextResponse.json(members[index]);
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

        let members = await readData();
        members = members.filter(m => m.id !== id);
        await writeData(members);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
