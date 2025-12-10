import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

/**
 * Recursively scan directory and return all files with metadata
 * @param {string} dirPath - Directory path to scan
 * @param {string} basePath - Base path for relative path calculation
 * @returns {Promise<Array>} Array of file objects
 */
export async function scanDirectory(dirPath, basePath = dirPath) {
    const files = [];

    try {
        const items = await readdir(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stats = await stat(fullPath);

            if (stats.isDirectory()) {
                // Recursively scan subdirectories
                const subFiles = await scanDirectory(fullPath, basePath);
                files.push(...subFiles);
            } else if (stats.isFile()) {
                const relativePath = path.relative(basePath, fullPath);
                const urlPath = '/' + relativePath.replace(/\\/g, '/');

                files.push({
                    name: item,
                    path: fullPath,
                    relativePath: relativePath,
                    urlPath: urlPath,
                    size: stats.size,
                    type: getFileType(item),
                    extension: path.extname(item).toLowerCase(),
                    uploadDate: stats.birthtime,
                    modifiedDate: stats.mtime
                });
            }
        }
    } catch (error) {
        console.error(`Error scanning directory ${dirPath}:`, error);
    }

    return files;
}

/**
 * Get file metadata
 * @param {string} filePath - File path
 * @returns {Promise<Object>} File metadata
 */
export async function getFileMetadata(filePath) {
    try {
        const stats = await stat(filePath);
        const fileName = path.basename(filePath);

        return {
            name: fileName,
            path: filePath,
            size: stats.size,
            type: getFileType(fileName),
            extension: path.extname(fileName).toLowerCase(),
            uploadDate: stats.birthtime,
            modifiedDate: stats.mtime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
        };
    } catch (error) {
        throw new Error(`Error getting file metadata: ${error.message}`);
    }
}

/**
 * Find file references in JSON data files and codebase
 * @param {string} fileName - File name to search for
 * @param {string} dataDir - Data directory path
 * @returns {Promise<Array>} Array of references
 */
export async function findFileReferences(fileName, dataDir) {
    const references = [];

    try {
        // Search in JSON files
        const jsonFiles = await scanDirectory(dataDir);

        for (const file of jsonFiles) {
            if (file.extension === '.json') {
                try {
                    const content = await readFile(file.path, 'utf-8');

                    // Check if file name appears in content
                    if (content.includes(fileName)) {
                        // Count occurrences
                        const regex = new RegExp(fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                        const matches = content.match(regex);

                        references.push({
                            file: file.relativePath,
                            type: 'data',
                            count: matches ? matches.length : 0
                        });
                    }
                } catch (error) {
                    console.error(`Error reading ${file.path}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error finding file references:', error);
    }

    return references;
}

/**
 * Format bytes to readable size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Validate file type
 * @param {Object} file - File object
 * @param {Array} allowedTypes - Array of allowed MIME types or extensions
 * @returns {boolean} True if valid
 */
export function validateFileType(file, allowedTypes) {
    if (!file || !allowedTypes || allowedTypes.length === 0) {
        return true;
    }

    const fileName = file.name || '';
    const fileType = file.type || '';
    const extension = path.extname(fileName).toLowerCase();

    return allowedTypes.some(allowed => {
        if (allowed.startsWith('.')) {
            return extension === allowed.toLowerCase();
        }
        return fileType.includes(allowed);
    });
}

/**
 * Generate unique filename to avoid conflicts
 * @param {string} originalName - Original file name
 * @param {string} uploadDir - Upload directory path
 * @returns {Promise<string>} Unique filename
 */
export async function generateUniqueFilename(originalName, uploadDir) {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);

    // Clean filename: remove special characters, replace spaces with hyphens
    const cleanName = nameWithoutExt
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    let filename = `${cleanName}${ext}`;
    let counter = 1;

    // Check if file exists, if so, add counter
    while (fs.existsSync(path.join(uploadDir, filename))) {
        filename = `${cleanName}-${counter}${ext}`;
        counter++;
    }

    return filename;
}

/**
 * Get file type category based on extension
 * @param {string} fileName - File name
 * @returns {string} File type category
 */
function getFileType(fileName) {
    const ext = path.extname(fileName).toLowerCase();

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];

    if (imageExtensions.includes(ext)) return 'image';
    if (documentExtensions.includes(ext)) return 'document';
    if (videoExtensions.includes(ext)) return 'video';
    if (audioExtensions.includes(ext)) return 'audio';

    return 'other';
}

/**
 * Delete file from filesystem
 * @param {string} filePath - File path to delete
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteFile(filePath) {
    try {
        await unlink(filePath);
        return true;
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        return false;
    }
}
