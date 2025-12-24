import React, { useState } from 'react'
import { Box } from '@mui/material'
import BookingSummaryCards from '../../components/UI/BookingSummaryCards/BookingSummaryCards'
import BookingTable from '../../components/UI/BookingTable/BookingTable'
import BookingDetailsModal from '../../components/Modals/BookingDetailsModal'
import UserDetailsModal from '../../components/Modals/UserDetailsModal'
import BookingConfirmationModal from '../../components/Modals/BookingConfirmationModal'
import { TotalBookingRequestsStyles } from './TotalBookingRequests.styles'

const mockBookingRequests = [
  {
    id: 'BK-2025-1001',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      userId: 'U001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1 (555) 123-4567',
      gender: 'Female',
      dateOfBirth: '1995-05-15',
      status: 'Student',
      institution: 'Harvard University',
      joinedDate: '2025-11-10',
      lastActive: '2025-11-18',
      totalBookings: 5,
      totalSpent: 1200,
      role: 'Student',
    },
    dateTime: '2025-11-15, 10:00 AM',
    duration: '1 hour',
    amount: 120,
    status: 'Pending',
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
      userId: 'U002',
      firstName: 'Michael',
      lastName: 'Chen',
      phone: '+1 (555) 234-5678',
      gender: 'Male',
      dateOfBirth: '1998-08-20',
      status: 'Student',
      institution: 'MIT',
      joinedDate: '2025-11-12',
      lastActive: '2025-11-19',
      totalBookings: 3,
      totalSpent: 450,
      role: 'Student',
    },
    dateTime: '2025-11-15, 02:00 PM',
    duration: '45 mins',
    amount: 90,
    status: 'Pending',
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
      userId: 'U006',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      phone: '+1 (555) 567-8931',
      gender: 'Female',
      dateOfBirth: '1997-10-18',
      status: 'Employee',
      institution: 'TechCorp Solutions',
      joinedDate: '2025-09-15',
      lastActive: '2025-11-20',
      totalBookings: 1,
      totalSpent: 50,
      role: 'Employee',
    },
    dateTime: '2025-11-16, 11:00 AM',
    duration: '30 mins',
    amount: 75,
    status: 'Pending',
    programName: 'Software developer',
    meetingDate: '2025-12-16',
    bookingDate: '2025-11-16',
    meetingLocation: 'Starbucks, Seattle',
  },
  {
    id: 'BK-2025-1004',
    user: {
      name: 'David Brown',
      email: 'david.b@email.com',
      userId: 'U005',
      firstName: 'David',
      lastName: 'Brown',
      phone: '+1 (555) 567-8901',
      gender: 'Male',
      dateOfBirth: '1999-07-18',
      status: 'Student',
      institution: 'Harvard University',
      joinedDate: '2025-11-15',
      lastActive: '2025-11-18',
      totalBookings: 2,
      totalSpent: 1800,
      role: 'Student',
    },
    dateTime: '2025-11-16, 03:30 PM',
    duration: '1 hour',
    amount: 150,
    status: 'Pending',
    programName: 'Software developer',
    meetingDate: '2025-12-16',
    bookingDate: '2025-11-16',
    meetingLocation: 'Starbucks, Seattle',
  },
]

const mockBookingHistory = [
  {
    ...mockBookingRequests[0],
    status: 'Accepted',
  },
  {
    ...mockBookingRequests[1],
    status: 'Accepted',
  },
  {
    ...mockBookingRequests[2],
    status: 'Rejected',
  },
  {
    ...mockBookingRequests[3],
    status: 'Rejected',
  },
]

const requestStats = [
  { label: 'Total Booking Requests', value: 4, color: '#1976d2' },
  { label: 'Accepted', value: 2, color: '#4caf50' },
  { label: 'Rejected', value: 2, color: '#f44336' },
]

function TotalBookingRequests() {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [confirmationType, setConfirmationType] = useState('accepted')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleView = (booking) => {
    // For booking requests, show user details
    setSelectedUser(booking.user)
    setUserDetailsModalOpen(true)
  }

  const handleAccept = (booking) => {
    // Handle accept logic
    setConfirmationType('accepted')
    setConfirmationModalOpen(true)
    // In real app, update booking status and refresh list
  }

  const handleReject = (booking) => {
    // Handle reject logic
    setConfirmationType('rejected')
    setConfirmationModalOpen(true)
    // In real app, update booking status and refresh list
  }

  const handleUserAccept = (user) => {
    // Handle user accept logic - find the booking by user
    const booking = mockBookingRequests.find(b => b.user.userId === user.userId)
    if (booking) {
      handleAccept(booking)
    }
  }

  const handleUserReject = (user) => {
    // Handle user reject logic - find the booking by user
    const booking = mockBookingRequests.find(b => b.user.userId === user.userId)
    if (booking) {
      handleReject(booking)
    }
  }

  return (
    <Box sx={TotalBookingRequestsStyles.container}>
      <BookingSummaryCards stats={requestStats} />

      <BookingTable
        title="All Booking Requests"
        bookings={mockBookingRequests}
        showAcceptReject={true}
        showActions={true}
        onView={handleView}
        onAccept={handleAccept}
        onReject={handleReject}
        currentPage={1}
        totalPages={1}
        totalItems={mockBookingRequests.length}
      />

      <BookingDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        booking={selectedBooking}
      />

      <UserDetailsModal
        open={userDetailsModalOpen}
        onClose={() => setUserDetailsModalOpen(false)}
        user={selectedUser}
        onAccept={handleUserAccept}
        onReject={handleUserReject}
      />

      <BookingConfirmationModal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        type={confirmationType}
      />
    </Box>
  )
}

export default TotalBookingRequests

