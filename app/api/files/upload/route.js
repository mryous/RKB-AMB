import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { generateUniqueFilename, validateFileType } from '@/lib/fileUtils';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.mp4', '.webm', '.mp3'
];

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
        }

        // Validate file type
        if (!validateFileType(file, ALLOWED_TYPES)) {
            return NextResponse.json(
                { success: false, error: 'File type not allowed' },
                { status: 400 }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (error) {
            // Directory might already exist, ignore error
        }

        // Generate unique filename
        const uniqueFilename = await generateUniqueFilename(file.name, uploadsDir);
        const filePath = path.join(uploadsDir, uniqueFilename);

        // Convert file to buffer and write to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Generate URL path
        const urlPath = `/uploads/${uniqueFilename}`;

        return NextResponse.json({
            success: true,
            file: {
                name: uniqueFilename,
                originalName: file.name,
                size: file.size,
                type: file.type,
                url: urlPath,
                path: filePath
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
