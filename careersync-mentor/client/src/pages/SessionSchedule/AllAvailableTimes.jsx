import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import CreateTimeSlotModal from '../../components/Modals/CreateTimeSlotModal'
import EditTimeSlotModal from '../../components/Modals/EditTimeSlotModal'
import DeleteTimeSlotModal from '../../components/Modals/DeleteTimeSlotModal'
import { AllAvailableTimesStyles } from './AllAvailableTimes.styles'

const availableTimesData = [
  {
    id: 1,
    date: 'Mon, Dec 23',
    duration: '60 min',
    time: '10:00 AM - 11:00 AM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '23/12/2025, 10:00 AM',
    endDateTime: '23/12/2025, 11:00 AM',
  },
  {
    id: 2,
    date: 'Mon, Dec 23',
    duration: '60 min',
    time: '2:00 PM - 3:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '23/12/2025, 2:00 PM',
    endDateTime: '23/12/2025, 3:00 PM',
  },
  {
    id: 3,
    date: 'Tue, Dec 24',
    duration: '60 min',
    time: '9:00 AM - 10:00 AM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '24/12/2025, 9:00 AM',
    endDateTime: '24/12/2025, 10:00 AM',
  },
  {
    id: 4,
    date: 'Tue, Dec 24',
    duration: '60 min',
    time: '3:00 PM - 4:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '24/12/2025, 3:00 PM',
    endDateTime: '24/12/2025, 4:00 PM',
  },
  {
    id: 5,
    date: 'Wed, Dec 25',
    duration: '60 min',
    time: '11:00 AM - 12:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '25/12/2025, 11:00 AM',
    endDateTime: '25/12/2025, 12:00 PM',
  },
  {
    id: 6,
    date: 'Thu, Dec 26',
    duration: '60 min',
    time: '1:00 PM - 2:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '26/12/2025, 1:00 PM',
    endDateTime: '26/12/2025, 2:00 PM',
  },
  {
    id: 7,
    date: 'Thu, Dec 26',
    duration: '60 min',
    time: '4:00 PM - 5:00 PM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '26/12/2025, 4:00 PM',
    endDateTime: '26/12/2025, 5:00 PM',
  },
  {
    id: 8,
    date: 'Fri, Dec 27',
    duration: '60 min',
    time: '10:00 AM - 11:00 AM',
    location: 'Starbucks, Seattle',
    price: '$60',
    startDateTime: '27/12/2025, 10:00 AM',
    endDateTime: '27/12/2025, 11:00 AM',
  },
]

function AllAvailableTimes() {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('Date')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

  const handleEdit = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setEditModalOpen(true)
  }

  const handleDelete = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setDeleteModalOpen(true)
  }

  return (
    <Box sx={AllAvailableTimesStyles.container}>
      {/* Header Section */}
      <Box sx={AllAvailableTimesStyles.headerSection}>
        <Box sx={AllAvailableTimesStyles.headerTopRow}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/session-schedule')}
            sx={AllAvailableTimesStyles.backButton}
          >
            Back to Schedule
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={AllAvailableTimesStyles.addButton}
          >
            Add New Times
          </Button>
        </Box>
        <Box sx={AllAvailableTimesStyles.titleSection}>
          <Typography variant="h4" sx={AllAvailableTimesStyles.mainTitle}>
            All Available Times
          </Typography>
          <Typography variant="body2" sx={AllAvailableTimesStyles.subtitle}>
            Manage your available time slots
          </Typography>
        </Box>
      </Box>

      {/* Sort Section */}
      <Box sx={AllAvailableTimesStyles.sortSection}>
        <Box sx={AllAvailableTimesStyles.sortGroup}>
          <FilterListIcon sx={AllAvailableTimesStyles.filterIcon} />
          <Typography variant="body2" sx={AllAvailableTimesStyles.sortLabel}>
            Sort by:
          </Typography>
          <Button
            variant={sortBy === 'Date' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('Date')}
            sx={AllAvailableTimesStyles.sortButton}
          >
            Date
          </Button>
          <Button
            variant={sortBy === 'Time' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('Time')}
            sx={AllAvailableTimesStyles.sortButton}
          >
            Time
          </Button>
          <Button
            variant={sortBy === 'Location' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('Location')}
            sx={AllAvailableTimesStyles.sortButton}
          >
            Location
          </Button>
          <Button
            variant={sortBy === 'Price' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('Price')}
            sx={AllAvailableTimesStyles.sortButton}
          >
            Price
          </Button>
        </Box>
      </Box>

      {/* Time Slots Grid */}
      <Grid container spacing={3}>
        {availableTimesData.map((timeSlot) => (
          <Grid item xs={12} sm={6} key={timeSlot.id}>
            <Card sx={AllAvailableTimesStyles.timeSlotCard}>
              <CardContent sx={AllAvailableTimesStyles.timeSlotContent}>
                <Box sx={AllAvailableTimesStyles.timeSlotHeader}>
                  <Box sx={AllAvailableTimesStyles.timeSlotHeaderLeft}>
                    <Typography variant="body1" sx={AllAvailableTimesStyles.timeSlotDate}>
                      {timeSlot.date}
                    </Typography>
                    <Typography variant="body2" sx={AllAvailableTimesStyles.timeSlotDuration}>
                      • {timeSlot.duration}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={AllAvailableTimesStyles.timeSlotPrice}>
                    {timeSlot.price}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={AllAvailableTimesStyles.timeSlotTime}>
                  {timeSlot.time}
                </Typography>
                <Box sx={AllAvailableTimesStyles.timeSlotLocation}>
                  <LocationOnIcon sx={AllAvailableTimesStyles.locationIcon} />
                  <Typography variant="body2" sx={AllAvailableTimesStyles.locationText}>
                    {timeSlot.location}
                  </Typography>
                </Box>
                <Box sx={AllAvailableTimesStyles.actionButtons}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(timeSlot)}
                    sx={AllAvailableTimesStyles.editButton}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={
                      <Box
                        component="img"
                        src="/delete-trach.svg"
                        alt=""
                        sx={{ width: 16, height: 16 }}
                      />
                    }
                    onClick={() => handleDelete(timeSlot)}
                    sx={AllAvailableTimesStyles.deleteButton}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modals */}
      <CreateTimeSlotModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <EditTimeSlotModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedTimeSlot(null)
        }}
        timeSlot={selectedTimeSlot}
      />
      <DeleteTimeSlotModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedTimeSlot(null)
        }}
        timeSlot={selectedTimeSlot}
      />
    </Box>
  )
}

export default AllAvailableTimes

