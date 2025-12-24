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
  Pagination,
} from '@mui/material'
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import BookingSummaryCards from '../../components/UI/BookingSummaryCards/BookingSummaryCards'
import InvoiceDetailsModal from '../../components/Modals/InvoiceDetailsModal'
import { TotalInvoiceStyles } from './TotalInvoice.styles'

const mockInvoices = [
  {
    invoiceId: 'CB0001',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      initials: 'SJ',
    },
    bookingId: 'BK-2025-1001',
    dateTime: '2025-11-15, 10:00 AM',
    amount: 120,
    status: 'Paid',
  },
  {
    invoiceId: 'CB0002',
    user: {
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      initials: 'MC',
    },
    bookingId: 'BK-2025-1002',
    dateTime: '2025-11-15, 02:00 PM',
    amount: 90,
    status: 'Paid',
  },
  {
    invoiceId: 'CB0003',
    user: {
      name: 'David Brown',
      email: 'david.b@email.com',
      initials: 'DB',
    },
    bookingId: 'BK-2025-1004',
    dateTime: '2025-11-16, 11:00 AM',
    amount: 82.5,
    status: 'Pending',
  },
  {
    invoiceId: 'CB0004',
    user: {
      name: 'James Wilson',
      email: 'james.w@email.com',
      initials: 'JW',
    },
    bookingId: 'BK-2025-1005',
    dateTime: '2025-11-16, 03:30 PM',
    amount: 150,
    status: 'Canceled',
  },
]

const stats = [
  { label: 'Total Invoices', value: 4, color: '#1976d2' },
  { label: 'Paid', value: 2, color: '#4caf50' },
  { label: 'Pending', value: 1, color: '#ff9800' },
]

const statusColors = {
  Paid: { color: '#008236', bgColor: '#E8F5E9', border: '#C8E6C9' },
  Pending: { color: '#CA3500', bgColor: '#FFF3E0', border: '#FFD7A8' },
  Canceled: { color: '#B71C1C', bgColor: '#FFEBEE', border: '#FFCDD2' },
}

const splitDateTime = (dateTime) => {
  if (!dateTime) return { date: '', time: '' }
  const parts = String(dateTime).split(',')
  return {
    date: parts[0]?.trim() || String(dateTime),
    time: parts.slice(1).join(',').trim(),
  }
}

function TotalInvoice() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleMenuOpen = (event, invoice) => {
    setAnchorEl(event.currentTarget)
    setSelectedInvoice(invoice)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleView = (invoice) => {
    setSelectedInvoice(invoice)
    setDetailsOpen(true)
    handleMenuClose()
  }

  return (
    <Box sx={TotalInvoiceStyles.container}>
      <BookingSummaryCards stats={stats} />

      <Card sx={TotalInvoiceStyles.card}>
        <CardContent sx={TotalInvoiceStyles.content}>
          <Box sx={TotalInvoiceStyles.header}>
            <Typography variant="h6" sx={TotalInvoiceStyles.title}>
              All Invoices
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={TotalInvoiceStyles.downloadAllButton}
            >
              Download All
            </Button>
          </Box>

          <Box sx={TotalInvoiceStyles.toolbar}>
            <TextField
              placeholder="Search users..."
              size="small"
              sx={TotalInvoiceStyles.searchField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={TotalInvoiceStyles.searchIcon} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={TotalInvoiceStyles.filters}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={TotalInvoiceStyles.filterButton}
              >
                Status: All
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                sx={TotalInvoiceStyles.filterButton}
              >
                Date Range
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 780, md: 'auto' } }}>
              <TableHead>
                <TableRow sx={TotalInvoiceStyles.headerRow}>
                  <TableCell sx={TotalInvoiceStyles.headerCell}>
                    Invoice ID
                  </TableCell>
                  <TableCell sx={TotalInvoiceStyles.headerCell}>User</TableCell>
                  <TableCell sx={TotalInvoiceStyles.headerCell}>
                    Booking ID
                  </TableCell>
                  <TableCell sx={TotalInvoiceStyles.headerCell}>
                    Date & Time
                  </TableCell>
                  <TableCell sx={TotalInvoiceStyles.headerCell}>Amount</TableCell>
                  <TableCell sx={TotalInvoiceStyles.headerCell}>Status</TableCell>
                  <TableCell sx={TotalInvoiceStyles.headerCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.invoiceId} sx={TotalInvoiceStyles.tableRow}>
                    <TableCell>
                      <Typography sx={TotalInvoiceStyles.invoiceId}>
                        {invoice.invoiceId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={TotalInvoiceStyles.userCell}>
                        <Avatar sx={TotalInvoiceStyles.avatar}>
                          {invoice.user.initials}
                        </Avatar>
                        <Box>
                          <Typography sx={TotalInvoiceStyles.userName}>
                            {invoice.user.name}
                          </Typography>
                          <Typography sx={TotalInvoiceStyles.userEmail}>
                            {invoice.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={TotalInvoiceStyles.bookingId}>
                        {invoice.bookingId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const { date, time } = splitDateTime(invoice.dateTime)
                        return (
                          <Box sx={TotalInvoiceStyles.dateTimeCell}>
                            <Typography sx={TotalInvoiceStyles.dateText}>{date}</Typography>
                            <Typography sx={TotalInvoiceStyles.timeText}>{time}</Typography>
                          </Box>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      <Typography sx={TotalInvoiceStyles.amount}>
                        ${invoice.amount % 1 === 0 ? invoice.amount : invoice.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        size="small"
                        sx={{
                          ...TotalInvoiceStyles.statusChip,
                          color: statusColors[invoice.status]?.color || '#666666',
                          backgroundColor: statusColors[invoice.status]?.bgColor || '#F5F5F5',
                          border: `1px solid ${statusColors[invoice.status]?.border || '#E0E0E0'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={TotalInvoiceStyles.actionsCell}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleView(invoice)}
                          sx={TotalInvoiceStyles.viewButton}
                        >
                          View
                        </Button>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, invoice)}
                          sx={TotalInvoiceStyles.moreButton}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={TotalInvoiceStyles.pagination}>
            <Typography variant="body2" sx={TotalInvoiceStyles.paginationText}>
              Showing {mockInvoices.length} of {mockInvoices.length} invoices
            </Typography>
            <Pagination
              count={3}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'invoice-actions-menu',
        }}
      >
        <MenuItem onClick={() => handleView(selectedInvoice)}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download PDF</MenuItem>
        <MenuItem onClick={handleMenuClose}>Send Email</MenuItem>
      </Menu>

      <InvoiceDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        invoice={selectedInvoice}
      />
    </Box>
  )
}

export default TotalInvoice