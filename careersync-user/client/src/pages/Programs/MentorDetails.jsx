import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, Star, SchoolOutlined } from "@mui/icons-material";
import { Avatar, Button, Typography, Divider, Box, Alert } from "@mui/material";

// --- IMPORT CENTRALIZED MOCK DATA ---
// This ensures we get the complex slots (day, date, time) instead of simple strings
import { MOCK_MENTORS } from "../../data/mockData"; 

import { 
  Container, 
  BackButton, 
  ProfileHeader, 
  HeaderTextWrapper,
  ContentLayout,
  MainContent, 
  Sidebar, 
  BioSection, 
  ExpertiseTag, 
  BookingCard,
  PriceTag
} from "./MentorDetails.styles";
import RequestBookingModal from "./RequestBookingModal";

export default function MentorDetails() {
  const { id } = useParams(); // Grab the ID from the URL path
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);

  // Find the correct mentor using the ID from the URL
  // Using the imported MOCK_MENTORS ensures data consistency across the app
  const mentor = MOCK_MENTORS.find(m => m.id === parseInt(id)) || MOCK_MENTORS[0];

  const isFullyBooked = mentor.availability === "Fully Booked";

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowBack fontSize="small" /> Back to Mentors
      </BackButton>

      <ProfileHeader>
        <Avatar src={mentor.avatar} sx={{ width: 120, height: 120, border: '4px solid #fff' }} />
        <HeaderTextWrapper>
          <Typography variant="h4" fontWeight={700}>{mentor.name}</Typography>
          <Typography color="text.secondary" variant="h6">{mentor.role} @ {mentor.company}</Typography>
          <Box display="flex" alignItems="center" mt={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
            <Star sx={{ color: '#FFB400', mr: 0.5 }} />
            <Typography fontWeight={600}>{mentor.rating}</Typography>
            <Typography color="text.secondary" ml={1}>({mentor.reviews} reviews)</Typography>
          </Box>
        </HeaderTextWrapper>
      </ProfileHeader>

      <ContentLayout>
        <MainContent>
          <BioSection>
            <Typography variant="h6" fontWeight={700} gutterBottom>About Me</Typography>
            <Typography color="text.secondary" lineHeight={1.7}>{mentor.bio || "No bio available."}</Typography>
          </BioSection>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" fontWeight={700} gutterBottom>Expertise</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
            {(mentor.expertise || []).map(item => <ExpertiseTag key={item}>{item}</ExpertiseTag>)}
          </Box>

          <Typography variant="h6" fontWeight={700} gutterBottom>Education</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolOutlined color="action" />
            <Typography fontSize={14}>{mentor.education || "N/A"}</Typography>
          </Box>
        </MainContent>

        <Sidebar>
          <BookingCard>
            <PriceTag>${mentor.price}<span>/ session</span></PriceTag>
            
            {isFullyBooked ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                This mentor is currently fully booked.
              </Alert>
            ) : (
              <Typography variant="body2" color="text.secondary" mb={3}>
                Select an available specific date and time for your session.
              </Typography>
            )}

            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              disabled={isFullyBooked} 
              onClick={() => setBookingOpen(true)}
              sx={{ 
                bgcolor: '#06112E', 
                '&:hover': { bgcolor: '#0a1d4a' },
                '&.Mui-disabled': { bgcolor: '#e0e0e0' }
              }}
            >
              {isFullyBooked ? "Currently Unavailable" : "Request Booking"}
            </Button>
          </BookingCard>
        </Sidebar>
      </ContentLayout>

      {/* Passing the correct dynamic mentor (with detailed slots) to the modal */}
      <RequestBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} mentor={mentor} />
    </Container>
  );
}