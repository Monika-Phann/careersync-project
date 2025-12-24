import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Circle } from "@mui/icons-material";
import { InputAdornment, Box, Typography } from "@mui/material";
import { MOCK_MENTORS } from "../../data/mockData"; 

import {
  PageContainer,
  HeaderSection,
  Title,
  Subtitle,
  SearchWrapper,
  StyledInput,
  MentorGrid,
  MentorCard,
  MentorInfo,
  MentorName,
  MentorRole,
  StatsRow,
  Badge,
  ViewProfileButton
} from "./MentorBrowse.styles";

const CATEGORIES = ["All", "Information Technology", "Banking & Finance"];

export default function MentorBrowse() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  // CRASH FIX: Added optional chaining (?.) to prevent "toLowerCase of undefined"
  const filteredMentors = MOCK_MENTORS.filter((mentor) => {
    const searchLower = search.toLowerCase();
    
    const matchesSearch =
      mentor.name?.toLowerCase().includes(searchLower) ||
      mentor.role?.toLowerCase().includes(searchLower) ||
      mentor.category?.toLowerCase().includes(searchLower) ||
      mentor.company?.toLowerCase().includes(searchLower);

    const matchesCategory =
      activeCategory === "All" || mentor.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      <HeaderSection>
        <Title>Find Your Mentor</Title>
        <Subtitle>Connect with professionals for personalized shadowing sessions</Subtitle>
        
        <SearchWrapper>
          <StyledInput
            placeholder="Search by name, role, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#7A8699" }} />
                </InputAdornment>
              ),
            }}
          />
        </SearchWrapper>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <Box
              key={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                px: 2, py: 1, borderRadius: 2, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                bgcolor: activeCategory === cat ? '#06112E' : '#E9EEF3',
                color: activeCategory === cat ? '#fff' : '#06112E',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: activeCategory === cat ? '#06112E' : '#dfe6ec' }
              }}
            >
              {cat}
            </Box>
          ))}
        </Box>
      </HeaderSection>

      <MentorGrid>
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <MentorCard 
              key={mentor.id} 
              sx={{ 
                opacity: mentor.availability === "Fully Booked" ? 0.8 : 1,
                cursor: mentor.availability === "Fully Booked" ? 'default' : 'pointer'
              }}
            >
              <img src={mentor.avatar} alt={mentor.name} />
              <MentorInfo>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Badge info>{mentor.category || "General"}</Badge>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Circle sx={{ fontSize: 8, color: mentor.availability === "Available" ? "#10b981" : "#ef4444" }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: mentor.availability === "Available" ? "#10b981" : "#ef4444" }}>
                      {mentor.availability || "Status Unknown"}
                    </Typography>
                  </Box>
                </Box>

                <MentorName>{mentor.name}</MentorName>
                <MentorRole>{mentor.role} @ {mentor.company}</MentorRole>
                
                <StatsRow>
                  ⭐ {mentor.rating || 0} ({mentor.reviews || 0} reviews) • <strong>${mentor.price || 0}</strong>
                </StatsRow>

                <ViewProfileButton 
                  variant="contained" 
                  disabled={mentor.availability === "Fully Booked"}
                  onClick={() => navigate(`/mentor/${mentor.id}`)}
                  sx={{ 
                    bgcolor: mentor.availability === "Fully Booked" ? "#BDC3C7" : "#06112E",
                    '&:hover': { bgcolor: mentor.availability === "Fully Booked" ? "#BDC3C7" : "#0a1d4a" }
                  }}
                >
                  {mentor.availability === "Fully Booked" ? "Fully Booked" : "View Profile"}
                </ViewProfileButton>
              </MentorInfo>
            </MentorCard>
          ))
        ) : (
          <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No mentors found matching your search.</Typography>
            <Typography 
              color="primary" 
              sx={{ cursor: 'pointer', mt: 1, textDecoration: 'underline' }} 
              onClick={() => {setSearch(""); setActiveCategory("All");}}
            >
              Reset all filters
            </Typography>
          </Box>
        )}
      </MentorGrid>
    </PageContainer>
  );
}