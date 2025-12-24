import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  ContentCopy as CopyIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { CertificationStyles } from "./Certification.styles";

const mockCertificates = [
  {
    id: "CERT-001",
    programName: "Data Analyst Shadowing Program",
    mentorName: "Marcus Johnson",
    studentName: "David Brown",
    studentId: "U005",
    startDate: "16/11/2025",
    endDate: "16/11/2025",
    duration: "6 hour",
    status: "Completed",
    completedActivities: [
      "Requirements Analysis",
      "Software Design",
      "Implementation (Coding)",
    ],
  },
  {
    id: "CERT-002",
    programName: "Data Analyst Shadowing Program",
    mentorName: "Marcus Johnson",
    studentName: "David Brown",
    studentId: "U005",
    startDate: "16/11/2025",
    endDate: "16/11/2025",
    duration: "6 hour",
    status: "Completed",
    completedActivities: [
      "Requirements Analysis",
      "Software Design",
      "Implementation (Coding)",
    ],
  },
  {
    id: "CERT-003",
    programName: "Data Analyst Shadowing Program",
    mentorName: "Marcus Johnson",
    studentName: "David Brown",
    studentId: "U005",
    startDate: "16/11/2025",
    endDate: "16/11/2025",
    duration: "6 hour",
    status: "Completed",
    completedActivities: [
      "Requirements Analysis",
      "Software Design",
      "Implementation (Coding)",
    ],
  },
  {
    id: "CERT-004",
    programName: "Data Analyst Shadowing Program",
    mentorName: "Marcus Johnson",
    studentName: "David Brown",
    studentId: "U005",
    startDate: "16/11/2025",
    endDate: "16/11/2025",
    duration: "6 hour",
    status: "Completed",
    completedActivities: [
      "Requirements Analysis",
      "Software Design",
      "Implementation (Coding)",
    ],
  },
];

function Certification() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleView = (certificate) => {
    setSelectedCertificate(certificate);
    setPreviewOpen(true);
  };

  const handleDownload = (certificate) => {
    console.log("Download certificate:", certificate);
  };

  const handleShare = (certificate) => {
    console.log("Share certificate:", certificate);
  };

  return (
    <Box sx={CertificationStyles.container}>
      <Card sx={CertificationStyles.toolbarCard}>
        <CardContent sx={CertificationStyles.toolbarCardContent}>
          <Box sx={CertificationStyles.header}>
            <Typography variant="h6" sx={CertificationStyles.title}>
              All Certificates
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={CertificationStyles.downloadAllButton}
            >
              Download All
            </Button>
          </Box>

          <Box sx={CertificationStyles.toolbar}>
            <TextField
              placeholder="Search users..."
              size="small"
              sx={CertificationStyles.searchField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={CertificationStyles.searchIcon} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={CertificationStyles.headerActions}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={CertificationStyles.actionButton}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                sx={CertificationStyles.actionButton}
              >
                Date Range
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={CertificationStyles.stats}>
        <Typography variant="body1" sx={CertificationStyles.statsText}>
          Total 4 certificates
        </Typography>
        <Box sx={CertificationStyles.activityContainer}>
          <AccessTimeIcon sx={CertificationStyles.activityIcon} />
          <Typography variant="body2" sx={CertificationStyles.activityText}>
            Recent Activity
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {mockCertificates.map((certificate) => (
          <Grid item xs={12} sm={6} key={certificate.id}>
            <Card sx={CertificationStyles.certificateCard}>
              <CardContent sx={CertificationStyles.cardContent}>
                <Box sx={CertificationStyles.cardTopRow}>
                  <Box sx={CertificationStyles.cardTopLeft}>
                    <Box sx={CertificationStyles.checkCircle}>
                      <CheckCircleIcon sx={CertificationStyles.checkIcon} />
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={CertificationStyles.programName}
                      >
                        {certificate.programName}
                      </Typography>
                      <Box sx={CertificationStyles.mentorRow}>
                        <PersonIcon sx={CertificationStyles.mentorIcon} />
                        <Typography sx={CertificationStyles.mentorName}>
                          {certificate.mentorName}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Chip
                    label={certificate.status}
                    size="small"
                    sx={CertificationStyles.statusChip}
                  />
                </Box>

                <Box sx={CertificationStyles.studentRow}>
                  <Box sx={CertificationStyles.studentLeft}>
                    <Box sx={CertificationStyles.studentAvatar}>
                      <AccountCircleIcon
                        sx={CertificationStyles.studentAvatarIcon}
                      />
                    </Box>
                    <Box>
                      <Typography sx={CertificationStyles.studentLabel}>
                        Student
                      </Typography>
                      <Typography sx={CertificationStyles.studentName}>
                        {certificate.studentName}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={CertificationStyles.studentRight}>
                    <Typography sx={CertificationStyles.studentIdLabel}>
                      ID
                    </Typography>
                    <Typography sx={CertificationStyles.studentIdValue}>
                      {certificate.studentId}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={CertificationStyles.dateRow}>
                  <Box sx={CertificationStyles.dateItem}>
                    <CalendarIcon sx={CertificationStyles.dateIcon} />
                    <Box>
                      <Typography sx={CertificationStyles.dateLabel}>
                        Start
                      </Typography>
                      <Typography sx={CertificationStyles.dateValue}>
                        {certificate.startDate}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={CertificationStyles.dateItem}>
                    <CalendarIcon sx={CertificationStyles.dateIcon} />
                    <Box>
                      <Typography sx={CertificationStyles.dateLabel}>
                        End
                      </Typography>
                      <Typography sx={CertificationStyles.dateValue}>
                        {certificate.endDate}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={CertificationStyles.durationItem}>
                    <Typography sx={CertificationStyles.dateLabel}>
                      Duration
                    </Typography>
                    <Typography sx={CertificationStyles.dateValue}>
                      {certificate.duration}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={CertificationStyles.cardActions}>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleView(certificate)}
                    sx={CertificationStyles.viewButton}
                  >
                    View
                  </Button>
                  <IconButton
                    onClick={() => handleDownload(certificate)}
                    sx={CertificationStyles.iconButton}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShare(certificate)}
                    sx={CertificationStyles.iconButton}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: CertificationStyles.previewDialogPaper }}
      >
        <DialogContent sx={CertificationStyles.previewDialogContent}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={CertificationStyles.previewCloseButton}
            size="small"
          >
            <CloseIcon />
          </IconButton>

          {selectedCertificate && (
            <Box sx={CertificationStyles.certificatePreview}>
              <Box sx={CertificationStyles.certificateBody}>
                <Box sx={CertificationStyles.previewLeft}>
                  <Box sx={CertificationStyles.previewLogoRow}>
                    <Box
                      component="img"
                      src="/logo/careersyncLogo.svg"
                      alt="CareerSync"
                      sx={CertificationStyles.previewLogo}
                    />
                  </Box>

                  <Typography sx={CertificationStyles.previewDate}>
                    {selectedCertificate.startDate}
                  </Typography>

                  <Typography sx={CertificationStyles.previewStudentName}>
                    {selectedCertificate.studentName}
                  </Typography>
                  <Typography sx={CertificationStyles.previewSubtext}>
                    has successfully completed
                  </Typography>
                  <Typography sx={CertificationStyles.previewProgramName}>
                    {selectedCertificate.programName}
                  </Typography>
                  <Typography sx={CertificationStyles.previewMentor}>
                    a job shadowing program from{" "}
                    {selectedCertificate.mentorName}
                  </Typography>

                  <Box sx={CertificationStyles.previewSignatureBlock}>
                    <Box sx={CertificationStyles.previewSignatureLine} />
                    <Typography sx={CertificationStyles.previewSignatureName}>
                      Oudom Ngoun
                    </Typography>
                    <Typography sx={CertificationStyles.previewSignatureTitle}>
                      Program Director, CareerSync
                    </Typography>
                  </Box>
                </Box>

                <Box sx={CertificationStyles.previewRight}>
                  <Typography sx={CertificationStyles.previewRightTitleTop}>
                    J O B&nbsp;&nbsp;S H A D O W I N G
                  </Typography>
                  <Typography sx={CertificationStyles.previewRightTitle}>
                    CERTIFICATE
                  </Typography>

                  <Box sx={CertificationStyles.previewSeal}>
                    <Box sx={CertificationStyles.previewSealOuterRing}>
                      <Typography sx={CertificationStyles.previewSealOuterText}>
                        EDUCATION FOR
                        <br />
                        EVERYONE
                      </Typography>

                      <Box sx={CertificationStyles.previewSealInnerRing}>
                        <Typography sx={CertificationStyles.previewSealBrand}>
                          CAREERSYNC
                        </Typography>
                        <Typography
                          sx={CertificationStyles.previewSealRingText}
                        >
                          JOB SHADOWING
                        </Typography>
                        <Typography
                          sx={CertificationStyles.previewSealRingText}
                        >
                          CERTIFICATE
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={CertificationStyles.certificateFooter}>
                <Typography sx={CertificationStyles.previewFooterNote}>
                  CareerSync has confirmed the identity of this individual and
                  their participation in the program.
                </Typography>

                <Box sx={CertificationStyles.previewFooterVerify}>
                  <Typography sx={CertificationStyles.previewVerify}>
                    Verify at:
                  </Typography>
                  <Typography sx={CertificationStyles.previewVerifyLink}>
                    careersync.com/
                    <br />
                    verify/000000001
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Certification;
