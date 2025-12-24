import { useMemo, useState, useEffect } from 'react'
import { Container, Typography, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai'; // 1. Import useAtom
import { authAtom } from '../../store/authAtom'; // 2. Import authAtom

import { fetchProgramsList } from '../../data/apiService'

import SectionHeading from '../../components/UI/SectionHeading/SectionHeading'
import Badge from '../../components/UI/Badge/Badge'
import Button from '../../components/UI/Button/Button'
import Card from '../../components/UI/Card/Card'

import {
  Section,
  FilterRow,
  FilterChip,
  ProgramGrid,
  ProgramCardContent,
  ProgramImage,
} from './Programs.styles'

const categories = ['All Industries', 'Information Technology', 'Banking & Finance', 'Media & Creative']

function Programs({ defaultCategory = 'Information Technology' }) {
  const [auth] = useAtom(authAtom); // 3. Initialize auth state
  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const getPrograms = async () => {
      try {
        setLoading(true)
        const data = await fetchProgramsList()
        setPrograms(data)
      } catch (err) {
        setError('Failed to fetch programs')
      } finally {
        setLoading(false)
      }
    }

    getPrograms()
  }, [])

  const filteredPrograms = useMemo(() => {
    if (activeCategory === 'All Industries') return programs
    return programs.filter((item) => item.category === activeCategory)
  }, [programs, activeCategory])

  if (loading) {
    return (
      <Section sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Section>
    )
  }
  if (error) {
    return (
      <Section><Container><Typography color="error">{error}</Typography></Container></Section>
    )
  }

  return (
    <Section
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          title="Shadowing Programs"
          subtitle="Experience real-world careers firsthand. Shadow professionals and find your perfect career path through immersive programs"
        />

        <FilterRow>
          {categories.map((category) => (
            <FilterChip
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </FilterChip>
          ))}
        </FilterRow>

        <ProgramGrid>
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((item) => (
              <Card key={item.id}>
                <ProgramCardContent>
                  <Badge>{item.category}</Badge>
                  <ProgramImage src={item.image} alt={item.title} />
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', my: 2 }}>
                    {item.description}
                  </Typography>
                  <Button 
                    variant="secondary" 
                    fullWidth
                    onClick={() => {
                      // Now 'auth' is defined and can check authentication status
                      if (auth.isAuthenticated) {
                        navigate(`/mentors?search=${item.title}`);
                      } else {
                        navigate('/signin');
                      }
                    }}
                  >
                    View Available Mentors
                  </Button>
                </ProgramCardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ gridColumn: '1/-1', textAlign: 'center', py: 5 }}>
              No programs found in this category.
            </Typography>
          )}
        </ProgramGrid>
      </Container>
    </Section>
  )
}

export default Programs