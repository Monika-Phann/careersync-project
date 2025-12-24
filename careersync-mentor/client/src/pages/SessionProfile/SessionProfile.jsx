import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  Avatar,
  IconButton,
} from '@mui/material'
import {
  Business as BusinessIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  CameraAlt as CameraIcon,
  Close as CloseIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import SessionAgendaModal from '../../components/Modals/SessionAgendaModal'
import { SessionProfileStyles } from './SessionProfile.styles'

const initialMentorData = {
  fullName: 'Marcus Johnson',
  jobTitle: 'Senior Data Analyst',
  employmentType: 'Freelance',
  experience: '9',
  sessionsCompleted: '83',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  about:
    'Data analyst with 9 years of experience transforming complex datasets into actionable business insights at Microsoft. I specialize in data visualization, SQL optimization, and building scalable BI solutions. My passion is helping aspiring analysts develop the technical and strategic skills needed to succeed in data-driven roles.',
  expertise: ['Data Visualization', 'SQL & Python', 'Business Intelligence', 'Predictive Analytics'],
  education: [
    {
      degree: 'M.S. Computer Science',
      year: '2012',
      institution: 'Stanford University',
    },
    {
      degree: 'B.S. Computer Engineering',
      year: '2010',
      institution: 'MIT',
    },
  ],
  sessionRate: '60',
  meetingLocation: 'Starbucks, Seattle',
  email: 'marcus.johnson@analytics.com',
  phone: '+1 (555) 987-6543',
  linkedin: 'LinkedIn',
  portfolio: 'CV / Portfolio',
  availableSessions: [
    {
      day: 'Mon, Dec 23',
      duration: '60 min',
      time: '10:00 AM - 11:00 AM',
      location: 'Starbucks, Seattle',
      price: '$60',
    },
    {
      day: 'Mon, Dec 23',
      duration: '60 min',
      time: '2:00 PM - 3:00 PM',
      location: 'Starbucks, Seattle',
      price: '$60',
    },
    {
      day: 'Tue, Dec 24',
      duration: '60 min',
      time: '9:00 AM - 10:00 AM',
      location: 'Starbucks, Seattle',
      price: '$60',
    },
    {
      day: 'Tue, Dec 24',
      duration: '60 min',
      time: '3:00 PM - 4:00 PM',
      location: 'Starbucks, Seattle',
      price: '$60',
    },
    {
      day: 'Wed, Dec 25',
      duration: '60 min',
      time: '11:00 AM - 12:00 PM',
      location: 'Starbucks, Seattle',
      price: '$60',
    },
  ],
}

function SessionProfile() {
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)
  const [agendaModalOpen, setAgendaModalOpen] = useState(false)
  const [profileData, setProfileData] = useState(initialMentorData)
  const [newExpertise, setNewExpertise] = useState('')
  const [newEducation, setNewEducation] = useState({ degree: '', year: '', institution: '' })


  const handleEditProfile = () => {
    setIsEditMode(true)
  }

  const handleCancel = () => {
    setIsEditMode(false)
    setProfileData(initialMentorData)
    setNewExpertise('')
    setNewEducation({ degree: '', year: '', institution: '' })
  }

  const handleSave = () => {
    console.log('Saving profile data:', profileData)
    setIsEditMode(false)
    // Handle save logic here
  }

  const handleFieldChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setProfileData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }))
      setNewExpertise('')
    }
  }

  const handleRemoveExpertise = (index) => {
    setProfileData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }))
  }

  const handleAddEducation = () => {
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: '', year: '', institution: '' }],
    }))
  }

  const handleRemoveEducation = (index) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const handleEducationFieldChange = (index, field, value) => {
    const newEducation = [...profileData.education]
    newEducation[index][field] = value
    setProfileData((prev) => ({ ...prev, education: newEducation }))
  }

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0]
    if (file) {
      console.log(`Uploading ${type}:`, file.name)
      // Handle file upload logic
    }
  }

  return (
    <Box sx={SessionProfileStyles.container}>
      {/* Action Buttons - Only shown in edit mode */}
      {isEditMode && (
        <Box sx={SessionProfileStyles.actionButtonsContainer}>
          <Button
            variant="outlined"
            sx={SessionProfileStyles.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={SessionProfileStyles.saveButton}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      )}
      <Grid container spacing={3}>
        {/* Main Content - Left Column */}
        <Grid item xs={12} md={8}>
          {/* Profile Header Card */}
          <Card sx={SessionProfileStyles.card}>
            <CardContent sx={SessionProfileStyles.cardContent}>
              {isEditMode ? (
                <Box sx={SessionProfileStyles.profileEditContainer}>
                  <Box sx={SessionProfileStyles.avatarWrapper}>
                    <Avatar
                      src={profileData.image}
                      alt={profileData.fullName}
                      sx={SessionProfileStyles.profileAvatar}
                    />
                    <IconButton
                      sx={SessionProfileStyles.cameraButton}
                      component="label"
                      aria-label="upload picture"
                    >
                      <CameraIcon />
                      <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload('profile', e)} />
                    </IconButton>
                  </Box>
                  <Box sx={SessionProfileStyles.formSection}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={profileData.jobTitle}
                      onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <TextField
                      fullWidth
                      label="Employment Type"
                      value={profileData.employmentType}
                      onChange={(e) => handleFieldChange('employmentType', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <TextField
                      fullWidth
                      label="Experience (years)"
                      value={profileData.experience}
                      onChange={(e) => handleFieldChange('experience', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <TextField
                      fullWidth
                      label="Sessions Completed"
                      value={`${profileData.sessionsCompleted} mentoring sessions completed`}
                      disabled
                      sx={SessionProfileStyles.sessionsCompletedField}
                    />
                    <Typography variant="caption" sx={SessionProfileStyles.updatedText}>
                      Updated from User Management
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={SessionProfileStyles.profileHeader}>
                  <Box
                    component="img"
                    src={profileData.image}
                    alt={profileData.fullName}
                    sx={SessionProfileStyles.avatar}
                  />
                  <Box sx={SessionProfileStyles.profileInfo}>
                    <Typography variant="h4" sx={SessionProfileStyles.name}>
                      {profileData.fullName}
                    </Typography>
                    <Typography variant="h6" sx={SessionProfileStyles.title}>
                      {profileData.jobTitle}
                    </Typography>
                    <Box sx={SessionProfileStyles.metaInfo}>
                      <Box sx={SessionProfileStyles.metaItem}>
                        <BusinessIcon sx={SessionProfileStyles.metaIcon} />
                        <Typography variant="body2">{profileData.employmentType}</Typography>
                      </Box>
                      <Box sx={SessionProfileStyles.metaItem}>
                        <SchoolIcon sx={SessionProfileStyles.metaIcon} />
                        <Typography variant="body2">{profileData.experience} years of experience</Typography>
                      </Box>
                      <Box sx={SessionProfileStyles.metaItem}>
                        <CheckCircleIcon sx={SessionProfileStyles.metaIcon} />
                        <Typography variant="body2">{profileData.sessionsCompleted} mentoring sessions completed</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* About Section Card */}
          <Card sx={SessionProfileStyles.card}>
            <CardContent sx={SessionProfileStyles.cardContent}>
              <Typography variant="h6" sx={SessionProfileStyles.sectionTitle}>
                About
              </Typography>
              {isEditMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={profileData.about}
                  onChange={(e) => handleFieldChange('about', e.target.value)}
                  sx={SessionProfileStyles.textField}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <Typography variant="body1" sx={SessionProfileStyles.aboutText}>
                  {profileData.about}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Expertise Section Card */}
          <Card sx={SessionProfileStyles.card}>
            <CardContent sx={SessionProfileStyles.cardContent}>
              <Typography variant="h6" sx={SessionProfileStyles.sectionTitle}>
                Expertise
              </Typography>
              <Box sx={SessionProfileStyles.expertiseContainer}>
                {profileData.expertise.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={isEditMode ? () => handleRemoveExpertise(index) : undefined}
                    deleteIcon={isEditMode ? <CloseIcon sx={SessionProfileStyles.chipDeleteIcon} /> : undefined}
                    sx={SessionProfileStyles.expertiseChip}
                  />
                ))}
              </Box>
              {isEditMode && (
                <Box sx={SessionProfileStyles.addExpertiseContainer}>
                  <TextField
                    fullWidth
                    placeholder="Add new expertise"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddExpertise()
                      }
                    }}
                    sx={SessionProfileStyles.expertiseInput}
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddExpertise}
                    sx={SessionProfileStyles.addButton}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Education Section Card */}
          <Card sx={SessionProfileStyles.card}>
            <CardContent sx={SessionProfileStyles.cardContent}>
              <Box sx={SessionProfileStyles.educationHeader}>
                <Typography variant="h6" sx={SessionProfileStyles.sectionTitle}>
                  Education
                </Typography>
                {isEditMode && (
                  <Button
                    variant="contained"
                    onClick={handleAddEducation}
                    sx={SessionProfileStyles.addEducationButton}
                    startIcon={<AddIcon />}
                  >
                    Add Education
                  </Button>
                )}
              </Box>
              {isEditMode ? (
                <>
                  {profileData.education.map((edu, index) => (
                    <Box key={index} sx={SessionProfileStyles.educationItem}>
                      <IconButton
                        sx={SessionProfileStyles.removeButton}
                        onClick={() => handleRemoveEducation(index)}
                        size="small"
                      >
                        <CloseIcon />
                      </IconButton>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Degree"
                            value={edu.degree}
                            onChange={(e) => handleEducationFieldChange(index, 'degree', e.target.value)}
                            sx={SessionProfileStyles.textField}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Year"
                            value={edu.year}
                            onChange={(e) => handleEducationFieldChange(index, 'year', e.target.value)}
                            sx={SessionProfileStyles.textField}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Institution"
                            value={edu.institution}
                            onChange={(e) => handleEducationFieldChange(index, 'institution', e.target.value)}
                            sx={SessionProfileStyles.textField}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </>
              ) : (
                <Box sx={SessionProfileStyles.educationTimeline}>
                  {profileData.education.map((edu, index) => (
                    <Box key={index} sx={SessionProfileStyles.educationItem}>
                      <Box sx={SessionProfileStyles.timelineDot} />
                      <Box sx={SessionProfileStyles.educationContent}>
                        <Typography variant="subtitle1" sx={SessionProfileStyles.educationDegree}>
                          {edu.degree} • {edu.year}
                        </Typography>
                        <Typography variant="body2" sx={SessionProfileStyles.educationUniversity}>
                          {edu.institution}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          {!isEditMode && (
            <Button
              fullWidth
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
              sx={SessionProfileStyles.editProfileButton}
            >
              Edit Profile
            </Button>
          )}

          {isEditMode ? (
            <>
              {/* Edit Session Card */}
              <Card sx={SessionProfileStyles.card}>
                <CardContent sx={SessionProfileStyles.cardContent}>
                  <Typography variant="h6" sx={SessionProfileStyles.sectionTitle}>
                    Edit Session
                  </Typography>
                  <Box sx={SessionProfileStyles.formSection}>
                    <TextField
                      fullWidth
                      label="Session Rate ($)"
                      value={profileData.sessionRate}
                      onChange={(e) => handleFieldChange('sessionRate', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <TextField
                      fullWidth
                      label="Meeting Location"
                      value={profileData.meetingLocation}
                      onChange={(e) => handleFieldChange('meetingLocation', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <Box
                      component="label"
                      sx={SessionProfileStyles.uploadBox}
                    >
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => handleFileUpload('sessionAgenda', e)}
                      />
                      <CloudUploadIcon sx={SessionProfileStyles.uploadIcon} />
                      <Typography variant="body2" sx={SessionProfileStyles.uploadText}>
                        Click to upload PDF
                      </Typography>
                      <Typography variant="caption" sx={SessionProfileStyles.uploadSubtext}>
                        Upload a new session agenda
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card sx={SessionProfileStyles.card}>
                <CardContent sx={SessionProfileStyles.cardContent}>
                  <Typography variant="h6" sx={SessionProfileStyles.sectionTitle}>
                    Contact
                  </Typography>
                  <Box sx={SessionProfileStyles.formSection}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      value={profileData.linkedin}
                      onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                      sx={SessionProfileStyles.textField}
                    />
                    <Box
                      component="label"
                      sx={SessionProfileStyles.uploadBox}
                    >
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => handleFileUpload('cvPortfolio', e)}
                      />
                      <CloudUploadIcon sx={SessionProfileStyles.uploadIcon} />
                      <Typography variant="body2" sx={SessionProfileStyles.uploadText}>
                        Click to upload PDF
                      </Typography>
                      <Typography variant="caption" sx={SessionProfileStyles.uploadSubtext}>
                        Upload your CV or Portfolio
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Available Sessions Card */}
              <Card sx={SessionProfileStyles.availableSessionsCard}>
                <CardContent sx={SessionProfileStyles.cardContent}>
                  <Box sx={SessionProfileStyles.cardHeader}>
                    <Box sx={SessionProfileStyles.cardHeaderLeft}>
                      <CalendarIcon sx={SessionProfileStyles.cardIcon} />
                      <Typography variant="h6" sx={SessionProfileStyles.cardTitle}>
                        Available Sessions
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={SessionProfileStyles.subtitleContainer}>
                    <RefreshIcon sx={SessionProfileStyles.subtitleIcon} />
                    <Typography variant="subtitle2" sx={SessionProfileStyles.subtitle}>
                      Newest Available Slots
                    </Typography>
                  </Box>

                  <Box sx={SessionProfileStyles.sessionsList}>
                    {profileData.availableSessions.map((session, index) => (
                      <Box key={index} sx={SessionProfileStyles.sessionSlot}>
                        <Box sx={SessionProfileStyles.sessionSlotTopRow}>
                          <Box>
                            <Typography variant="body2" component="span" sx={SessionProfileStyles.sessionDay}>
                              {session.day}
                            </Typography>
                            <Typography variant="body2" component="span" sx={SessionProfileStyles.sessionDot}>
                              {' • '}
                            </Typography>
                            <Typography variant="body2" component="span" sx={SessionProfileStyles.sessionDuration}>
                              {session.duration}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={SessionProfileStyles.sessionPrice}>
                            {session.price}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={SessionProfileStyles.sessionTime}>
                          {session.time}
                        </Typography>
                        <Box sx={SessionProfileStyles.sessionLocation}>
                          <LocationOnIcon sx={SessionProfileStyles.locationIcon} />
                          <Typography 
                            variant="body2" 
                            component="a"
                            href="#"
                            sx={SessionProfileStyles.locationText}
                          >
                            {session.location}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={SessionProfileStyles.sessionButtons}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DescriptionIcon />}
                      onClick={() => navigate('/session-schedule')}
                      sx={SessionProfileStyles.viewAllButton}
                    >
                      View All Available Times
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DescriptionIcon />}
                      onClick={() => setAgendaModalOpen(true)}
                      sx={SessionProfileStyles.viewAgendaButton}
                    >
                      View Session Agenda
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card sx={SessionProfileStyles.card}>
                <CardContent sx={SessionProfileStyles.cardContent}>
                  <Typography variant="h6" sx={SessionProfileStyles.sectionTitle}>
                    Contact
                  </Typography>
                  <Box sx={SessionProfileStyles.contactSection}>
                    <Box sx={SessionProfileStyles.contactItem}>
                      <EmailIcon sx={SessionProfileStyles.contactIcon} />
                      <Typography variant="body2">{profileData.email}</Typography>
                    </Box>
                    <Box sx={SessionProfileStyles.contactItem}>
                      <PhoneIcon sx={SessionProfileStyles.contactIcon} />
                      <Typography variant="body2">{profileData.phone}</Typography>
                    </Box>
                    <Box sx={SessionProfileStyles.contactItem}>
                      <LinkedInIcon sx={SessionProfileStyles.contactIcon} />
                      <Typography
                        variant="body2"
                        component="a"
                        href="#"
                        sx={SessionProfileStyles.contactLink}
                      >
                        {profileData.linkedin}
                      </Typography>
                    </Box>
                    <Box sx={SessionProfileStyles.contactItem}>
                      <DescriptionIcon sx={SessionProfileStyles.contactIcon} />
                      <Typography
                        variant="body2"
                        component="a"
                        href="#"
                        sx={SessionProfileStyles.contactLink}
                      >
                        {profileData.portfolio}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </>
          )}
        </Grid>
      </Grid>

      {/* Session Agenda Modal */}
      <SessionAgendaModal
        open={agendaModalOpen}
        onClose={() => setAgendaModalOpen(false)}
      />
    </Box>
  )
}

export default SessionProfile
