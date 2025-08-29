"use client";
import { useRef, useState } from "react";
import Button from "./Button";
import { Attachment } from "@/types/request";
import { getRandomUUID } from "@/lib/randomuuid";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB cap for demo

export default function Dropzone({
  onFiles,
}: {
  onFiles: (files: Attachment[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    const tasks = files.map(
      (file) =>
        new Promise<Attachment | null>((resolve) => {
          if (file.size > MAX_BYTES) {
            setError(`File ${file.name} exceeds 5MB limit.`);
            return resolve(null);
          }
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: getRandomUUID(),
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: String(reader.result),
            });
          reader.readAsDataURL(file);
        })
    );
    Promise.all(tasks).then((atts) => {
      const valid = atts.filter(Boolean) as Attachment[];
      if (valid.length) onFiles(valid);
    });
  }

  return (
    <div
      className="rounded-md border border-dashed border-foreground/30 p-4 text-sm"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mb-2 text-foreground/80">Drag and drop files here, or</p>
      <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
        Browse files
      </Button>
      <p className="mt-2 text-xs text-foreground/60">Max size 5MB per file.</p>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
