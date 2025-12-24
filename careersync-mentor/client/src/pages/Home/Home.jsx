import React from 'react'
import { Grid, Box } from '@mui/material'
import {
  ComposedChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import StatCard from '../../components/UI/StatCard/StatCard'
import ChartCard from '../../components/UI/ChartCard/ChartCard'
import ScheduleCard from '../../components/UI/ScheduleCard/ScheduleCard'
import {
  dashboardStats,
  revenueBookingsData,
  weeklyPerformanceData,
  todaysSchedule,
} from '../../utils/mockData'
import { HomeStyles } from './Home.styles'

function Home() {
  return (
    <Box sx={HomeStyles.container}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Bookings"
            value={dashboardStats.totalBookings.value}
            change={dashboardStats.totalBookings.change}
            icon="calendar"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Revenue"
            value={dashboardStats.totalRevenue.value}
            change={dashboardStats.totalRevenue.change}
            icon="dollar"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Certifications"
            value={dashboardStats.certifications.value}
            change={dashboardStats.certifications.change}
            icon="certificate"
          />
        </Grid>

        {/* Revenue & Bookings Trend Chart */}
        <Grid item xs={12}>
          <ChartCard title="Revenue & Bookings Trend">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={revenueBookingsData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#42a5f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666666" />
                <YAxis yAxisId="left" stroke="#666666" />
                <YAxis yAxisId="right" orientation="right" stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#42a5f5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  name="Bookings"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#030C2B"
                  strokeWidth={2}
                  name="Revenue ($)"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Weekly Performance Chart */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Weekly Performance" height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="canceled" stackId="a" fill="#9e9e9e" name="Canceled" />
                <Bar dataKey="completed" stackId="a" fill="#42a5f5" name="Completed" />
                <Bar dataKey="incomplete" stackId="a" fill="#424242" name="Incomplete" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <ScheduleCard title="Today's Schedule" items={todaysSchedule} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home

