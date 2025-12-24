import { Routes, Route } from 'react-router-dom'

// Core Pages
import Home from '../pages/Home/Home'
import Programs from '../pages/Programs/Programs'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'

// Mentor Discovery & Details
import MentorBrowse from '../pages/Programs/MentorBrowse'
import MentorDetails from '../pages/Programs/MentorDetails'

// Auth Pages
import AuthSignIn from '../pages/Auth/AuthSignIn/AuthSignIn'
import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword'
import ResetPassword from '../pages/Auth/ResetPassword/ResetPassword'
import ResetSuccess from '../pages/Auth/ResetSuccess/ResetSuccess'
import Register from '../pages/Auth/StudentRegister/Register'
import MentorRegister from '../pages/MentorRegister/MentorRegister'

// Account Pages
import ProfilePage from '../pages/Account/ProfilePage'
import AccountSecurity from '../pages/Account/Security/AccountSecurity'
import BookingHistory from '../pages/Account/Bookings/BookingHistory'
import CertificatesPage from '../pages/Account/Certificates/CertificatesPage'

function AppRoutes() {
  return (
    <Routes>
      {/* --- Public Informational Routes --- */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* --- Program & Mentor Discovery --- */}
      {/* Programs acts as your category high-level landing page */}
      <Route path="/programs" element={<Programs defaultCategory="Information Technology" />} />
      
      {/* Mentors handles the searchable list and specific profiles */}
      <Route path="/mentors" element={<MentorBrowse />} />
      <Route path="/mentor/:id" element={<MentorDetails />} />

      {/* --- Authentication Flow --- */}
      <Route path="/signin" element={<AuthSignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset/:resetToken?" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />
      <Route path="/mentor-register" element={<MentorRegister />} />

      {/* --- User Account & Dashboard --- */}
      <Route path="/account" element={<ProfilePage />} />
      <Route path="/account/security" element={<AccountSecurity />} />
      <Route path="/account/bookings" element={<BookingHistory />} />
      <Route path="/account/certificates" element={<CertificatesPage />} />
    </Routes>
  )
}

export default AppRoutes