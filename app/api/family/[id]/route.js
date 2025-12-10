import { NextResponse } from 'next/server';
import { familyService } from '@/lib/familyService';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const updatedMember = await familyService.updateMember(id, data);

        if (!updatedMember) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json(updatedMember);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update family member' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        await familyService.deleteMember(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
