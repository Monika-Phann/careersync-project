import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Typography, Checkbox, FormControlLabel, Alert } from '@mui/material'
import Button from '../../../components/UI/Button/Button'
import Logo from '../../../components/UI/Logo/Logo'
import FormInput from '../../../components/UI/FormInput/FormInput'
import { AuthLayout, AuthCard, AuthForm, AuthFooter } from './AuthSignIn.styles'
import { loginUser } from '../../../api/authService'
import { useAuth } from '../../../context/AuthContext.jsx'

function AuthSignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // --- MOCK LOGIC FOR TEAM DEVELOPMENT ---
    const useMock = true; 

    if (useMock) {
      setTimeout(() => {
        // DETERMINING ROLE BY EMAIL DOMAIN
        // Example: mentor@test.com becomes a mentor, anything else is a student
        const isMentorEmail = formData.email.includes('mentor');
        
        const mockUser = {
          id: isMentorEmail ? 'mnt-555' : 'std-123',
          firstName: isMentorEmail ? 'Professional' : 'David',
          lastName: isMentorEmail ? 'Mentor' : 'Brown',
          email: formData.email,
          role: isMentorEmail ? 'mentor' : 'student' // Dynamic role assignment
        };
        
        const mockToken = 'mock-jwt-token-abcd-1234';
        
        login(mockUser, mockToken);
        setLoading(false);

        // ROLE-BASED REDIRECTION
        if (mockUser.role === 'mentor') {
          navigate('/mentor/dashboard'); // Redirect to Mentor area
        } else {
          navigate('/mentors'); // Redirect to Student browsing area
        }
      }, 800);
      return;
    }
    // --- END MOCK LOGIC ---
  }

  return (
    <AuthLayout>
      <AuthCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2.5 }}>
          <Logo style={{ color: '#0f172a' }} />
        </Box>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>
          Sign In
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          Welcome back! Please enter your details.
        </Typography>

        <AuthForm onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <FormInput
            label="Email Address *"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange('email')}
            disabled={loading}
          />
          <FormInput
            label="Password *"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange('password')}
            disabled={loading}
          />

          <AuthFooter>
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.rememberMe} onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})} />}
              label="Remember me"
            />
            <Link to="/forgot" style={{ fontSize: '14px', textDecoration: 'none', color: '#6b7280' }}>
              Forgot password?
            </Link>
          </AuthFooter>

          <Button full type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </AuthForm>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0c3c82', fontWeight: 600 }}>Create Account</Link>
        </Typography>
      </AuthCard>
    </AuthLayout>
  )
}

export default AuthSignIn