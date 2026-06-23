"use client";

import { Box, Chip, Divider, Link, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { ProfileData } from "../lib/linkedinPdfParser";

interface Props {
  profile: ProfileData;
}

export default function CvPreviewPanel({ profile }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
        p: { xs: 3, sm: 4 },
        maxWidth: 720,
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "flex-start" }}>
        {profile.profilePhotoBase64 && (
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: "2px solid",
              borderColor: "divider",
            }}
          >
            <img
              src={profile.profilePhotoBase64}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
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
                <Typography variant="body2">{profile.email}</Typography>
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
      </Box>

      {profile.summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Summary
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {profile.summary}
          </Typography>
        </>
      )}

      {(profile.experience ?? []).length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Experience
          </Typography>
          {(profile.experience ?? []).map((exp, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {exp.title}
                {exp.title && exp.company ? " · " : ""}
                {exp.company}
              </Typography>
              {(exp.startDate || exp.endDate) && (
                <Typography variant="caption" color="text.secondary">
                  {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                </Typography>
              )}
              {exp.description && (
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, whiteSpace: "pre-line" }}
                >
                  {exp.description}
                </Typography>
              )}
              {(exp.bullets ?? []).length > 0 && (
                <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                  {(exp.bullets ?? []).map((b, bi) => (
                    <Typography component="li" variant="body2" key={bi}>
                      {b}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </>
      )}

      {(profile.education ?? []).length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Education
          </Typography>
          {(profile.education ?? []).map((edu, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {edu.school}
              </Typography>
              {(edu.degree || edu.fieldOfStudy) && (
                <Typography variant="body2" color="text.secondary">
                  {edu.degree}
                  {edu.degree && edu.fieldOfStudy ? ", " : ""}
                  {edu.fieldOfStudy}
                </Typography>
              )}
              {(edu.startDate || edu.endDate) && (
                <Typography variant="caption" color="text.secondary">
                  {edu.startDate}
                  {edu.startDate && edu.endDate ? " – " : ""}
                  {edu.endDate}
                </Typography>
              )}
            </Box>
          ))}
        </>
      )}

      {(profile.skills ?? []).length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Skills
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {(profile.skills ?? []).map((skill, i) => (
              <Chip key={i} label={skill} size="small" variant="outlined" />
            ))}
          </Box>
        </>
      )}

      {(profile.languages ?? []).length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Languages
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {(profile.languages ?? []).map((lang, i) => (
              <Chip
                key={i}
                label={lang}
                size="small"
                variant="outlined"
                color="secondary"
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
