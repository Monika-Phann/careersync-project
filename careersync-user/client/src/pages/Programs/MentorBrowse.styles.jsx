import { styled } from "@mui/material/styles";
import { Box, Typography, TextField, Button } from "@mui/material";

export const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1100,
  margin: "40px auto",
  padding: "0 24px",
  [theme.breakpoints.down("sm")]: {
    margin: "20px auto",
    padding: "0 16px",
  },
}));

export const HeaderSection = styled(Box)({
  textAlign: "center",
  marginBottom: 48,
});

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: 32,
  fontWeight: 800,
  color: "#06112E",
  marginBottom: 8,
  [theme.breakpoints.down("sm")]: {
    fontSize: 24,
  },
}));

export const Subtitle = styled(Typography)({
  color: "#6B7A90",
  fontSize: 16,
});

export const SearchWrapper = styled(Box)({
  maxWidth: 600,
  margin: "32px auto 0",
});

export const StyledInput = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    background: "#fff",
    borderRadius: 12,
    "& fieldset": { border: "1px solid #E9EEF3" },
  },
});

export const MentorGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 24,
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const MentorCard = styled(Box)({
  background: "#fff",
  borderRadius: 16,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  transition: "transform 0.2s",
  "&:hover": { transform: "translateY(-4px)" },
  "& img": { width: "100%", height: 200, objectFit: "cover" },
});

export const MentorInfo = styled(Box)({
  padding: 20,
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
});

export const MentorName = styled(Typography)({
  fontSize: 18,
  fontWeight: 700,
  marginTop: 8,
});

export const MentorRole = styled(Typography)({
  fontSize: 14,
  color: "#6B7A90",
  marginBottom: 12,
});

// FIXED: Added missing StatsRow
export const StatsRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 16,
});

export const ViewProfileButton = styled(Button)({
  width: "100%",
  marginTop: "auto",
  background: "#06112E", // Change to dark navy
  color: "#FFFFFF",      // Force text to white
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "8px",
  "&:hover": { 
    background: "#0a1d4a",
    color: "#FFFFFF" 
  },
  "&.Mui-disabled": {    // Handle the "Fully Booked" look
    background: "#E9EEF3",
    color: "#7A8699"
  }
});

export const Badge = styled("span")(({ info }) => ({
  alignSelf: "flex-start",
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 700,
  borderRadius: 4,
  background: info ? "#e0f2fe" : "#eee",
  color: info ? "#0369a1" : "#333",
  textTransform: "uppercase",
}));

