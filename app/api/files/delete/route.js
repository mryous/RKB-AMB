import { NextResponse } from 'next/server';
import path from 'path';
import { deleteFile } from '@/lib/fileUtils';
import fs from 'fs';

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get('path');

        if (!filePath) {
            return NextResponse.json(
                { success: false, error: 'No file path provided' },
                { status: 400 }
            );
        }

        // Security: Ensure file is within public directory
        const publicDir = path.join(process.cwd(), 'public');
        const absolutePath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''));

        // Check if path is within public directory
        if (!absolutePath.startsWith(publicDir)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file path' },
                { status: 403 }
            );
        }

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            return NextResponse.json(
                { success: false, error: 'File not found' },
                { status: 404 }
            );
        }

        // Delete the file
        const deleted = await deleteFile(absolutePath);

        if (deleted) {
            return NextResponse.json({
                success: true,
                message: 'File deleted successfully'
            });
        } else {
            return NextResponse.json(
                { success: false, error: 'Failed to delete file' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
