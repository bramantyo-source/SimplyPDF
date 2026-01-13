'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { JSX } from 'react/jsx-runtime';

interface FileItem {
  id: string;
  file: File;
  status: 'ready' | 'converting' | 'success' | 'error';
  progress: number;
  pdfUrl?: string;
  error?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(filename: string): JSX.Element {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'docx' || ext === 'doc') {
    return (
      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM9 13h6v2H9v-2zm0 4h6v2H9v-2zm0-8h3v2H9V9z" />
        </svg>
      </div>
    );
  }

  if (ext === 'xlsx' || ext === 'xls') {
    return (
      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
        </svg>
      </div>
    );
  }

  if (ext === 'pdf') {
    return (
      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9c.6 0 1 .4 1 1s-.4 1-1 1H8v-2h2zm4 0c.6 0 1 .4 1 1s-.4 1-1 1h-2v-2h2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z" />
      </svg>
    </div>
  );
}

export default function ConverterPage() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const acceptedExtensions = ['.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt'];

    const newFileItems: FileItem[] = fileArray
      .filter(file => acceptedExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'ready' as const,
        progress: 0,
      }));

    setFiles(prev => [...prev, ...newFileItems]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const convertFile = useCallback(async (id: string) => {
    const fileItem = files.find(f => f.id === id);
    if (!fileItem) return;

    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, status: 'converting' as const, progress: 0 } : f
    ));

    // Simulate progress
    const progressInterval = setInterval(() => {
      setFiles(prev => prev.map(f =>
        f.id === id && f.status === 'converting'
          ? { ...f, progress: Math.min(f.progress + Math.random() * 15, 90) }
          : f
      ));
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', fileItem.file);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await res.json();

      if (data.url) {
        setFiles(prev => prev.map(f =>
          f.id === id ? { ...f, status: 'success' as const, progress: 100, pdfUrl: data.url } : f
        ));
      } else {
        setFiles(prev => prev.map(f =>
          f.id === id ? { ...f, status: 'error' as const, error: data.error || 'Conversion failed' } : f
        ));
      }
    } catch (error) {
      clearInterval(progressInterval);
      setFiles(prev => prev.map(f =>
        f.id === id ? { ...f, status: 'error' as const, error: 'Network error' } : f
      ));
    }
  }, [files]);

  const convertAll = useCallback(async () => {
    const readyFiles = files.filter(f => f.status === 'ready');
    // Menjalankan semua konversi secara bersamaan
    await Promise.all(readyFiles.map(file => convertFile(file.id)));
  }, [files, convertFile]);

  // Download file with proper filename using proxy
  const downloadFile = useCallback((url: string, originalName: string) => {
    const pdfName = originalName.replace(/\.[^/.]+$/, '') + '.pdf';
    // Use proxy endpoint that sets correct Content-Disposition header
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(pdfName)}`;
    // Force browser to download
    window.location.href = proxyUrl;
  }, []);

  const downloadAll = useCallback(async () => {
    const successFiles = files.filter(f => f.status === 'success' && f.pdfUrl);
    if (successFiles.length === 0) return;

    // Dynamic import JSZip to avoid SSR issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Fetch all PDFs and add to ZIP
    for (const f of successFiles) {
      if (f.pdfUrl) {
        try {
          const pdfName = f.file.name.replace(/\.[^/.]+$/, '') + '.pdf';
          const response = await fetch(`/api/download?url=${encodeURIComponent(f.pdfUrl)}&name=${encodeURIComponent(pdfName)}`);
          const blob = await response.blob();
          zip.file(pdfName, blob);
        } catch (error) {
          console.error('Error fetching PDF:', f.file.name, error);
        }
      }
    }

    // Generate ZIP and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'converted_documents.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }, [files]);

  const successCount = files.filter(f => f.status === 'success').length;
  const hasReadyFiles = files.some(f => f.status === 'ready');

  // Prevent hydration mismatch 
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="header-container flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z" />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-semibold text-white">DocConverter</span>
        </div>
        <div className="header-auth flex items-center gap-2 sm:gap-4">
          <button className="text-xs sm:text-sm text-gray-400 hover:text-white transition">Log In</button>
          <button className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg text-white hover:bg-white/5 transition" style={{ borderColor: 'var(--border-color)' }}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-2">
          Document to PDF
        </h1>
        <p className="hero-subtitle text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 max-w-md px-4">
          Fast, secure, and high-quality conversion for all your documents.
        </p>

        {/* Upload Card */}
        <div className="card w-full max-w-2xl p-4 sm:p-6 mx-2">
          {/* Upload Zone */}
          <div
            className={`upload-zone p-8 mb-6 text-center ${isDragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt"
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-white font-medium mb-1">Click to upload documents</p>
            <p className="text-sm text-gray-500">or drag and drop files here (DOCX, XLSX, PPTX)</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3 mb-6">
              {files.map(fileItem => (
                <div key={fileItem.id} className="file-item">
                  {getFileIcon(fileItem.file.name)}

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{fileItem.file.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{formatFileSize(fileItem.file.size)}</span>
                      {fileItem.status === 'ready' && (
                        <span className="text-xs status-ready">• Ready</span>
                      )}
                      {fileItem.status === 'converting' && (
                        <span className="text-xs status-converting animate-pulse">Converting... {Math.round(fileItem.progress)}%</span>
                      )}
                      {fileItem.status === 'success' && (
                        <span className="text-xs status-success">Successfully converted</span>
                      )}
                      {fileItem.status === 'error' && (
                        <span className="text-xs status-error">Conversion failed</span>
                      )}
                    </div>
                    {fileItem.status === 'converting' && (
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${fileItem.progress}%` }} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {fileItem.status === 'success' && fileItem.pdfUrl && (
                      <button
                        onClick={() => downloadFile(fileItem.pdfUrl!, fileItem.file.name)}
                        className="btn-secondary text-xs py-2 px-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    )}
                    {fileItem.status === 'error' && (
                      <button
                        onClick={() => convertFile(fileItem.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Retry
                      </button>
                    )}
                    {fileItem.status !== 'converting' && (
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        className="icon-btn danger"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {files.length > 0 && (
            <div className="action-buttons flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                {successCount > 0 ? `${successCount} file${successCount > 1 ? 's' : ''} ready for download` : ''}
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                {successCount > 0 && (
                  <button onClick={downloadAll} className="btn-secondary text-xs sm:text-sm justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download All
                  </button>
                )}
                {hasReadyFiles && (
                  <button onClick={convertAll} className="btn-primary text-xs sm:text-sm justify-center">
                    Convert All to PDF
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-4 sm:px-6 py-4 sm:py-6" style={{ borderColor: 'var(--border-color)' }}>
        <div className="footer-container max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-xs sm:text-sm text-gray-500">
          <span>© 2026 Kelompok 4 TI</span>
          <div className="footer-links flex items-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


