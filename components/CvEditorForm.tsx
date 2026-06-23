"use client";

import {
  Box,
  TextField,
  Typography,
  Divider,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRef, useState } from "react";
import { ProfileData, Experience, Education } from "../lib/linkedinPdfParser";

interface Props {
  profile: ProfileData;
  onChange: (updated: ProfileData) => void;
}

export default function CvEditorForm({ profile, onChange }: Props) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const fieldUpdater =
    (key: keyof ProfileData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...profile, [key]: e.target.value });
    };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onChange({ ...profile, profilePhotoBase64: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteSkill = (index: number) => {
    const updated = (profile.skills ?? []).filter((_, i) => i !== index);
    onChange({ ...profile, skills: updated });
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    const existing = (profile.skills ?? []).map((s) => s.toLowerCase());
    if (existing.includes(trimmed.toLowerCase())) {
      setNewSkill("");
      return;
    }
    onChange({ ...profile, skills: [...(profile.skills ?? []), trimmed] });
    setNewSkill("");
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleDeleteLanguage = (index: number) => {
    const updated = (profile.languages ?? []).filter((_, i) => i !== index);
    onChange({ ...profile, languages: updated });
  };

  const handleAddLanguage = () => {
    const trimmed = newLanguage.trim();
    if (!trimmed) return;
    const existing = (profile.languages ?? []).map((l) => l.toLowerCase());
    if (existing.includes(trimmed.toLowerCase())) {
      setNewLanguage("");
      return;
    }
    onChange({
      ...profile,
      languages: [...(profile.languages ?? []), trimmed],
    });
    setNewLanguage("");
  };

  const handleLanguageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  const updateExperience = (index: number, updated: Experience) => {
    const list = [...(profile.experience ?? [])];
    list[index] = updated;
    onChange({ ...profile, experience: list });
  };

  const deleteExperience = (index: number) => {
    const list = (profile.experience ?? []).filter((_, i) => i !== index);
    onChange({ ...profile, experience: list });
  };

  const updateBullet = (
    expIndex: number,
    bulletIndex: number,
    value: string,
  ) => {
    const exp = { ...(profile.experience ?? [])[expIndex] };
    const bullets = [...(exp.bullets ?? [])];
    bullets[bulletIndex] = value;
    exp.bullets = bullets;
    updateExperience(expIndex, exp);
  };

  const deleteBullet = (expIndex: number, bulletIndex: number) => {
    const exp = { ...(profile.experience ?? [])[expIndex] };
    exp.bullets = (exp.bullets ?? []).filter((_, i) => i !== bulletIndex);
    updateExperience(expIndex, exp);
  };

  const addBullet = (expIndex: number) => {
    const exp = { ...(profile.experience ?? [])[expIndex] };
    exp.bullets = [...(exp.bullets ?? []), ""];
    updateExperience(expIndex, exp);
  };

  const updateEducation = (index: number, updated: Education) => {
    const list = [...(profile.education ?? [])];
    list[index] = updated;
    onChange({ ...profile, education: list });
  };

  const deleteEducation = (index: number) => {
    const list = (profile.education ?? []).filter((_, i) => i !== index);
    onChange({ ...profile, education: list });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Edit Your CV
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          onClick={() => photoInputRef.current?.click()}
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2px dashed",
            borderColor: "primary.main",
            overflow: "hidden",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
          }}
        >
          {profile.profilePhotoBase64 ? (
            <img
              src={profile.profilePhotoBase64}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <AddPhotoAlternateIcon color="action" />
          )}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Profile Picture
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Optional — click to upload
          </Typography>
        </Box>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Basic Info
      </Typography>
      <TextField
        label="Full Name"
        fullWidth
        size="small"
        variant="outlined"
        value={profile.name ?? ""}
        onChange={fieldUpdater("name")}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Headline / Job Title"
        fullWidth
        size="small"
        variant="outlined"
        value={profile.headline ?? ""}
        onChange={fieldUpdater("headline")}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Location"
        fullWidth
        size="small"
        variant="outlined"
        value={profile.location ?? ""}
        onChange={fieldUpdater("location")}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        size="small"
        variant="outlined"
        value={profile.email ?? ""}
        onChange={fieldUpdater("email")}
        sx={{ mb: 2 }}
      />
      <TextField
        label="LinkedIn URL"
        fullWidth
        size="small"
        variant="outlined"
        value={profile.linkedInUrl ?? ""}
        onChange={fieldUpdater("linkedInUrl")}
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Summary
      </Typography>
      <TextField
        label="Summary / About"
        fullWidth
        multiline
        minRows={3}
        maxRows={8}
        value={profile.summary ?? ""}
        onChange={fieldUpdater("summary")}
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Skills
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {(profile.skills ?? []).map((skill, i) => (
          <Chip
            key={i}
            label={skill}
            onDelete={() => handleDeleteSkill(i)}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
        {(profile.skills ?? []).length === 0 && (
          <Typography variant="caption" color="text.secondary">
            No skills yet. Add some below.
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Add a skill…"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleSkillKeyDown}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddSkill}
          disabled={!newSkill.trim()}
        >
          Add
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Languages
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {(profile.languages ?? []).map((language, i) => (
          <Chip
            key={i}
            label={language}
            onDelete={() => handleDeleteLanguage(i)}
            size="small"
            color="secondary"
            variant="outlined"
          />
        ))}
        {(profile.languages ?? []).length === 0 && (
          <Typography variant="caption" color="text.secondary">
            No languages yet. Add some below.
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Add a language…"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          onKeyDown={handleLanguageKeyDown}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddLanguage}
          disabled={!newLanguage.trim()}
        >
          Add
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Experience
      </Typography>
      {(profile.experience ?? []).map((exp, i) => (
        <Box
          key={i}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => deleteExperience(i)}
            sx={{ position: "absolute", top: 8, right: 8 }}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

          <TextField
            label="Job Title"
            size="small"
            fullWidth
            value={exp.title ?? ""}
            sx={{ mb: 1.5 }}
            onChange={(e) =>
              updateExperience(i, { ...exp, title: e.target.value })
            }
          />
          <TextField
            label="Company"
            size="small"
            fullWidth
            value={exp.company ?? ""}
            sx={{ mb: 1.5 }}
            onChange={(e) =>
              updateExperience(i, { ...exp, company: e.target.value })
            }
          />
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <TextField
              label="Start Date"
              size="small"
              value={exp.startDate ?? ""}
              onChange={(e) =>
                updateExperience(i, { ...exp, startDate: e.target.value })
              }
              sx={{ flex: 1 }}
            />
            <TextField
              label="End Date"
              size="small"
              value={exp.endDate ?? ""}
              placeholder={exp.isCurrent ? "Present" : ""}
              onChange={(e) =>
                updateExperience(i, { ...exp, endDate: e.target.value })
              }
              sx={{ flex: 1 }}
            />
          </Box>
          <TextField
            label="Description"
            size="small"
            fullWidth
            multiline
            minRows={2}
            value={exp.description ?? ""}
            sx={{ mb: 1.5 }}
            onChange={(e) =>
              updateExperience(i, { ...exp, description: e.target.value })
            }
          />
          {(exp.bullets ?? []).map((bullet, bi) => (
            <Box
              key={bi}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <TextField
                size="small"
                fullWidth
                value={bullet}
                onChange={(e) => updateBullet(i, bi, e.target.value)}
                placeholder="Bullet point…"
              />
              <IconButton
                size="small"
                onClick={() => deleteBullet(i, bi)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => addBullet(i)}
          >
            Add bullet
          </Button>
        </Box>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() =>
          onChange({
            ...profile,
            experience: [
              ...(profile.experience ?? []),
              { title: "", company: "", startDate: "", endDate: "" },
            ],
          })
        }
      >
        Add Experience
      </Button>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Education
      </Typography>
      {(profile.education ?? []).map((edu, i) => (
        <Box
          key={i}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => deleteEducation(i)}
            sx={{ position: "absolute", top: 8, right: 8 }}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <TextField
            label="School"
            size="small"
            fullWidth
            value={edu.school ?? ""}
            sx={{ mb: 1.5 }}
            onChange={(e) =>
              updateEducation(i, { ...edu, school: e.target.value })
            }
          />
          <TextField
            label="Degree"
            size="small"
            fullWidth
            value={edu.degree ?? ""}
            sx={{ mb: 1.5 }}
            onChange={(e) =>
              updateEducation(i, { ...edu, degree: e.target.value })
            }
          />
          <TextField
            label="Field of Study"
            size="small"
            fullWidth
            value={edu.fieldOfStudy ?? ""}
            sx={{ mb: 1.5 }}
            onChange={(e) =>
              updateEducation(i, { ...edu, fieldOfStudy: e.target.value })
            }
          />
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <TextField
              label="Start Year"
              size="small"
              value={edu.startDate ?? ""}
              onChange={(e) =>
                updateEducation(i, { ...edu, startDate: e.target.value })
              }
              sx={{ flex: 1 }}
            />
            <TextField
              label="End Year"
              size="small"
              value={edu.endDate ?? ""}
              onChange={(e) =>
                updateEducation(i, { ...edu, endDate: e.target.value })
              }
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() =>
          onChange({
            ...profile,
            education: [
              ...(profile.education ?? []),
              {
                school: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
              },
            ],
          })
        }
      >
        Add Education
      </Button>
    </Box>
  );
}
