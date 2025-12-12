import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { settingsService } from '@/lib/settingsService';

export async function PUT(request) {
    try {
        // Check authentication
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { username, email, phone, avatar, currentPassword, newPassword } = body;

        // Get current settings
        const settings = await settingsService.getSettings();

        // If changing password, verify current password
        if (newPassword) {
            const currentStoredPassword = settings.general?.adminPassword || '';
            if (currentPassword !== currentStoredPassword) {
                return NextResponse.json(
                    { error: 'Password saat ini tidak sesuai' },
                    { status: 400 }
                );
            }
        }

        // Update settings
        const updatedSettings = {
            ...settings,
            general: {
                ...settings.general,
                adminUsername: username,
                adminEmail: email,
                adminPhone: phone || '',
                adminAvatar: avatar || '',
                // Only update password if new password is provided
                adminPassword: newPassword || settings.general?.adminPassword
            }
        };

        await settingsService.saveSettings(updatedSettings);

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
