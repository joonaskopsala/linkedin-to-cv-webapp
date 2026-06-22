"use client";

import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Chip, Divider, Link, Typography } from "@mui/material";
import { ProfileData } from "../lib/linkedinPdfParser";

export default function CvPreview({ profile }: { profile: ProfileData }) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 3, sm: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        {profile.name && (
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {profile.name}
          </Typography>
        )}
        {profile.headline && (
          <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
            {profile.headline}
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1.5 }}>
          {profile.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {profile.location}
              </Typography>
            </Box>
          )}
          {profile.email && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EmailIcon fontSize="small" color="action" />
              <Link href={`mailto:${profile.email}`} variant="body2">
                {profile.email}
              </Link>
            </Box>
          )}
          {profile.linkedInUrl && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LinkedInIcon fontSize="small" color="action" />
              <Link
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
              >
                LinkedIn
              </Link>
            </Box>
          )}
        </Box>
      </Box>

      {/* Summary */}
      {profile.summary && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.summary}
            </Typography>
          </Box>
        </>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Experience
            </Typography>
            {profile.experience.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {exp.title}
                  {exp.company ? ` · ${exp.company}` : ""}
                </Typography>
                {(exp.startDate || exp.endDate) && (
                  <Typography variant="caption" color="text.secondary">
                    {exp.startDate} – {exp.endDate ?? "Present"}
                  </Typography>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 0.5 }}>
                    {exp.bullets.map((bullet, bidx) => (
                      <Typography
                        key={bidx}
                        component="li"
                        variant="body2"
                        color="text.secondary"
                      >
                        {bullet}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Education
            </Typography>
            {profile.education.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {edu.degree}
                  {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                </Typography>
                {edu.school && (
                  <Typography variant="body2" color="text.secondary">
                    {edu.school}
                  </Typography>
                )}
                {(edu.startDate || edu.endDate) && (
                  <Typography variant="caption" color="text.secondary">
                    {edu.startDate} – {edu.endDate}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1.5, fontWeight: "bold" }}
            >
              Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {profile.skills.map((skill, idx) => (
                <Chip key={idx} label={skill} variant="outlined" size="small" />
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1.5, fontWeight: "bold" }}
            >
              Languages
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {profile.languages.map((lang, idx) => (
                <Chip key={idx} label={lang} size="small" />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
