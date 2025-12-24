import {
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Button,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

export default function InvoiceModal({ open, onClose, booking }) {
  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ position: "relative", p: 4 }}>
        {/* Close */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Invoice Details
        </Typography>

        <Typography fontSize={14} color="text.secondary">
          Invoice ID: <strong>{booking.invoiceId}</strong>
        </Typography>

        <Typography fontSize={14} color="text.secondary">
          Booking ID: <strong>{booking.bookingId}</strong>
        </Typography>

        <Typography fontSize={14} color="text.secondary">
          Booking Date: <strong>{booking.bookingDate}</strong>
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Student */}
        <Box mb={3}>
          <Typography fontWeight={600} mb={1}>
            Student Information
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Student Name: <strong>{booking.studentName}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Program */}
        <Box mb={3}>
          <Typography fontWeight={600} mb={1}>
            Program Details
          </Typography>

          <InfoRow label="Program" value={booking.program} />
          <InfoRow label="Mentor" value={booking.mentorName} />
          <InfoRow label="Start Date" value={booking.startDate} />
          <InfoRow label="End Date" value={booking.endDate} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Pricing */}
        <Box mb={3}>
          <InfoRow
            label="Subtotal"
            value={`$${booking.subTotal}.00`}
            bold
          />

          <Box
            mt={2}
            p={2}
            borderRadius={2}
            bgcolor="#F3F6FA"
            display="flex"
            justifyContent="space-between"
          >
            <Typography fontWeight={600}>Total Amount</Typography>
            <Typography fontWeight={700} color="#2e7d32">
              ${booking.total}.00
            </Typography>
          </Box>
        </Box>

        {/* Action */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<DownloadOutlinedIcon />}
          sx={{
            background: "#E9EEF3",
            color: "#06112E",
            fontWeight: 600,
            "&:hover": {
              background: "#dfe6ec",
            },
          }}
        >
          Download Invoice
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/* Reusable row */
function InfoRow({ label, value, bold }) {
  return (
    <Box display="flex" justifyContent="space-between" mb={0.75}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={bold ? 600 : 500}>{value}</Typography>
    </Box>
  );
}
