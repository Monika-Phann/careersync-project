import React, { useState } from 'react'
import { Box } from '@mui/material'
import BookingSummaryCards from '../../components/UI/BookingSummaryCards/BookingSummaryCards'
import BookingTable from '../../components/UI/BookingTable/BookingTable'
import BookingDetailsModal from '../../components/Modals/BookingDetailsModal'
import { TotalBookingsStyles } from './TotalBookings.styles'

const mockBookings = [
  {
    id: 'BK-2025-1001',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
    },
    dateTime: '2025-11-15, 10:00 AM',
    duration: '6 hour',
    amount: 60,
    status: 'Accepted',
    programName: 'Software developer',
    meetingDate: '2025-12-15',
    bookingDate: '2025-11-15',
    meetingLocation: 'Starbucks, Seattle',
  },
  {
    id: 'BK-2025-1002',
    user: {
      name: 'Michael Chen',
      email: 'michael.c@email.com',
    },
    dateTime: '2025-11-15, 02:00 PM',
    duration: '6 hour',
    amount: 60,
    status: 'Accepted',
    programName: 'Software developer',
    meetingDate: '2025-12-15',
    bookingDate: '2025-11-15',
    meetingLocation: 'Starbucks, Seattle',
  },
  {
    id: 'BK-2025-1003',
    user: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
    },
    dateTime: '2025-11-16, 11:00 AM',
    duration: '6 hour',
    amount: 60,
    status: 'Rejected',
    programName: 'Software developer',
    meetingDate: '2025-12-15',
    bookingDate: '2025-11-16',
    meetingLocation: 'Starbucks, Seattle',
  },
  {
    id: 'BK-2025-1004',
    user: {
      name: 'David Brown',
      email: 'david.b@email.com',
    },
    dateTime: '2025-11-16, 03:30 PM',
    duration: '6 hour',
    amount: 60,
    status: 'Rejected',
    programName: 'Software developer',
    meetingDate: '2025-12-16',
    bookingDate: '2025-11-16',
    meetingLocation: 'Starbucks, Seattle',
  },
]

const stats = [
  { label: 'Total Bookings', value: 10, color: '#1976d2' },
  { label: 'Accepted', value: 5, color: '#4caf50' },
  { label: 'Rejected', value: 5, color: '#f44336' },
]

function TotalBookings() {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const handleView = (booking) => {
    setSelectedBooking(booking)
    setDetailsModalOpen(true)
  }

  const handleExport = () => {
    // Handle export logic
    console.log('Exporting bookings...')
  }

  return (
    <Box sx={TotalBookingsStyles.container}>
      <BookingSummaryCards stats={stats} />
      <BookingTable
        title="All Bookings"
        bookings={mockBookings}
        showActions={true}
        onView={handleView}
        onExport={handleExport}
        currentPage={1}
        totalPages={1}
        totalItems={mockBookings.length}
      />
      <BookingDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        booking={selectedBooking}
      />
    </Box>
  )
}

export default TotalBookings

