'use client';

import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check, FolderOpen, Video as VideoIcon, FileVideo } from 'lucide-react';
import styles from './ImagePicker.module.css';

export default function ImagePicker({ value, onChange, label = 'Image', type = 'image' }) {
    const [activeTab, setActiveTab] = useState('upload'); // upload, library, url
    const [previewUrl, setPreviewUrl] = useState(value || '');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    useEffect(() => {
        setPreviewUrl(value || '');
        if (value && !urlInput) {
            setUrlInput(value);
        }
    }, [value]);

    useEffect(() => {
        if (activeTab === 'library') {
            fetchFiles();
        }
    }, [activeTab]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/files/gallery?type=${type}`);
            const data = await response.json();
            if (data.success) {
                setFiles(data.files);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                const newUrl = data.file.url;
                setPreviewUrl(newUrl);
                onChange(newUrl);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFile = (fileUrl) => {
        setPreviewUrl(fileUrl);
        onChange(fileUrl);
    };

    const handleUrlSubmit = () => {
        if (urlInput) {
            setPreviewUrl(urlInput);
            onChange(urlInput);
        }
    };

    const clearImage = () => {
        setPreviewUrl('');
        setUrlInput('');
        onChange('');
    };

    const isVideo = type === 'video';
    const acceptType = isVideo ? 'video/*' : 'image/*';
    const PlaceholderIcon = isVideo ? VideoIcon : ImageIcon;

    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>

            <div className={styles.previewArea}>
                {previewUrl ? (
                    <div className={styles.previewImageContainer}>
                        {isVideo ? (
                            <video src={previewUrl} className={styles.previewImage} controls />
                        ) : (
                            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                        )}
                        <button
                            type="button"
                            onClick={clearImage}
                            className={styles.removeButton}
                            title={`Remove ${type}`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <PlaceholderIcon size={48} className={styles.placeholderIcon} />
                        <p>No {type} selected</p>
                    </div>
                )}
            </div>

            <div className={styles.pickerContainer}>
                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'upload' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <Upload size={16} /> Upload
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'library' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('library')}
                    >
                        <FolderOpen size={16} /> Library
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'url' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('url')}
                    >
                        <LinkIcon size={16} /> URL
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'upload' && (
                        <div className={styles.uploadTab}>
                            <input
                                type="file"
                                id={`file-upload-${label}`}
                                accept={acceptType}
                                onChange={handleUpload}
                                className={styles.fileInput}
                                disabled={loading}
                            />
                            <label htmlFor={`file-upload-${label}`} className={styles.uploadButton}>
                                {loading ? 'Uploading...' : `Choose ${type === 'video' ? 'Video' : 'File'} to Upload`}
                            </label>
                            <p className={styles.helperText}>
                                {isVideo ? 'Supported: MP4, WebM (Max 50MB)' : 'Supported: JPG, PNG, GIF, WebP (Max 10MB)'}
                            </p>
                        </div>
                    )}

                    {activeTab === 'library' && (
                        <div className={styles.libraryTab}>
                            {loading ? (
                                <div className={styles.loading}>Loading files...</div>
                            ) : files.length === 0 ? (
                                <div className={styles.empty}>No {type}s found in library</div>
                            ) : (
                                <div className={styles.grid}>
                                    {files.map((file) => (
                                        <div
                                            key={file.path}
                                            className={`${styles.gridItem} ${previewUrl === file.urlPath ? styles.selected : ''}`}
                                            onClick={() => handleSelectFile(file.urlPath)}
                                        >
                                            {isVideo ? (
                                                <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <FileVideo size={24} className="text-gray-400" />
                                                    <span className="text-xs absolute bottom-1 truncate w-full text-center px-1">{file.name}</span>
                                                </div>
                                            ) : (
                                                <img src={file.urlPath} alt={file.name} />
                                            )}
                                            {previewUrl === file.urlPath && (
                                                <div className={styles.checkOverlay}>
                                                    <Check size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'url' && (
                        <div className={styles.urlTab}>
                            <div className={styles.urlInputGroup}>
                                <input
                                    type="text"
                                    placeholder={isVideo ? "https://example.com/video.mp4" : "https://example.com/image.jpg"}
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    className={styles.urlInput}
                                />
                                <button
                                    type="button"
                                    onClick={handleUrlSubmit}
                                    className={styles.urlButton}
                                >
                                    Set
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
