import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { CreateTimeSlotModalStyles } from './CreateTimeSlotModal.styles'

function CreateTimeSlotModal({ open, onClose }) {
  const [startDateTime, setStartDateTime] = useState('23/12/2025, 10:00 AM')
  const [endDateTime, setEndDateTime] = useState('23/12/2025, 11:00 AM')

  const handleSave = () => {
    console.log('Creating time slot:', { startDateTime, endDateTime })
    onClose()
    // Handle save logic here
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: CreateTimeSlotModalStyles.dialogPaper,
      }}
    >
      <DialogTitle sx={CreateTimeSlotModalStyles.dialogTitle}>
        <Typography variant="h6" sx={CreateTimeSlotModalStyles.title}>
          Create New Time Slots
        </Typography>
        <IconButton
          onClick={onClose}
          sx={CreateTimeSlotModalStyles.closeButton}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={CreateTimeSlotModalStyles.dialogContent}>
        <Box sx={CreateTimeSlotModalStyles.formSection}>
          <TextField
            fullWidth
            label="Start Date & Time"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            sx={CreateTimeSlotModalStyles.textField}
            placeholder="DD/MM/YYYY, HH:MM AM/PM"
          />
          <TextField
            fullWidth
            label="End Date & Time"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            sx={CreateTimeSlotModalStyles.textField}
            placeholder="DD/MM/YYYY, HH:MM AM/PM"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={CreateTimeSlotModalStyles.dialogActions}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={CreateTimeSlotModalStyles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={CreateTimeSlotModalStyles.saveButton}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateTimeSlotModal

