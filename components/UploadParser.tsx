"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function UploadParser() {
  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(
    null,
  );

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
  };

  return (
    <Box>
      <label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          style={{ display: "none" }}
          id="pdf-upload"
        />
        <Button
          variant="contained"
          component="span"
          onClick={() => document.getElementById("pdf-upload")?.click()}
        >
          {"Upload linkedin PDF export"}
        </Button>
      </label>

      {selectedFileName && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {`Selected file: ${selectedFileName}`}
        </Typography>
      )}
    </Box>
  );
}
