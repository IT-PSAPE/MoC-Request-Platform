'use client';

import { Button, Icon, InlineAlert, Text } from '@/components/ui';
import { FileIcon, IconButton } from '@/components/ui/common';
import { cn } from '@/shared/cn';
import { useEffect, useMemo, useRef, useState } from 'react';

export type FilleUploaderProps = {
    files: File[];
    onFilesChange: (update: (prev: File[]) => File[]) => void;
    maxFiles?: number;
    maxFileSizeBytes?: number;
    disabled?: boolean;
    className?: string;
};

export function FilleUploader({ files, onFilesChange, maxFiles = 10, maxFileSizeBytes = 10 * 1024 * 1024, disabled = false, className }: FilleUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [filesError, setFilesError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

    const fileKeys = useMemo(() => {
        return files.map((f) => `${f.name}:${f.size}:${f.lastModified}`);
    }, [files]);

    function getFileKey(file: File) {
        return `${file.name}:${file.size}:${file.lastModified}`;
    }

    function getFileExtension(fileName: string) {
        const parts = fileName.split('.');
        if (parts.length < 2) return '';
        return parts[parts.length - 1].toUpperCase();
    }

    function formatBytes(bytes: number) {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    }

    function openFilePicker() {
        fileInputRef.current?.click();
    }

    function addFiles(selectedFiles: File[]) {
        setFilesError(null);

        if (selectedFiles.length === 0) return;

        const oversize = selectedFiles.find((f) => f.size > maxFileSizeBytes);
        if (oversize) {
            setFilesError(`"${oversize.name}" is too large. Max file size is ${formatBytes(maxFileSizeBytes)} per file.`);
            return;
        }

        onFilesChange((prev) => {
            const existingKeys = new Set(prev.map((f: File) => getFileKey(f)));
            const dedupedToAdd = selectedFiles.filter((f: File) => !existingKeys.has(getFileKey(f)));
            const next = [...prev, ...dedupedToAdd];
            if (next.length > maxFiles) {
                setFilesError(`You can upload a maximum of ${maxFiles} files.`);
                return prev;
            }
            return next;
        });
    }

    function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = Array.from(event.target.files ?? []);
        addFiles(selectedFiles);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingOver(true);
    }

    function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingOver(false);
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingOver(false);
        const droppedFiles = Array.from(event.dataTransfer.files ?? []);
        addFiles(droppedFiles);
    }

    function handleRemoveFile(index: number) {
        setFilesError(null);
        onFilesChange((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
    }

    useEffect(() => {
        // Maintain object URLs only for currently selected image files
        setImagePreviews((prev) => {
            const next: Record<string, string> = {};
            const currentKeys = new Set(fileKeys);

            // Keep existing previews that still match
            for (const key of Object.keys(prev)) {
                if (currentKeys.has(key)) next[key] = prev[key];
                else URL.revokeObjectURL(prev[key]);
            }

            // Add new previews for image files
            for (const file of files) {
                const key = getFileKey(file);
                if (next[key]) continue;
                if (file.type.startsWith('image/')) {
                    next[key] = URL.createObjectURL(file);
                }
            }

            return next;
        });

        return () => {
            // Cleanup on unmount
            setImagePreviews((prev) => {
                for (const url of Object.values(prev)) URL.revokeObjectURL(url);
                return {};
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileKeys.join('|')]);

    return (
        <div className={cn('space-y-4', className)}>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
                disabled={disabled || files.length >= maxFiles}
            />

            <div
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openFilePicker();
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'w-full rounded-lg border border-dashed p-6 transition-colors',
                    'bg-primary',
                    isDraggingOver ? 'border-foreground-brand-primary ring-3 ring-foreground-brand-primary/15' : 'border-primary',
                    disabled || files.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''
                )}
            >
                <div className="flex flex-col items-center gap-0.5 text-center">
                    <Icon.upload size={32} className="mb-2" />
                    <Text style="label-sm">Drag & drop files here</Text>
                    <Text style="paragraph-sm" className="opacity-70">
                        Or click to browse. Max {maxFiles} files. Max {formatBytes(maxFileSizeBytes)} per file.
                    </Text>
                </div>
            </div>

            {filesError ? <InlineAlert type="error" message={filesError} /> : null}

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <FileItem key={getFileKey(file)} file={file} onRemove={() => handleRemoveFile(index)} />
                    ))}
                </div>
            )}
        </div>
    );
}


function FileItem({ file, onRemove }: { file: File, onRemove: () => void }) {
    function getFileExtension(fileName: string) {
        const parts = fileName.split('.');
        if (parts.length < 2) return '';
        return parts[parts.length - 1].toUpperCase();
    }

    function formatBytes(bytes: number) {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    }

    function getFileIcon() {
        const extension = getFileExtension(file.name);

        if (!extension) return <FileIcon.document size={28} />;

        if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'au'].includes(extension.toLowerCase())) return <FileIcon.audio size={28} />;

        if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'sql'].includes(extension.toLowerCase())) return <FileIcon.code size={28} />;

        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff', 'tif'].includes(extension.toLowerCase())) return <FileIcon.image size={28} />;

        if (['xls', 'xlsx', 'csv', 'ods', 'numbers'].includes(extension.toLowerCase())) return <FileIcon.spreadsheets size={28} />;

        if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v', '3gp'].includes(extension.toLowerCase())) return <FileIcon.video size={28} />;

        if (['pdf'].includes(extension.toLowerCase())) return <FileIcon.pdf size={28} />;

        return <FileIcon.document size={28} />;
    }

    return (
        <div className="flex items-center justify-between gap-3 px-2.5 py-1 border border-primary rounded-lg bg-primary">
            <div className="flex items-center gap-3 w-full">
                {getFileIcon()}
                <div className="flex items-center justify-between gap-3 flex-1">
                    <Text style="label-sm" className="truncate">{file.name}</Text>
                    <Text style="paragraph-xs" className="opacity-70">{formatBytes(file.size)}</Text>
                </div>
                <IconButton size="sm" variant="ghost" onClick={onRemove}>
                    <Icon.close size={16} />
                </IconButton>
            </div>
        </div>
    )
}
