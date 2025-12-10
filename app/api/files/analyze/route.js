import { NextResponse } from 'next/server';
import path from 'path';
import { scanDirectory, findFileReferences, formatFileSize } from '@/lib/fileUtils';

export async function GET(request) {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const dataDir = path.join(process.cwd(), 'data');

        // Scan all files in public directory
        const allFiles = await scanDirectory(publicDir, publicDir);

        // Analyze each file for references
        const analyzedFiles = await Promise.all(
            allFiles.map(async (file) => {
                const references = await findFileReferences(file.name, dataDir);
                const isUsed = references.length > 0;
                const totalReferences = references.reduce((sum, ref) => sum + ref.count, 0);

                return {
                    ...file,
                    isUsed,
                    references,
                    totalReferences
                };
            })
        );

        // Separate used and unused files
        const usedFiles = analyzedFiles.filter(f => f.isUsed);
        const unusedFiles = analyzedFiles.filter(f => !f.isUsed);

        // Calculate statistics
        const unusedSize = unusedFiles.reduce((sum, file) => sum + file.size, 0);
        const usedSize = usedFiles.reduce((sum, file) => sum + file.size, 0);
        const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);

        const stats = {
            total: {
                files: allFiles.length,
                size: totalSize,
                formattedSize: formatFileSize(totalSize)
            },
            used: {
                files: usedFiles.length,
                size: usedSize,
                formattedSize: formatFileSize(usedSize)
            },
            unused: {
                files: unusedFiles.length,
                size: unusedSize,
                formattedSize: formatFileSize(unusedSize),
                percentage: totalSize > 0 ? ((unusedSize / totalSize) * 100).toFixed(2) : 0
            }
        };

        return NextResponse.json({
            success: true,
            stats,
            usedFiles: usedFiles.map(f => ({
                ...f,
                formattedSize: formatFileSize(f.size)
            })),
            unusedFiles: unusedFiles.map(f => ({
                ...f,
                formattedSize: formatFileSize(f.size)
            }))
        });
    } catch (error) {
        console.error('Error analyzing files:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to analyze files' },
            { status: 500 }
        );
    }
}
