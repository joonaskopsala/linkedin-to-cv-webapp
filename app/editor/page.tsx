"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { ProfileData } from "../../lib/linkedinPdfParser";
import {
  loadProfileFromSession,
  clearProfileFromSession,
} from "../../lib/sessionProfile";
import CvEditorForm from "../../components/CvEditorForm";
import CvPreviewPanel from "../../components/CvPreviewPanel";
import { generateCvPdf } from "../../lib/generateCvPdf";

export default function EditorPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = loadProfileFromSession();
    if (!saved) {
      router.replace("/");
      return;
    }
    setProfile(saved);
    setLoading(false);
  }, [router]);

  const handleProfileChange = (updated: ProfileData) => {
    setProfile(updated);
  };

  const handleStartOver = () => {
    clearProfileFromSession();
    router.push("/");
  };

  const handleDownload = async () => {
    if (!profile) return;
    setDownloading(true);
    try {
      await generateCvPdf(profile);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleStartOver}
          variant="text"
          color="inherit"
        >
          Start over
        </Button>

        <Typography
          variant="h6"
          color="primary"
          sx={{ letterSpacing: "-0.5px", fontWeight: "bold" }}
        >
          LinkedIn → CV
        </Typography>

        <Button
          startIcon={
            downloading ? <CircularProgress size={16} /> : <DownloadIcon />
          }
          onClick={handleDownload}
          variant="contained"
          disabled={downloading}
        >
          {downloading ? "Generating…" : "Download PDF"}
        </Button>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          height: "calc(100vh - 57px)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            overflowY: "auto",
            borderRight: "1px solid",
            borderColor: "divider",
            p: 3,
          }}
        >
          <CvEditorForm profile={profile} onChange={handleProfileChange} />
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "60%",
            overflowY: "auto",
            bgcolor: "grey.100",
            p: 4,
          }}
        >
          <CvPreviewPanel profile={profile} />
        </Box>
      </Box>
    </Box>
  );
}
