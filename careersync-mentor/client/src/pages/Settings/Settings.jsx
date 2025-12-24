import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  CameraAlt as CameraIcon,
  Visibility,
  VisibilityOff,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import SettingsTabSwitcher from '../../components/Settings/SettingsTabSwitcher'
import { SettingsStyles } from './Settings.styles'

function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditMode, setIsEditMode] = useState(false)
  const [accountData, setAccountData] = useState({
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.john@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Mentor',
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setIsEditMode(false)
  }

  const handleAccountChange = (field, value) => {
    setAccountData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSecurityChange = (field, value) => {
    setSecurityData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSaveChanges = () => {
    console.log('Saving account changes:', accountData)
    setIsEditMode(false)
    // Handle save logic
  }

  const handleCancel = () => {
    setIsEditMode(false)
    // Reset form logic if needed
  }

  const handleUpdatePassword = () => {
    console.log('Updating password:', securityData)
    // Handle password update logic
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const passwordRequirements = [
    'At least 8 characters long',
    'Contains uppercase and lowercase letters',
    'Contains at least one number',
    'Contains at least one special character',
  ]

  return (
    <Box sx={SettingsStyles.container}>
      <Card sx={SettingsStyles.card}>
        <CardContent sx={SettingsStyles.cardContent}>
          <Box sx={SettingsStyles.tabsContainer}>
            <SettingsTabSwitcher
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Box>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Box>
                {!isEditMode ? (
                  <>
                    <Box sx={SettingsStyles.sectionHeader}>
                      <Box>
                        <Typography variant="h6" sx={SettingsStyles.sectionTitle}>
                          Account Information
                        </Typography>
                        <Typography variant="body2" sx={SettingsStyles.sectionSubtitle}>
                          View your account information and profile details
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={SettingsStyles.editButton}
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit Profile
                      </Button>
                    </Box>

                    <Box sx={SettingsStyles.profileSection}>
                      <Avatar sx={SettingsStyles.profileAvatar}>M</Avatar>
                      <Box sx={SettingsStyles.profileInfo}>
                        <Typography variant="body1" sx={SettingsStyles.profileLabel}>
                          Profile Picture
                        </Typography>
                        <Typography variant="body2" sx={SettingsStyles.profileSubtext}>
                          This is your current profile picture
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={SettingsStyles.formSection}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={accountData.firstName}
                        disabled
                        sx={SettingsStyles.textField}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={accountData.lastName}
                        disabled
                        sx={SettingsStyles.textField}
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={accountData.email}
                        disabled
                        sx={SettingsStyles.textField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={SettingsStyles.inputIcon} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={accountData.phone}
                        disabled
                        sx={SettingsStyles.textField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={SettingsStyles.inputIcon} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Role"
                        value={accountData.role}
                        disabled
                        sx={SettingsStyles.textField}
                        helperText="Your role cannot be changed"
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={SettingsStyles.sectionHeader}>
                      <Box>
                        <Typography variant="h6" sx={SettingsStyles.sectionTitle}>
                          Edit Profile
                        </Typography>
                        <Typography variant="body2" sx={SettingsStyles.sectionSubtitle}>
                          Update your account information and profile details
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={SettingsStyles.profileEditSection}>
                      <Box sx={SettingsStyles.profilePictureSection}>
                        <Typography variant="body1" sx={SettingsStyles.profileLabel}>
                          Profile Picture
                        </Typography>
                        <Box sx={SettingsStyles.profilePictureContainer}>
                          <Box sx={SettingsStyles.avatarWrapper}>
                            <Avatar sx={SettingsStyles.profileAvatar}>M</Avatar>
                            <IconButton
                              sx={SettingsStyles.cameraButton}
                              component="label"
                              aria-label="upload picture"
                            >
                              <CameraIcon />
                              <input type="file" hidden accept="image/*" />
                            </IconButton>
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            component="label"
                            sx={SettingsStyles.uploadButton}
                          >
                            Upload New Picture
                            <input type="file" hidden accept="image/*" />
                          </Button>
                          <Typography variant="caption" sx={SettingsStyles.uploadHint}>
                            JPG, PNG or GIF. Max size 2MB.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={SettingsStyles.formSection}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={accountData.firstName}
                        onChange={(e) => handleAccountChange('firstName', e.target.value)}
                        sx={SettingsStyles.textField}
                      />
                      <TextField
                        fullWidth
                        label="Last Name *"
                        value={accountData.lastName}
                        onChange={(e) => handleAccountChange('lastName', e.target.value)}
                        sx={SettingsStyles.textField}
                      />
                      <TextField
                        fullWidth
                        label="Email Address *"
                        type="email"
                        value={accountData.email}
                        onChange={(e) => handleAccountChange('email', e.target.value)}
                        sx={SettingsStyles.textField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={SettingsStyles.inputIcon} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={accountData.phone}
                        onChange={(e) => handleAccountChange('phone', e.target.value)}
                        sx={SettingsStyles.textField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={SettingsStyles.inputIcon} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Role"
                        value={accountData.role}
                        disabled
                        sx={SettingsStyles.textField}
                        helperText="Your role cannot be changed"
                      />
                    </Box>

                    <Box sx={SettingsStyles.actions}>
                      <Button
                        variant="outlined"
                        sx={SettingsStyles.cancelButton}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        sx={SettingsStyles.saveButton}
                        onClick={handleSaveChanges}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </>
                )}
            </Box>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Box>
              <Box sx={SettingsStyles.securityHeader}>
                <img 
                  src="/security-setting.svg" 
                  alt="Security Settings" 
                  style={{ width: '48px', height: '48px', marginTop: '4px' }}
                />
                <Box>
                  <Typography variant="h6" sx={SettingsStyles.sectionTitle}>
                    Security Settings
                  </Typography>
                  <Typography variant="body2" sx={SettingsStyles.sectionSubtitle}>
                    Manage your password and security preferences
                  </Typography>
                </Box>
              </Box>

              <Box sx={SettingsStyles.passwordSection}>
                <Box sx={SettingsStyles.passwordSectionHeader}>
                  <img 
                    src="/change-password.svg" 
                    alt="Change Password" 
                    style={{ width: '24px', height: '24px' }}
                  />
                  <Typography variant="h6" sx={SettingsStyles.passwordTitle}>
                    Change Password
                  </Typography>
                </Box>

                <Box sx={SettingsStyles.formSection}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    placeholder="Enter your current password"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={securityData.currentPassword}
                    onChange={(e) =>
                      handleSecurityChange('currentPassword', e.target.value)
                    }
                    sx={SettingsStyles.textField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={SettingsStyles.inputIcon} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('current')}
                            edge="end"
                          >
                            {showPasswords.current ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="New Password"
                    placeholder="Enter your new password"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={securityData.newPassword}
                    onChange={(e) =>
                      handleSecurityChange('newPassword', e.target.value)
                    }
                    sx={SettingsStyles.textField}
                    helperText="Password must be at least 8 characters long."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={SettingsStyles.inputIcon} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('new')}
                            edge="end"
                          >
                            {showPasswords.new ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={securityData.confirmPassword}
                    onChange={(e) =>
                      handleSecurityChange('confirmPassword', e.target.value)
                    }
                    sx={SettingsStyles.textField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={SettingsStyles.inputIcon} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('confirm')}
                            edge="end"
                          >
                            {showPasswords.confirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={SettingsStyles.passwordRequirements}>
                  <Typography variant="body2" sx={SettingsStyles.requirementsTitle}>
                    Password Requirements:
                  </Typography>
                  <List dense sx={SettingsStyles.requirementsList}>
                    {passwordRequirements.map((requirement, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon sx={SettingsStyles.bulletIcon}>
                          <Box sx={SettingsStyles.bullet} />
                        </ListItemIcon>
                        <ListItemText
                          primary={requirement}
                          sx={SettingsStyles.requirementText}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={SettingsStyles.actions}>
                  <Button
                    variant="outlined"
                    sx={SettingsStyles.cancelButton}
                    onClick={() => {
                      setSecurityData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={SettingsStyles.updateButton}
                    onClick={handleUpdatePassword}
                  >
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Settings
