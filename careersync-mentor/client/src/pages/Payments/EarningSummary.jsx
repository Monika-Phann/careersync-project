import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Chip,
} from '@mui/material'
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterListIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { EarningSummaryStyles } from './EarningSummary.styles'

const incomeData = [
  { date: 'Oct 1', earnings: 450 },
  { date: 'Oct 2', earnings: 520 },
  { date: 'Oct 3', earnings: 480 },
  { date: 'Oct 4', earnings: 600 },
  { date: 'Oct 5', earnings: 550 },
  { date: 'Oct 6', earnings: 700 },
  { date: 'Oct 7', earnings: 650 },
  { date: 'Oct 8', earnings: 580 },
  { date: 'Oct 9', earnings: 620 },
  { date: 'Oct 10', earnings: 680 },
  { date: 'Oct 11', earnings: 720 },
  { date: 'Oct 12', earnings: 750 },
  { date: 'Oct 13', earnings: 800 },
  { date: 'Oct 14', earnings: 780 },
  { date: 'Oct 15', earnings: 850 },
  { date: 'Oct 16', earnings: 900 },
  { date: 'Oct 17', earnings: 950 },
  { date: 'Oct 18', earnings: 1000 },
  { date: 'Oct 19', earnings: 1050 },
  { date: 'Oct 20', earnings: 1100 },
  { date: 'Oct 21', earnings: 1080 },
  { date: 'Oct 22', earnings: 1120 },
  { date: 'Oct 23', earnings: 1150 },
  { date: 'Oct 24', earnings: 1100 },
]

const recentPayments = [
  {
    id: 'PAY-001',
    student: {
      name: 'Sarah Johnson',
      initials: 'SJ',
    },
    bookingId: 'CB0001',
    time: '10:30 AM',
    date: '11-02-2025',
    amount: 150,
  },
  {
    id: 'PAY-002',
    student: {
      name: 'Michael Chen',
      initials: 'MC',
    },
    bookingId: 'CB0002',
    time: '02:15 PM',
    date: '15-11-2025',
    amount: 200,
  },
  {
    id: 'PAY-003',
    student: {
      name: 'David Brown',
      initials: 'DB',
    },
    bookingId: 'CB0003',
    time: '04:30 PM',
    date: '16-11-2025',
    amount: 82.5,
  },
]

function EarningSummary() {
  return (
    <Box sx={EarningSummaryStyles.container}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={4}>
          <Card sx={EarningSummaryStyles.summaryCard}>
            <CardContent>
              <Box sx={EarningSummaryStyles.summaryTopRow}>
                <Typography variant="body2" sx={EarningSummaryStyles.cardLabel}>
                  Total&apos;s Earning
                </Typography>
                <Box sx={EarningSummaryStyles.summaryIconBox}>
                  <MoneyIcon sx={EarningSummaryStyles.summaryIcon} />
                </Box>
              </Box>
              <Typography variant="h4" sx={EarningSummaryStyles.cardValue}>
                $2,200
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={EarningSummaryStyles.summaryCard}>
            <CardContent>
              <Box sx={EarningSummaryStyles.summaryTopRow}>
                <Typography variant="body2" sx={EarningSummaryStyles.cardLabel}>
                  Last Month&apos;s Earning
                </Typography>
                <Box sx={EarningSummaryStyles.summaryIconBox}>
                  <MoneyIcon sx={EarningSummaryStyles.summaryIcon} />
                </Box>
              </Box>
              <Typography variant="h4" sx={EarningSummaryStyles.cardValue}>
                $1,200
              </Typography>
              <Typography variant="body2" sx={EarningSummaryStyles.cardSubtext}>
                October
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={EarningSummaryStyles.summaryCard}>
            <CardContent>
              <Box sx={EarningSummaryStyles.summaryTopRow}>
                <Typography variant="body2" sx={EarningSummaryStyles.cardLabel}>
                  Today&apos;s Earning
                </Typography>
                <Box sx={EarningSummaryStyles.summaryIconBox}>
                  <MoneyIcon sx={EarningSummaryStyles.summaryIcon} />
                </Box>
              </Box>
              <Typography variant="h4" sx={EarningSummaryStyles.cardValue}>
                $60
              </Typography>
              <Typography variant="body2" sx={EarningSummaryStyles.cardSubtext}>
                November 16 2025
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Income Statistics Chart */}
        <Grid item xs={12}>
          <Card sx={EarningSummaryStyles.chartCard}>
            <CardContent>
              <Typography variant="h6" sx={EarningSummaryStyles.chartTitle}>
                Income Statistics
              </Typography>
              <Typography
                variant="body2"
                sx={EarningSummaryStyles.chartSubtitle}
              >
                Your earnings over the last 30 days
              </Typography>
              <Box sx={EarningSummaryStyles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={incomeData}>
                    <defs>
                      <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1E88E5" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#1E88E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666666" />
                    <YAxis
                      stroke="#666666"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#1E88E5"
                      strokeWidth={2}
                      fill="url(#earningsFill)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#1E88E5' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters Row */}
        <Grid item xs={12}>
          <Card sx={EarningSummaryStyles.filtersCard}>
            <CardContent sx={EarningSummaryStyles.filtersContent}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={EarningSummaryStyles.filtersButton}
              >
                Filters
              </Button>
              <TextField
                placeholder="Search by student name..."
                size="small"
                sx={EarningSummaryStyles.filtersSearchField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={EarningSummaryStyles.searchIcon} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                sx={EarningSummaryStyles.filtersDateButton}
              >
                Oct 24, 2025
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Payments */}
        <Grid item xs={12}>
          <Card sx={EarningSummaryStyles.paymentsCard}>
            <CardContent>
              <Box sx={EarningSummaryStyles.paymentsHeader}>
                <Box>
                  <Typography variant="h6" sx={EarningSummaryStyles.sectionTitle}>
                    Recent Payments
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={EarningSummaryStyles.sectionSubtitle}
                  >
                    Latest user payments
                  </Typography>
                </Box>
              </Box>

              <Box sx={EarningSummaryStyles.paymentsList}>
                {recentPayments.map((payment) => (
                  <Box key={payment.id} sx={EarningSummaryStyles.paymentItem}>
                    <Box sx={EarningSummaryStyles.paymentLeft}>
                      <Avatar sx={EarningSummaryStyles.avatar}>
                        {payment.student.initials}
                      </Avatar>
                      <Box>
                        <Typography sx={EarningSummaryStyles.studentName}>
                          {payment.student.name}
                        </Typography>
                        <Typography sx={EarningSummaryStyles.bookingId}>
                          {payment.bookingId}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={EarningSummaryStyles.paymentRight}>
                      <Chip label={payment.date} size="small" sx={EarningSummaryStyles.dateChip} />
                      <Typography sx={EarningSummaryStyles.amount}>
                        ${payment.amount % 1 === 0 ? payment.amount : payment.amount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EarningSummary