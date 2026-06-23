import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { ProfileData } from "./linkedinPdfParser";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  headline: {
    fontSize: 12,
    color: "#555555",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 9,
    color: "#555555",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingBottom: 3,
  },
  experienceEntry: {
    marginBottom: 10,
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 2,
  },
  entryBody: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  bullet: {
    fontSize: 9,
    lineHeight: 1.4,
    marginLeft: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  chip: {
    fontSize: 9,
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: "#333333",
  },
});

function CvDocument({ profile }: { profile: ProfileData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {profile.profilePhotoBase64 && (
            <Image src={profile.profilePhotoBase64} style={styles.avatar} />
          )}
          <View style={styles.headerText}>
            {profile.name ? <Text style={styles.name}>{profile.name}</Text> : null}
            {profile.headline ? (
              <Text style={styles.headline}>{profile.headline}</Text>
            ) : null}
            <View style={styles.contactRow}>
              {profile.location ? <Text>{profile.location}</Text> : null}
              {profile.email ? <Text>{profile.email}</Text> : null}
              {profile.linkedInUrl ? <Text>{profile.linkedInUrl}</Text> : null}
            </View>
          </View>
        </View>

        {profile.summary ? (
          <View>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.entryBody}>{profile.summary}</Text>
          </View>
        ) : null}

        {(profile.experience ?? []).length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {(profile.experience ?? []).map((exp, i) => (
              <View key={i} style={styles.experienceEntry}>
                <Text style={styles.entryTitle}>
                  {[exp.title, exp.company].filter(Boolean).join(" · ")}
                </Text>
                {(exp.startDate || exp.endDate) ? (
                  <Text style={styles.entrySubtitle}>
                    {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                  </Text>
                ) : null}
                {exp.description ? (
                  <Text style={styles.entryBody}>{exp.description}</Text>
                ) : null}
                {(exp.bullets ?? []).map((b, bi) => (
                  <Text key={bi} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {(profile.education ?? []).length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {(profile.education ?? []).map((edu, i) => (
              <View key={i} style={styles.experienceEntry}>
                <Text style={styles.entryTitle}>{edu.school}</Text>
                {(edu.degree || edu.fieldOfStudy) ? (
                  <Text style={styles.entrySubtitle}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}
                  </Text>
                ) : null}
                {(edu.startDate || edu.endDate) ? (
                  <Text style={styles.entrySubtitle}>
                    {edu.startDate}
                    {edu.startDate && edu.endDate ? " – " : ""}
                    {edu.endDate}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {(profile.skills ?? []).length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.chipRow}>
              {(profile.skills ?? []).map((skill, i) => (
                <Text key={i} style={styles.chip}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {(profile.languages ?? []).length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.chipRow}>
              {(profile.languages ?? []).map((lang, i) => (
                <Text key={i} style={styles.chip}>
                  {lang}
                </Text>
              ))}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export async function generateCvPdf(profile: ProfileData): Promise<void> {
  const blob = await pdf(<CvDocument profile={profile} />).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${profile.name ? profile.name.replace(/\s+/g, "_") : "cv"}_CV.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
