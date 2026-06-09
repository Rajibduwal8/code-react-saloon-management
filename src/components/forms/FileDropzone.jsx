import React, { useRef } from "react";
import { UploadCloud, X } from "lucide-react";

export default function FileDropzone({
  selectedFiles,
  setSelectedFiles,
  formik,
  existingImage,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        isExisting: false,
        preview: URL.createObjectURL(file),
        payload: file,
      };
      setSelectedFiles([newFile]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const imagePreview =
    selectedFiles.length > 0 ? selectedFiles[0].preview : existingImage;

  return (
    <div
      style={{
        border: "2px dashed #e2e8f0",
        borderRadius: "8px",
        padding: "32px",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {imagePreview ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "180px",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              background: "#e53e3e",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <UploadCloud size={40} color="#a0aec0" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: "14px", color: "#4a5568", fontWeight: 500 }}>
            Click or drag file to this area to upload
          </div>
          <div style={{ fontSize: "12px", color: "#718096", marginTop: 4 }}>
            Support for a single image upload.
          </div>
        </>
      )}
    </div>
  );
}
