import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
} from '@mui/material'
import {
  LocationOn as LocationOnIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material'
import { SessionScheduleStyles } from './SessionSchedule.styles'

const sessionsData = [
  {
    id: 1,
    status: 'BOOKED',
    date: 'Mon, Dec 23',
    duration: '60 min',
    time: '10:00 AM - 11:00 AM',
    location: 'Starbucks, Seattle',
    price: '$60',
    bookedBy: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
    },
  },
  {
    id: 2,
    status: 'AVAILABLE',
    date: 'Mon, Dec 23',
    duration: '60 min',
    time: '2:00 PM - 3:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
  },
  {
    id: 3,
    status: 'BOOKED',
    date: 'Tue, Dec 24',
    duration: '60 min',
    time: '9:00 AM - 10:00 AM',
    location: 'Starbucks, Seattle',
    price: '$60',
    bookedBy: {
      name: 'Michael Chen',
      email: 'm.chen@email.com',
    },
  },
  {
    id: 4,
    status: 'AVAILABLE',
    date: 'Tue, Dec 24',
    duration: '60 min',
    time: '3:00 PM - 4:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
  },
  {
    id: 5,
    status: 'BOOKED',
    date: 'Wed, Dec 25',
    duration: '60 min',
    time: '11:00 AM - 12:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    bookedBy: {
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
    },
  },
  {
    id: 6,
    status: 'AVAILABLE',
    date: 'Thu, Dec 26',
    duration: '60 min',
    time: '1:00 PM - 2:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
  },
  {
    id: 7,
    status: 'BOOKED',
    date: 'Thu, Dec 26',
    duration: '60 min',
    time: '4:00 PM - 5:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    bookedBy: {
      name: 'David Martinez',
      email: 'david.m@email.com',
    },
  },
  {
    id: 8,
    status: 'AVAILABLE',
    date: 'Fri, Dec 27',
    duration: '60 min',
    time: '10:00 AM - 11:00 AM',
    location: 'Starbucks, Seattle',
    price: '$60',
  },
  {
    id: 9,
    status: 'BOOKED',
    date: 'Fri, Dec 27',
    duration: '60 min',
    time: '2:00 PM - 3:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    bookedBy: {
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
    },
  },
]

function SessionSchedule() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const totalSessions = sessionsData.length
  const bookedSessions = sessionsData.filter((s) => s.status === 'BOOKED').length
  const availableSlots = sessionsData.filter((s) => s.status === 'AVAILABLE').length

  const filteredSessions = sessionsData.filter((session) => {
    if (filter === 'All') return true
    if (filter === 'Available') return session.status === 'AVAILABLE'
    if (filter === 'Booked') return session.status === 'BOOKED'
    return true
  })

  return (
    <Box sx={SessionScheduleStyles.container}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={SessionScheduleStyles.summaryCards}>
        <Grid item xs={12} sm={4}>
          <Card sx={SessionScheduleStyles.summaryCard}>
            <CardContent sx={SessionScheduleStyles.summaryCardContent}>
              <Box sx={SessionScheduleStyles.summaryContent}>
                <Box sx={SessionScheduleStyles.summaryTopRow}>
                  <Box
                    component="img"
                    src="/ttl-session.svg"
                    alt="Total Sessions"
                    sx={SessionScheduleStyles.summaryIcon}
                  />
                  <Typography variant="body2" sx={SessionScheduleStyles.summaryLabel}>
                    Total Sessions
                  </Typography>
                </Box>
                <Typography variant="h4" sx={SessionScheduleStyles.summaryValue}>
                  {totalSessions}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={SessionScheduleStyles.summaryCard}>
            <CardContent sx={SessionScheduleStyles.summaryCardContent}>
              <Box sx={SessionScheduleStyles.summaryContent}>
                <Box sx={SessionScheduleStyles.summaryTopRow}>
                  <Box
                    component="img"
                    src="/booking-session.svg"
                    alt="Booked Sessions"
                    sx={SessionScheduleStyles.summaryIcon}
                  />
                  <Typography variant="body2" sx={SessionScheduleStyles.summaryLabel}>
                    Booked Sessions
                  </Typography>
                </Box>
                <Typography variant="h4" sx={SessionScheduleStyles.summaryValue}>
                  {bookedSessions}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={SessionScheduleStyles.summaryCard}>
            <CardContent sx={SessionScheduleStyles.summaryCardContent}>
              <Box sx={SessionScheduleStyles.summaryContent}>
                <Box sx={SessionScheduleStyles.summaryTopRow}>
                  <Box
                    component="img"
                    src="/ava-slot.svg"
                    alt="Available Slots"
                    sx={SessionScheduleStyles.summaryIcon}
                  />
                  <Typography variant="body2" sx={SessionScheduleStyles.summaryLabel}>
                    Available Slots
                  </Typography>
                </Box>
                <Typography variant="h4" sx={SessionScheduleStyles.summaryValue}>
                  {availableSlots}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Sort Section */}
      <Box sx={SessionScheduleStyles.filterSortSection}>
        <Box sx={SessionScheduleStyles.filterGroup}>
          <Box sx={SessionScheduleStyles.filterLabelContainer}>
            <FilterListIcon sx={SessionScheduleStyles.filterIcon} />
            <Typography variant="body2" sx={SessionScheduleStyles.filterLabel}>
              Filter:
            </Typography>
          </Box>
          <Button
            variant={filter === 'All' ? 'contained' : 'outlined'}
            onClick={() => setFilter('All')}
            sx={SessionScheduleStyles.filterButton}
          >
            All ({totalSessions})
          </Button>
          <Button
            variant={filter === 'Available' ? 'contained' : 'outlined'}
            onClick={() => setFilter('Available')}
            sx={SessionScheduleStyles.filterButton}
          >
            Available ({availableSlots})
          </Button>
          <Button
            variant={filter === 'Booked' ? 'contained' : 'outlined'}
            onClick={() => setFilter('Booked')}
            sx={SessionScheduleStyles.filterButton}
          >
            Booked ({bookedSessions})
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/session-schedule/available-times')}
          sx={SessionScheduleStyles.viewAllButton}
        >
          View All Available Times
        </Button>
      </Box>

      {/* Session Cards Grid */}
      <Grid container spacing={3}>
        {filteredSessions.map((session) => (
          <Grid item xs={12} sm={6} md={4} key={session.id}>
            <Card
              sx={{
                ...SessionScheduleStyles.sessionCard,
                border:
                  session.status === 'BOOKED'
                    ? '2px solid #4CAF50'
                    : '2px solid #E0E0E0',
              }}
            >
              <CardContent sx={SessionScheduleStyles.sessionCardContent}>
                <Box sx={SessionScheduleStyles.sessionCardHeader}>
                  <Chip
                    label={session.status}
                    sx={{
                      ...SessionScheduleStyles.statusChip,
                      backgroundColor:
                        session.status === 'BOOKED' ? '#0B7A39' : '#FF9800',
                      color: '#ffffff',
                    }}
                  />
                  <Typography variant="h6" sx={SessionScheduleStyles.sessionPrice}>
                    {session.price}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={SessionScheduleStyles.sessionDate}>
                  {session.date}
                </Typography>
                <Typography variant="body2" sx={SessionScheduleStyles.sessionDuration}>
                  {session.duration}
                </Typography>
                <Typography variant="body2" sx={SessionScheduleStyles.sessionTime}>
                  {session.time}
                </Typography>
                <Box sx={SessionScheduleStyles.sessionLocation}>
                  <LocationOnIcon sx={SessionScheduleStyles.locationIcon} />
                  <Typography variant="body2" sx={SessionScheduleStyles.locationText}>
                    {session.location}
                  </Typography>
                </Box>
                {session.bookedBy && (
                  <Box sx={SessionScheduleStyles.bookedBySection}>
                    <Typography variant="body2" sx={SessionScheduleStyles.bookedByLabel}>
                      Booked by:
                    </Typography>
                    <Typography variant="body2" sx={SessionScheduleStyles.bookedByName}>
                      {session.bookedBy.name}
                    </Typography>
                    <Typography variant="body2" sx={SessionScheduleStyles.bookedByEmail}>
                      {session.bookedBy.email}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default SessionSchedule

