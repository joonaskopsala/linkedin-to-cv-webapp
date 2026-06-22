"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { Profile } from "../util/entity";

const defaultProfile = (): Profile => {
  return {
    name: "",
    headline: "",
    city: "",
    summary: "",
    photoUrl: null,
    contact: {},
    skills: [],
  };
};

export default function CvPreview({ profile }: { profile: Profile }) {
  const p: Profile = { ...defaultProfile(), ...profile };

  return (
    <Box className="cv-preview" id="cv-preview">
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography variant="h5">{p.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {p.headline}
          </Typography>
        </Box>
      </Box>

      {p.summary && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">{p.summary}</Typography>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {"Skills"}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {p.skills && p.skills.length > 0 ? (
            p.skills.map((s, i) => (
              <Chip
                key={i}
                label={s}
                variant="outlined"
                size="small"
                sx={{ mr: 1, mt: 1 }}
              />
            ))
          ) : (
            <Chip label={"No skills parsed"} variant="outlined" size="small" />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
