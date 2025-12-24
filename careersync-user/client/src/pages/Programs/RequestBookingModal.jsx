import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Typography, 
  Button, Box, IconButton, Paper, Divider, Stack
} from '@mui/material';
import { MdClose, MdCheckCircle, MdAccessTime } from 'react-icons/md';

export default function RequestBookingModal({ open, onClose, mentor }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setLoading(true);

    const payload = {
      mentor_id: mentor.id,
      price: mentor.price,
      timeslots: [{
        start_date: selectedSlot.start_date,
        end_date: selectedSlot.end_date
      }]
    };

    console.log("Submitting to backend:", payload);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setSelectedSlot(null);
    }, 300);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ p: 3, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={800} color="#06112E">
          {submitted ? 'Confirmation' : 'Select a Time'}
        </Typography>
        <IconButton onClick={handleClose}><MdClose /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {!submitted ? (
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                All sessions are <strong>60 minutes</strong> with {mentor?.name}.
              </Typography>

              {mentor?.slots?.length > 0 ? (
                <Stack spacing={2}>
                  {mentor.slots.map((slot) => {
                    // SAFE PARSING: Extract Month, Day Number, and Day Name
                    const dateParts = slot.date?.split(' ') || [];
                    const monthLabel = dateParts[0]?.toUpperCase() || "MON"; // e.g., "DEC"
                    const dayNumber = dateParts[1]?.replace(',', '') || "00"; // e.g., "22"
                    const dayName = slot.day?.substring(0, 3).toUpperCase() || "DAY"; // e.g., "MON"

                    return (
                      <Paper
                        key={slot.id}
                        elevation={0}
                        onClick={() => setSelectedSlot(slot)}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          borderRadius: 4,
                          border: '2px solid',
                          transition: '0.2s all ease',
                          borderColor: selectedSlot?.id === slot.id ? '#06112E' : '#F1F5F9',
                          bgcolor: selectedSlot?.id === slot.id ? '#F8FAFC' : '#fff',
                          '&:hover': { borderColor: '#06112E', bgcolor: '#F8FAFC' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* THE UPDATED DATE BLOCK */}
                            <Box sx={{ textAlign: 'center', minWidth: 65 }}>
                              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                {dayName}
                              </Typography>
                              <Typography variant="h5" fontWeight={900} color="#06112E" sx={{ lineHeight: 1, my: 0.5 }}>
                                {dayNumber}
                              </Typography>
                              <Typography variant="caption" fontWeight={800} color="#06112E" sx={{ textTransform: 'uppercase' }}>
                                {monthLabel}
                              </Typography>
                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ height: 40, my: 'auto' }} />

                            {/* THE TIME PART */}
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <MdAccessTime size={18} color="#06112E" />
                                <Typography variant="body1" fontWeight={800} color="#06112E">
                                  {slot.time || "Time TBD"}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                {dateParts[2] || "2025"}
                              </Typography>
                            </Box>
                          </Box>

                          {selectedSlot?.id === slot.id && <MdCheckCircle color="#06112E" size={24} />}
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body2" color="error">No available slots found for this mentor.</Typography>
              )}
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              disabled={loading || !selectedSlot}
              onClick={handleSubmit}
              sx={{ 
                bgcolor: '#06112E', 
                color: '#fff', 
                py: 1.5, 
                borderRadius: 2, 
                fontWeight: 800,
                '&:hover': { bgcolor: '#0a1d4a' }
              }}
            >
              {loading ? 'Confirming...' : 'Book This Session'}
            </Button>
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ mb: 2, display: 'inline-flex', p: 2, bgcolor: '#ECFDF5', borderRadius: '50%' }}>
              <MdCheckCircle size={48} color="#10B981" />
            </Box>
            <Typography variant="h5" fontWeight={800} color="#06112E" gutterBottom>
              Session Booked!
            </Typography>
            <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2, mt: 2, mb: 3 }}>
              <Typography variant="body1" fontWeight={700} color="#06112E">
                {selectedSlot?.day}, {selectedSlot?.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                at {selectedSlot?.time}
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={handleClose} 
              sx={{ borderColor: '#E2E8F0', color: '#64748B', fontWeight: 700 }}
            >
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}