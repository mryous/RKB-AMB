import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/settingsService';
import { revalidatePath } from 'next/cache';

export async function GET() {
    const settings = await settingsService.getSettings();
    return NextResponse.json(settings || {});
}

export async function POST(request) {
    try {
        const data = await request.json();
        const updatedSettings = await settingsService.saveSettings(data);
        revalidatePath('/');
        return NextResponse.json(updatedSettings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
