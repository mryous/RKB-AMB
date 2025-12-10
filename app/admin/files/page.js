'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Search, Filter, Image, FileText, Film, Music, File, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function FilesPage() {
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [analysisData, setAnalysisData] = useState(null);
    const [showUnusedOnly, setShowUnusedOnly] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, [filterType]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/files/gallery?type=${filterType}`);
            const data = await response.json();

            if (data.success) {
                setFiles(data.files);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        for (const file of selectedFiles) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/files/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    await fetchFiles();
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleDelete = async (file) => {
        try {
            const response = await fetch(`/api/files/delete?path=${encodeURIComponent(file.urlPath)}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                await fetchFiles();
                setDeleteConfirm(null);
                setSelectedFiles([]);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleBulkDelete = async () => {
        for (const file of selectedFiles) {
            await handleDelete(file);
        }
    };

    const analyzeFiles = async () => {
        setAnalyzing(true);
        try {
            const response = await fetch('/api/files/analyze');
            const data = await response.json();

            if (data.success) {
                setAnalysisData(data);
            }
        } catch (error) {
            console.error('Error analyzing files:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'image': return <Image size={20} />;
            case 'document': return <FileText size={20} />;
            case 'video': return <Film size={20} />;
            case 'audio': return <Music size={20} />;
            default: return <File size={20} />;
        }
    };

    const filteredFiles = files
        .filter(file => {
            if (searchQuery) {
                return file.name.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        })
        .filter(file => {
            if (showUnusedOnly && analysisData) {
                return analysisData.unusedFiles.some(uf => uf.name === file.name);
            }
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'size':
                    return b.size - a.size;
                case 'date':
                default:
                    return new Date(b.modifiedDate) - new Date(a.modifiedDate);
            }
        });

    const toggleFileSelection = (file) => {
        setSelectedFiles(prev => {
            const exists = prev.find(f => f.name === file.name);
            if (exists) {
                return prev.filter(f => f.name !== file.name);
            } else {
                return [...prev, file];
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manajemen File</h1>
                    <p className={styles.subtitle}>Kelola file dan media untuk situs</p>
                </div>
                <button onClick={fetchFiles} className={styles.refreshButton}>
                    <RefreshCw size={20} />
                    Refresh
                </button>
            </div>

            {/* Upload Section */}
            <div className={styles.uploadSection}>
                <div className={styles.uploadArea}>
                    <Upload size={48} className={styles.uploadIcon} />
                    <h3>Upload File</h3>
                    <p>Drag & drop atau klik untuk memilih file</p>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className={styles.fileInput}
                        disabled={uploading}
                    />
                    {uploading && <div className={styles.uploadingText}>Uploading...</div>}
                </div>

                <div className={styles.uploadInfo}>
                    <h4>Informasi Upload</h4>
                    <ul>
                        <li>Ukuran maksimal: 10MB per file</li>
                        <li>Format yang didukung: JPG, PNG, GIF, WebP, SVG, PDF, DOC, XLS, MP4, MP3</li>
                        <li>File akan disimpan di folder /uploads</li>
                    </ul>
                </div>
            </div>

            {/* Stats Section */}
            {stats && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <File size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.totalFiles}</div>
                            <div className={styles.statLabel}>Total File</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Image size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.byType.image}</div>
                            <div className={styles.statLabel}>Gambar</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <FileText size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.byType.document}</div>
                            <div className={styles.statLabel}>Dokumen</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Upload size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats.formattedTotalSize}</div>
                            <div className={styles.statLabel}>Total Ukuran</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Section */}
            <div className={styles.analysisSection}>
                <div className={styles.analysisHeader}>
                    <h2>Analisis Penggunaan File</h2>
                    <button
                        onClick={analyzeFiles}
                        className={styles.analyzeButton}
                        disabled={analyzing}
                    >
                        {analyzing ? 'Menganalisis...' : 'Analisis File'}
                    </button>
                </div>

                {analysisData && (
                    <div className={styles.analysisResults}>
                        <div className={styles.analysisStats}>
                            <div className={styles.analysisCard}>
                                <CheckCircle size={32} className={styles.iconSuccess} />
                                <div className={styles.analysisInfo}>
                                    <div className={styles.analysisValue}>{analysisData.stats.used.files}</div>
                                    <div className={styles.analysisLabel}>File Terpakai</div>
                                    <div className={styles.analysisSize}>{analysisData.stats.used.formattedSize}</div>
                                </div>
                            </div>
                            <div className={styles.analysisCard}>
                                <AlertTriangle size={32} className={styles.iconWarning} />
                                <div className={styles.analysisInfo}>
                                    <div className={styles.analysisValue}>{analysisData.stats.unused.files}</div>
                                    <div className={styles.analysisLabel}>File Tidak Terpakai</div>
                                    <div className={styles.analysisSize}>{analysisData.stats.unused.formattedSize}</div>
                                </div>
                            </div>
                        </div>

                        {analysisData.stats.unused.files > 0 && (
                            <div className={styles.unusedFilesSection}>
                                <div className={styles.unusedHeader}>
                                    <h3>File Tidak Terpakai ({analysisData.stats.unused.files})</h3>
                                    <p>Total ruang yang bisa dibebaskan: {analysisData.stats.unused.formattedSize}</p>
                                </div>
                                <button
                                    onClick={() => setShowUnusedOnly(!showUnusedOnly)}
                                    className={styles.filterUnusedButton}
                                >
                                    {showUnusedOnly ? 'Tampilkan Semua' : 'Tampilkan Hanya File Tidak Terpakai'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* File Browser */}
            <div className={styles.browserSection}>
                <div className={styles.browserHeader}>
                    <h2>File Browser</h2>
                    <div className={styles.browserControls}>
                        <div className={styles.searchBox}>
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Cari file..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Semua File</option>
                            <option value="image">Gambar</option>
                            <option value="document">Dokumen</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="date">Tanggal</option>
                            <option value="name">Nama</option>
                            <option value="size">Ukuran</option>
                        </select>
                    </div>
                </div>

                {selectedFiles.length > 0 && (
                    <div className={styles.bulkActions}>
                        <span>{selectedFiles.length} file dipilih</span>
                        <button
                            onClick={() => setDeleteConfirm({ bulk: true })}
                            className={styles.bulkDeleteButton}
                        >
                            <Trash2 size={16} />
                            Hapus Terpilih
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className={styles.loading}>Memuat file...</div>
                ) : filteredFiles.length === 0 ? (
                    <div className={styles.empty}>
                        <File size={64} />
                        <p>Tidak ada file ditemukan</p>
                    </div>
                ) : (
                    <div className={styles.fileGrid}>
                        {filteredFiles.map((file) => {
                            const isUnused = analysisData?.unusedFiles.some(uf => uf.name === file.name);
                            const isSelected = selectedFiles.some(f => f.name === file.name);

                            return (
                                <div
                                    key={file.path}
                                    className={`${styles.fileCard} ${isSelected ? styles.fileCardSelected : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleFileSelection(file)}
                                        className={styles.fileCheckbox}
                                    />

                                    {isUnused && (
                                        <div className={styles.unusedBadge}>
                                            <AlertTriangle size={14} />
                                            Tidak Terpakai
                                        </div>
                                    )}

                                    <div className={styles.filePreview}>
                                        {file.type === 'image' ? (
                                            <img src={file.urlPath} alt={file.name} />
                                        ) : (
                                            <div className={styles.fileIconLarge}>
                                                {getFileIcon(file.type)}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.fileInfo}>
                                        <div className={styles.fileName}>{file.name}</div>
                                        <div className={styles.fileDetails}>
                                            <span>{file.formattedSize}</span>
                                            <span>{file.type}</span>
                                        </div>
                                    </div>

                                    <div className={styles.fileActions}>
                                        <button
                                            onClick={() => copyToClipboard(file.urlPath)}
                                            className={styles.actionButton}
                                            title="Copy URL"
                                        >
                                            Copy URL
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(file)}
                                            className={styles.deleteButton}
                                            title="Hapus"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className={styles.modal} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Konfirmasi Hapus</h3>
                        <p>
                            {deleteConfirm.bulk
                                ? `Apakah Anda yakin ingin menghapus ${selectedFiles.length} file?`
                                : `Apakah Anda yakin ingin menghapus "${deleteConfirm.name}"?`
                            }
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className={styles.cancelButton}
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => deleteConfirm.bulk ? handleBulkDelete() : handleDelete(deleteConfirm)}
                                className={styles.confirmDeleteButton}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
