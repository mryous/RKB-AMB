import { NextResponse } from 'next/server';
import { familyService } from '@/lib/familyService';

export async function GET() {
    try {
        const members = await familyService.getAllMembers();
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch family members' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newMember = await familyService.createMember(data);
        return NextResponse.json(newMember, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create family member' }, { status: 500 });
    }
}
