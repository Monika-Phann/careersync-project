import React, { useState, useEffect } from 'react'
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
import { EditTimeSlotModalStyles } from './EditTimeSlotModal.styles'

function EditTimeSlotModal({ open, onClose, timeSlot }) {
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')

  useEffect(() => {
    if (timeSlot) {
      setStartDateTime(timeSlot.startDateTime || '')
      setEndDateTime(timeSlot.endDateTime || '')
    }
  }, [timeSlot])

  const handleSave = () => {
    console.log('Updating time slot:', { startDateTime, endDateTime })
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
        sx: EditTimeSlotModalStyles.dialogPaper,
      }}
    >
      <DialogTitle sx={EditTimeSlotModalStyles.dialogTitle}>
        <Typography variant="h6" sx={EditTimeSlotModalStyles.title}>
          Edit Time Slots
        </Typography>
        <IconButton
          onClick={onClose}
          sx={EditTimeSlotModalStyles.closeButton}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={EditTimeSlotModalStyles.dialogContent}>
        <Box sx={EditTimeSlotModalStyles.formSection}>
          <TextField
            fullWidth
            label="Start Date & Time"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            sx={EditTimeSlotModalStyles.textField}
            placeholder="DD/MM/YYYY, HH:MM AM/PM"
          />
          <TextField
            fullWidth
            label="End Date & Time"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            sx={EditTimeSlotModalStyles.textField}
            placeholder="DD/MM/YYYY, HH:MM AM/PM"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={EditTimeSlotModalStyles.dialogActions}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={EditTimeSlotModalStyles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={EditTimeSlotModalStyles.saveButton}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditTimeSlotModal

