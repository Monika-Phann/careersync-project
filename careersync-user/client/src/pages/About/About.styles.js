import { styled } from '@mui/material/styles'
import { Box, Container } from '@mui/material'

export const Section = styled(Box)({
  padding: '72px 0',
  '@media (max-width: 900px)': {
    padding: '48px 0',
  },
})

export const AboutLead = styled(Box)({
  maxWidth: 880,
  margin: '0 auto 36px',
})

export const TeamGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '18px',
})

export const TeamCardContent = styled(Box)({
  textAlign: 'center',
})

export const TeamMemberImage = styled('img')({
  width: '100%',
  height: 140,
  objectFit: 'cover',
  borderRadius: 8,
})

export const BioCard = styled(Box)(({ theme, white }) => ({
  display: 'grid',
  gridTemplateColumns: '200px 1fr',
  gap: '18px',
  alignItems: 'center',
  background: white ? '#fff' : '#f0f6ff',
  padding: '24px',
  borderRadius: 18,
  border: `1px solid ${white ? theme.palette.grey[200] : '#d8e8ff'}`,
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
  },
}))

export const BioImage = styled('img')({
  width: 160,
  height: 160,
  objectFit: 'cover',
  borderRadius: 8,
})

export const BioGrid = styled(Box)({
  display: 'grid',
  gap: '18px',
  marginTop: 30,
})

