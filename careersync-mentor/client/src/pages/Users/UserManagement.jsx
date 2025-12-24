import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import BookingSummaryCards from '../../components/UI/BookingSummaryCards/BookingSummaryCards'
import UserDetailsModal from '../../components/Modals/UserDetailsModal'
import { UserManagementStyles } from './user_management.styles'

const mockUsers = [
  {
    userId: 'U001',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      initials: 'SJ',
    },
    bookingId: 'BK-2025-1001',
    dateTime: '2025-11-15, 10:00 AM',
    amount: 120,
    status: 'Completed',
  },
  {
    userId: 'U002',
    user: {
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      initials: 'MC',
    },
    bookingId: 'BK-2025-1002',
    dateTime: '2025-11-15, 02:00 PM',
    amount: 90,
    status: 'Accepted',
  },
  {
    userId: 'U003',
    user: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      initials: 'ER',
    },
    bookingId: 'BK-2025-1003',
    dateTime: '2025-11-16, 11:00 AM',
    amount: 80.5,
    status: 'Incompleted',
  },
  {
    userId: 'U004',
    user: {
      name: 'James Wilson',
      email: 'james.w@email.com',
      initials: 'JW',
    },
    bookingId: 'BK-2025-1004',
    dateTime: '2025-11-16, 03:30 PM',
    amount: 150,
    status: 'Incompleted',
  },
  {
    userId: 'U005',
    user: {
      name: 'David Brown',
      email: 'david.b@email.com',
      initials: 'DB',
    },
    bookingId: 'BK-2025-1005',
    dateTime: '2025-11-17, 09:00 AM',
    amount: 100,
    status: 'Accepted',
  },
]

const stats = [
  { label: 'Total Users', value: 5, color: '#1976d2' },
  { label: 'Completed', value: 2, color: '#4caf50' },
  { label: 'Incompleted', value: 2, color: '#ff9800' },
]

const statusColors = {
  Completed: { color: '#008236', bgColor: '#E8F5E9', border: '#C8E6C9' },
  Accepted: { color: '#1447E6', bgColor: '#E8F0FF', border: '#C6D4FF' },
  Incompleted: { color: '#CA3500', bgColor: '#FFF3E0', border: '#FFD7A8' },
}

const statusMenuColors = {
  Accepted: '#1447E6',
  Completed: '#008236',
  Incompleted: '#CA3500',
}

const splitDateTime = (dateTime) => {
  if (!dateTime) return { date: '', time: '' }
  const parts = String(dateTime).split(',')
  return {
    date: parts[0]?.trim() || String(dateTime),
    time: parts.slice(1).join(',').trim(),
  }
}

function UserManagement() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)
  const [viewUser, setViewUser] = useState(null)

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleStatusChange = (status) => {
    // Handle status change logic
    console.log('Change status to:', status, 'for user:', selectedUser)
    handleMenuClose()
  }

  const handleView = (userRow) => {
    // Mock details for modal (UI-only)
    const [firstName, ...rest] = (userRow.user?.name || '').split(' ')
    const lastName = rest.join(' ')
    setViewUser({
      userId: userRow.userId,
      name: userRow.user?.name,
      email: userRow.user?.email,
      firstName,
      lastName,
      phone: '+1 (555) 567-8901',
      gender: 'Male',
      dateOfBirth: '1999-07-18',
      role: 'Student',
      status: 'Student',
      institution: 'Harvard University',
      topRightStatus: userRow.status,
    })
    setUserDetailsOpen(true)
  }

  return (
    <Box sx={UserManagementStyles.container}>
      <BookingSummaryCards stats={stats} />

      <Card sx={UserManagementStyles.card}>
        <CardContent sx={UserManagementStyles.content}>
          <Box sx={UserManagementStyles.header}>
            <Typography variant="h6" sx={UserManagementStyles.title}>
              All Users
            </Typography>
          </Box>

          <Box sx={UserManagementStyles.toolbar}>
            <TextField
              placeholder="Search users..."
              size="small"
              sx={UserManagementStyles.searchField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={UserManagementStyles.searchIcon} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={UserManagementStyles.filters}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={UserManagementStyles.filterButton}
              >
                Status: All
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                sx={UserManagementStyles.filterButton}
              >
                Date Range
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 720, md: 'auto' } }}>
              <TableHead>
                <TableRow sx={UserManagementStyles.headerRow}>
                  <TableCell sx={UserManagementStyles.headerCell}>User ID</TableCell>
                  <TableCell sx={UserManagementStyles.headerCell}>User</TableCell>
                  <TableCell sx={UserManagementStyles.headerCell}>Date & Time</TableCell>
                  <TableCell sx={UserManagementStyles.headerCell}>Mark</TableCell>
                  <TableCell sx={UserManagementStyles.headerCell}>Status</TableCell>
                  <TableCell sx={UserManagementStyles.headerCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.userId} sx={UserManagementStyles.tableRow}>
                    <TableCell>
                      <Typography sx={UserManagementStyles.userId}>
                        {user.userId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={UserManagementStyles.userCell}>
                        <Avatar sx={UserManagementStyles.avatar}>
                          {user.user.initials}
                        </Avatar>
                        <Box>
                          <Typography sx={UserManagementStyles.userName}>
                            {user.user.name}
                          </Typography>
                          <Typography sx={UserManagementStyles.userEmail}>
                            {user.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const { date, time } = splitDateTime(user.dateTime)
                        return (
                          <Box sx={UserManagementStyles.dateTimeCell}>
                            <Typography sx={UserManagementStyles.dateText}>{date}</Typography>
                            <Typography sx={UserManagementStyles.timeText}>{time}</Typography>
                          </Box>
                        )
                      })()}
                    </TableCell>
                    <TableCell sx={UserManagementStyles.markCell}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                        sx={UserManagementStyles.moreButton}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        sx={{
                          ...UserManagementStyles.statusChip,
                          color: statusColors[user.status]?.color || '#666666',
                          backgroundColor: statusColors[user.status]?.bgColor || '#F5F5F5',
                          border: `1px solid ${statusColors[user.status]?.border || '#E0E0E0'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={UserManagementStyles.viewButton}
                        onClick={() => handleView(user)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'user-actions-menu',
        }}
      >
        {(['Accepted', 'Completed', 'Incompleted']).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            sx={{
              color: statusMenuColors[status],
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#F5F5F5',
              },
            }}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>

      <UserDetailsModal
        open={userDetailsOpen}
        onClose={() => {
          setUserDetailsOpen(false)
          setViewUser(null)
        }}
        user={viewUser}
        topRightStatus={viewUser?.topRightStatus}
      />
    </Box>
  )
}

export default UserManagement