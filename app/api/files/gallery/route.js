import { NextResponse } from 'next/server';
import path from 'path';
import { scanDirectory, formatFileSize } from '@/lib/fileUtils';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filterType = searchParams.get('type') || 'all';

        // Get public directory path
        const publicDir = path.join(process.cwd(), 'public');

        // Scan all files in public directory
        let files = await scanDirectory(publicDir, publicDir);

        // Filter by type if specified
        if (filterType !== 'all') {
            files = files.filter(file => file.type === filterType);
        }

        // Sort by modified date (newest first)
        files.sort((a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate));

        // Format file sizes for display
        const filesWithFormattedSize = files.map(file => ({
            ...file,
            formattedSize: formatFileSize(file.size)
        }));

        // Calculate statistics
        const stats = {
            totalFiles: files.length,
            totalSize: files.reduce((sum, file) => sum + file.size, 0),
            formattedTotalSize: formatFileSize(files.reduce((sum, file) => sum + file.size, 0)),
            byType: {
                image: files.filter(f => f.type === 'image').length,
                document: files.filter(f => f.type === 'document').length,
                video: files.filter(f => f.type === 'video').length,
                audio: files.filter(f => f.type === 'audio').length,
                other: files.filter(f => f.type === 'other').length
            }
        };

        return NextResponse.json({
            success: true,
            files: filesWithFormattedSize,
            stats
        });
    } catch (error) {
        console.error('Error fetching files:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch files' },
            { status: 500 }
        );
    }
}
