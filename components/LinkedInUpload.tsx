"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Typography,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { ProfileData } from "../lib/linkedinPdfParser";

export interface UploadParserProps {
  onSuccess?: (profileData: ProfileData) => void;
  onError?: (error: string) => void;
}

export default function LinkedInUpload({
  onSuccess,
  onError,
}: UploadParserProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFile = file !== null;
  const isUploadDisabled = loading || !hasFile;
  const showClearButton = hasFile && !loading;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setError(null);
      setSuccess(false);
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (
        droppedFile.type.includes("pdf") ||
        droppedFile.name.endsWith(".pdf")
      ) {
        setError(null);
        setSuccess(false);
        setFile(droppedFile);
      } else {
        setError("Please drop a PDF file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-linkedin-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse PDF");
      }

      if (data.success && data.data) {
        setSuccess(true);
        setUploadProgress(100);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onSuccess?.(data.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", my: 2 }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Upload LinkedIn Profile PDF
        </Typography>

        {/* Drop zone */}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: "2px dashed",
            borderColor: error ? "error.main" : "primary.main",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            mb: 2,
            backgroundColor: "action.hover",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "action.selected",
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          <CloudUploadIcon
            sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
          />
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {file ? file.name : "Drag and drop your LinkedIn PDF here"}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            or click to browse
          </Typography>
        </Box>

        {/* File info */}
        {file && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", mb: 2 }}
          >
            File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </Typography>
        )}

        {/* Progress bar */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Alert messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} icon={<ErrorIcon />}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>
            Profile parsed successfully!
          </Alert>
        )}

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploadDisabled}
            fullWidth
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              "Parse PDF"
            )}
          </Button>

          {showClearButton && (
            <Button
              variant="outlined"
              onClick={() => {
                setFile(null);
                setError(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
