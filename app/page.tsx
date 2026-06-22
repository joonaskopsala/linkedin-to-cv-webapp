"use client";

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import LinkedInUpload from "../components/LinkedInUpload";
import { ProfileData } from "../lib/linkedinPdfParser";

export default function Home() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const handleUploadSuccess = (data: ProfileData) => {
    setProfileData(data);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          LinkedIn to CV Converter
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Upload your LinkedIn profile PDF to extract and preview your profile
          data
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Upload Section */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <LinkedInUpload
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
            />
          </Paper>
        </Box>

        {/* Preview Section */}
        <Box>
          {profileData && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Parsed Profile Data
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Basic Info */}
              {(profileData.name ||
                profileData.headline ||
                profileData.location) && (
                <Box sx={{ mb: 3 }}>
                  {profileData.name && (
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {profileData.name}
                    </Typography>
                  )}
                  {profileData.headline && (
                    <Typography variant="subtitle1" color="textSecondary">
                      {profileData.headline}
                    </Typography>
                  )}
                  {profileData.location && (
                    <Typography variant="body2" color="textSecondary">
                      📍 {profileData.location}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Contact Info */}
              {(profileData.email || profileData.linkedInUrl) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Contact
                  </Typography>
                  {profileData.email && (
                    <Typography variant="body2">
                      Email: {profileData.email}
                    </Typography>
                  )}
                  {profileData.linkedInUrl && (
                    <Typography variant="body2">
                      <a
                        href={profileData.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn Profile
                      </a>
                    </Typography>
                  )}
                </Box>
              )}

              {/* Summary */}
              {profileData.summary && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Summary
                  </Typography>
                  <Typography variant="body2">{profileData.summary}</Typography>
                </Box>
              )}

              {/* Experience */}
              {profileData.experience && profileData.experience.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Experience ({profileData.experience.length})
                  </Typography>
                  {profileData.experience.map((exp, idx) => (
                    <Box key={idx} sx={{ ml: 2, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {exp.title} {exp.company ? `at ${exp.company}` : ""}
                      </Typography>
                      {(exp.startDate || exp.endDate) && (
                        <Typography variant="caption" color="textSecondary">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </Typography>
                      )}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                          {exp.bullets.map((bullet, bidx) => (
                            <li key={bidx}>
                              <Typography variant="caption">
                                {bullet}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Education */}
              {profileData.education && profileData.education.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Education ({profileData.education.length})
                  </Typography>
                  {profileData.education.map((edu, idx) => (
                    <Box key={idx} sx={{ ml: 2, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {edu.degree}{" "}
                        {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {edu.school}
                      </Typography>
                      {(edu.startDate || edu.endDate) && (
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "block" }}
                        >
                          {edu.startDate} - {edu.endDate}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Skills */}
              {profileData.skills && profileData.skills.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {profileData.skills.slice(0, 15).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                    {profileData.skills.length > 15 && (
                      <Chip
                        label={`+${profileData.skills.length - 15} more`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Languages */}
              {profileData.languages && profileData.languages.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Languages
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {profileData.languages.map((lang, idx) => (
                      <Chip
                        key={idx}
                        label={lang}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Raw JSON */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", display: "block", mb: 1 }}
                >
                  Raw JSON:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 1,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {JSON.stringify(profileData, null, 2)}
                </Box>
              </Box>
            </Paper>
          )}

          {!profileData && (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="textSecondary">
                Upload a LinkedIn PDF to see parsed profile data here
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Documentation */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          How to Use
        </Typography>
        <ol>
          <li>
            <Typography variant="body2">
              Export your LinkedIn profile as a PDF from your LinkedIn settings
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Upload the PDF using the form on the left
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              The parser will extract your profile information
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Review and edit the extracted data as needed
            </Typography>
          </li>
          <li>
            <Typography variant="body2">Save to your CV or database</Typography>
          </li>
        </ol>
      </Paper>
    </Container>
  );
}
