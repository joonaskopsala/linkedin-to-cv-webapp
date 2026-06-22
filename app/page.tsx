"use client";

import { Box, Container, Link, Typography } from "@mui/material";
import { useState } from "react";
import LinkedInUpload from "../components/LinkedInUpload";
import { ProfileData } from "../lib/linkedinPdfParser";

export default function Home() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
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
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          sx={{ letterSpacing: "-0.5px", fontWeight: "bold" }}
        >
          LinkedIn → CV
        </Typography>
      </Box>

      <Box component="main" sx={{ flex: 1 }}>
        {!profileData ? (
          /* ── Hero + Upload ── */
          <Container
            maxWidth="sm"
            sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}
          >
            <Typography
              variant="h3"
              sx={{
                mb: 1.5,
                letterSpacing: "-1px",
                lineHeight: 1.15,
                fontWeight: "bold",
              }}
            >
              Turn your LinkedIn profile into a CV
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 5, maxWidth: 420, mx: "auto" }}
            >
              Export your LinkedIn profile as a PDF, upload it here, and get a
              clean, formatted CV instantly — no sign-up required.
            </Typography>
            <LinkedInUpload onSuccess={setProfileData} />
          </Container>
        ) : (
          /* ── Parsed JSON view (temporary) ── */
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Typography
                variant="button"
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={() => setProfileData(null)}
              >
                ← Upload another
              </Typography>
            </Box>
            <Box
              component="pre"
              sx={{
                bgcolor: "grey.900",
                color: "grey.100",
                p: 3,
                borderRadius: 2,
                overflow: "auto",
                fontSize: "0.8rem",
                lineHeight: 1.6,
              }}
            >
              {JSON.stringify(profileData, null, 2)}
            </Box>
          </Container>
        )}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          py: 2,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Export your LinkedIn data via{" "}
          <Link
            href="https://www.linkedin.com/mypreferences/d/download-my-data"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn Data Export
          </Link>{" "}
          and upload the PDF here.
        </Typography>
      </Box>
    </Box>
  );
}
