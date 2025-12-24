import React from 'react'
import { Card, CardContent, Box, Typography } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'
import { StatCardStyles } from './StatCard.styles'
import BookingIcon from '../../../assets/icons/ttl-booking.svg'
import RevenueIcon from '../../../assets/icons/ttl-revenue.svg'
import CertificateIcon from '../../../assets/icons/ttl-certificate.svg'

const iconMap = {
  calendar: BookingIcon,
  dollar: RevenueIcon,
  certificate: CertificateIcon,
}

function StatCard({ title, value, change, icon }) {
  const IconSrc = iconMap[icon] || BookingIcon
  const formattedValue =
    title === 'Total Revenue'
      ? `$${value.toLocaleString()}`
      : value.toLocaleString()

  return (
    <Card sx={StatCardStyles.card}>
      <CardContent sx={StatCardStyles.content}>
        <Box sx={StatCardStyles.header}>
          <Box sx={StatCardStyles.iconContainer}>
            <img src={IconSrc} alt={title} style={StatCardStyles.icon} />
          </Box>
        </Box>
        <Typography variant="h4" sx={StatCardStyles.value}>
          {formattedValue}
        </Typography>
        <Typography variant="body2" sx={StatCardStyles.title}>
          {title}
        </Typography>
        <Box sx={StatCardStyles.changeContainer}>
          <TrendingUp sx={StatCardStyles.trendIcon} />
          <Typography variant="body2" sx={StatCardStyles.change}>
            +{change}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard

