import { useState } from 'react'
import axios from 'axios' // ✅ Added
import { useNavigate } from 'react-router-dom' // ✅ Added
import { 
  Box, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert // ✅ Added UI components
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline' // ✅ Added Icon
import Button from '../../components/UI/Button/Button'
import FormInput from '../../components/UI/FormInput/FormInput'
import { motion } from 'framer-motion'
import {
  Section,
  Layout,
  CardBox,
  ProfileCircle,
  UploadHint,
  WarningBox,
  FormCard,
  InputGrid,
  TextArea,
  CheckboxRow,
} from './MentorRegister.styles'
import LegalDialog from "../../components/Legal/LegalDialog"
import termsMd from "../../components/content/MentorTerms.md?raw";
import privacyMd from "../../components/content/MentorPrivacy.md?raw";

function MentorRegister() {
  const navigate = useNavigate() // ✅ Added hook
  const [legalOpen, setLegalOpen] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  
  // ✅ Added States for Popup & API Errors
  const [openSuccess, setOpenSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const [formData, setFormData] = useState({
    profilePicture: null,
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    industry: '',
    position: '',
    jobTitle: '',
    expertiseAreas: '',
    yearsOfExperience: '',
    cvLink: '',
    company: '',
    linkedIn: '',
    education: '',
    about: '',
    termsAccepted: false,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // ... (Keep existing validation functions: validateEmail, validatePassword, etc.) ...
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s()+-]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const validateURL = (url) => {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'profilePicture':
        if (!value) {
          newErrors.profilePicture = 'Profile picture is required'
        } else {
          delete newErrors.profilePicture
        }
        break
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required'
        } else if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required'
        } else if (!validatePassword(value)) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
        } else {
          delete newErrors.password
        }
        if (touched.confirmPassword && formData.confirmPassword !== value) {
          newErrors.confirmPassword = 'Passwords do not match'
        } else if (touched.confirmPassword) {
          delete newErrors.confirmPassword
        }
        break
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match'
        } else {
          delete newErrors.confirmPassword
        }
        break
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[field] = `${field === 'firstName' ? 'First' : 'Last'} name is required`
        } else {
          delete newErrors[field]
        }
        break
      case 'phone':
        if (!value) {
          newErrors.phone = 'Phone number is required'
        } else if (!validatePhone(value)) {
          newErrors.phone = 'Please enter a valid phone number'
        } else {
          delete newErrors.phone
        }
        break
      case 'dateOfBirth':
        if (!value) {
          newErrors.dateOfBirth = 'Date of birth is required'
        } else {
          delete newErrors.dateOfBirth
        }
        break
      case 'gender':
        if (!value) {
          newErrors.gender = 'Gender is required'
        } else {
          delete newErrors.gender
        }
        break
      case 'industry':
      case 'position':
      case 'jobTitle':
      case 'yearsOfExperience':
      case 'cvLink':
        if (!value.trim()) {
          newErrors[field] = 'This field is required'
        } else {
          delete newErrors[field]
        }
        if (field === 'cvLink' && value && !validateURL(value)) {
          newErrors.cvLink = 'Please enter a valid URL'
        }
        break
      case 'termsAccepted':
        if (!value) {
          newErrors.termsAccepted = 'You must agree to the terms and conditions'
        } else {
          delete newErrors.termsAccepted
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleProfileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setProfilePreview(url)
    setFormData((prev) => ({ ...prev, profilePicture: file }))
    setTouched((prev) => ({ ...prev, profilePicture: true }))
    validateField('profilePicture', file)
  }

  // ✅ Updated Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('') // Clear previous errors

    // Mark all required fields as touched
    const requiredFields = [
      'profilePicture', 'email', 'password', 'confirmPassword',
      'firstName', 'lastName', 'phone', 'dateOfBirth',
      'gender', 'industry', 'position', 'jobTitle',
      'yearsOfExperience', 'cvLink', 'termsAccepted',
    ]
    const newTouched = {}
    requiredFields.forEach((field) => {
      newTouched[field] = true
    })
    setTouched(newTouched)

    // Validate
    const newErrors = {}
    if (!formData.profilePicture) newErrors.profilePicture = 'Profile picture is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address'
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) newErrors.password = 'Password weak'
    
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.phone) newErrors.phone = 'Phone required'
    if (!formData.industry.trim()) newErrors.industry = 'Industry required'
    if (!formData.position.trim()) newErrors.position = 'Position required'
    if (!formData.termsAccepted) newErrors.termsAccepted = 'Must accept terms'
    // ... (Keep the rest of your specific field validations if needed)

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        // ✅ Send to Backend
        // Note: Sending 'formData' object directly sends JSON. 
        // If your backend handles images later, you will need to switch to 'new FormData()'
        const response = await axios.post('http://localhost:8081/api/v1/auth/register-mentor', formData);

        if (response.status === 201) {
            setOpenSuccess(true); // Open the success dialog
        }
      } catch (err) {
        console.error("Registration Error:", err);
        setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see error
      }
    } else {
        // If local validation fails, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    navigate('/'); // Redirect to Home
  };

  return (
    <Section
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <form onSubmit={handleSubmit}>
        <Layout>
          {/* ✅ Server Error Alert */}
          {serverError && (
             <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
               {serverError}
             </Alert>
          )}

          <CardBox>
            <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', color: '#111827' }}>
              Become a Mentor
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280', marginBottom: 1 }}>
              Guide the next generation
            </Typography>
            <Box sx={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
              <ProfileCircle
                component="label"
                htmlFor="mentor-profile-upload"
                sx={{
                  cursor: 'pointer',
                  backgroundImage: profilePreview ? `url(${profilePreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: touched.profilePicture && errors.profilePicture ? '2px solid #ef4444' : '1px solid #d5d7db',
                }}
              >
                {!formData.profilePicture && '👤'}
              </ProfileCircle>
              <input
                id="mentor-profile-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileUpload}
              />
            </Box>
            <UploadHint>Upload your profile picture *</UploadHint>
            {touched.profilePicture && errors.profilePicture && (
              <WarningBox sx={{ mt: 1, mb: 0 }}>
                <Typography variant="body2" sx={{ color: '#92400e', fontSize: '12px', textAlign: 'center' }}>
                  {errors.profilePicture}
                </Typography>
              </WarningBox>
            )}

            <Box sx={{ marginTop: 3 }}>
              <Box sx={{ display: 'grid', gap: 1.4 }}>
                <FormInput
                  label="Email Address *"
                  type="email"
                  placeholder="your.email@example.com"
                  icon="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Box>
            </Box>
          </CardBox>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <WarningBox>
              <strong>Important:</strong> As a mentor, you&apos;ll help guide mentee through their career journey. Your
              profile will be reviewed to ensure quality mentorship experiences.
            </WarningBox>
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 700, color: '#111827' }}>
              Mentor Registration
            </Typography>

            <FormCard>
              <InputGrid>
                <FormInput
                  label="First Name *"
                  placeholder="John"
                  icon="user"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  error={touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
                <FormInput
                  label="Last Name *"
                  placeholder="Doe"
                  icon="user"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  error={touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
              </InputGrid>
              <InputGrid>
                <FormInput
                  label="Phone Number *"
                  placeholder="+1 (555) 000-0000"
                  icon="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  error={touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
                />
                <FormInput
                  label="Date of Birth *"
                  placeholder="MM/DD/YYYY"
                  icon="date"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  onBlur={() => handleBlur('dateOfBirth')}
                  error={touched.dateOfBirth && !!errors.dateOfBirth}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                />
              </InputGrid>
              
              <InputGrid>
                <FormInput
                  label="Password *"
                  type="password"
                  placeholder="********"
                  icon="lock"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                 <FormInput
                  label="Confirm Password *"
                  type="password"
                  placeholder="********"
                  icon="lock"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </InputGrid>

              <Box sx={{ marginBottom: '14px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827', marginBottom: 0.5 }}>
                  Gender *
                </Typography>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => {
                    handleInputChange('gender', e.target.value)
                    handleBlur('gender')
                  }}
                >
                  <FormControlLabel control={<Radio size="small" />} label="Male" value="Male" />
                  <FormControlLabel control={<Radio size="small" />} label="Female" value="Female" />
                </RadioGroup>
                {touched.gender && errors.gender && (
                  <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
                    {errors.gender}
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', margin: '10px 0 8px' }}>
                Professional Information
              </Typography>
              <InputGrid>
                <FormInput
                  label="Select Industry *"
                  placeholder="e.g., Technology"
                  icon="briefcase"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  onBlur={() => handleBlur('industry')}
                  error={touched.industry && !!errors.industry}
                  helperText={touched.industry && errors.industry}
                />
                <FormInput
                  label="Select Position *"
                  placeholder="e.g., Software Developer"
                  icon="briefcase"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  onBlur={() => handleBlur('position')}
                  error={touched.position && !!errors.position}
                  helperText={touched.position && errors.position}
                />
              </InputGrid>
              <InputGrid>
                <FormInput
                  label="Job Title *"
                  placeholder="e.g., Senior Software Developer"
                  icon="briefcase"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  onBlur={() => handleBlur('jobTitle')}
                  error={touched.jobTitle && !!errors.jobTitle}
                  helperText={touched.jobTitle && errors.jobTitle}
                />
                <FormInput
                  label="Expertise Areas"
                  placeholder="e.g., Software Development, AI"
                  icon="briefcase"
                  value={formData.expertiseAreas}
                  onChange={(e) => handleInputChange('expertiseAreas', e.target.value)}
                />
              </InputGrid>
              <InputGrid>
                <FormInput
                  label="Years of Experience *"
                  placeholder="e.g., 5"
                  icon="briefcase"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  onBlur={() => handleBlur('yearsOfExperience')}
                  error={touched.yearsOfExperience && !!errors.yearsOfExperience}
                  helperText={touched.yearsOfExperience && errors.yearsOfExperience}
                />
                <FormInput
                  label="Link to CV or Portfolio *"
                  placeholder="e.g., https://drive.google.com/your-cv"
                  icon="briefcase"
                  value={formData.cvLink}
                  onChange={(e) => handleInputChange('cvLink', e.target.value)}
                  onBlur={() => handleBlur('cvLink')}
                  error={touched.cvLink && !!errors.cvLink}
                  helperText={touched.cvLink && errors.cvLink}
                />
              </InputGrid>
              <InputGrid>
                <FormInput
                  label="Company"
                  placeholder="e.g., Google, Freelance"
                  icon="briefcase"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
                <FormInput
                  label="LinkedIn Profile (Optional)"
                  placeholder="linkedin.com/in/yourprofile"
                  icon="briefcase"
                  value={formData.linkedIn}
                  onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                />
              </InputGrid>

              <Box sx={{ margin: '16px 0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', marginBottom: 0.5 }}>
                  Education
                </Typography>
                <TextArea
                  placeholder="e.g., B.S. Computer Science, Stanford University, 2020"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                />
              </Box>

              <Box sx={{ margin: '16px 0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', marginBottom: 0.5 }}>
                  About You
                </Typography>
                <TextArea
                  placeholder="Tell mentees about your background, experience, and what you can help them with..."
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                />
              </Box>

              <Box sx={{ alignItems: "flex-start", m: 0 }}>
                <CheckboxRow>
                  <Checkbox
                    size="small"
                    checked={formData.termsAccepted}
                    onChange={(e) => {
                      const newValue = e.target.checked;
                      setFormData((prev) => ({ ...prev, termsAccepted: newValue }));
                      setTouched((prev) => ({ ...prev, termsAccepted: true }));
                      validateField('termsAccepted', newValue);
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{" "}
                    <span
                      style={{ color: '#0c3c82', fontWeight: 600, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setLegalOpen('terms');
                      }}
                    >
                      Mentor Terms and Conditions
                    </span>{" "}
                    and{" "}
                    <span
                      style={{ color: '#0c3c82', fontWeight: 600, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setLegalOpen('privacy');
                      }}
                    >
                      Privacy Policy
                    </span>
                    . I commit to providing quality mentorship and maintaining professional conduct.
                  </Typography>
                </CheckboxRow>
              </Box>

              {touched.termsAccepted && errors.termsAccepted && (
                <Typography variant="caption" sx={{ color: '#ef4444', mt: -1, mb: 2, display: 'block' }}>
                  {errors.termsAccepted}
                </Typography>
              )}

              <Button full variant="secondary" type="submit">
                Submit Mentor Application
              </Button>
            </FormCard>

            <LegalDialog
              open={legalOpen === "terms"}
              onClose={() => setLegalOpen(null)}
              title="Terms and Conditions"
              content={termsMd}
            />

            <LegalDialog
              open={legalOpen === "privacy"}
              onClose={() => setLegalOpen(null)}
              title="Privacy Policy"
              content={privacyMd}
            />
          </Box>
        </Layout>
      </form>

      {/* ✅ Success Popup Dialog */}
      <Dialog
        open={openSuccess}
        onClose={handleCloseSuccess}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableScrollLock
      >
        <Box sx={{ textAlign: 'center', p: 3, minWidth: '300px' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }} />
            <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold' }}>
              Application Submitted!
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Your request has been sent to the admin successfully. 
                <br /><br />
                Please wait for approval. You will be notified once your account is active.
            </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={handleCloseSuccess} autoFocus>
                Return Home
            </Button>
            </DialogActions>
        </Box>
      </Dialog>
    </Section>
  )
}

export default MentorRegister