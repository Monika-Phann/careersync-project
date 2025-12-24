const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, AccUser, Mentor } = require('../models');

// Helper
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role_name },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' }
  );
  return { accessToken };
};

// --- LOGIN ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const { accessToken } = generateTokens(user);

    res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role_name: user.role_name,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- REGISTER MENTOR (FIXED) ---
const registerMentor = async (req, res) => {
  // 1. Capture ALL fields from Frontend
  const { 
    email, password, firstName, lastName, phone, 
    dateOfBirth, gender, industry, position, jobTitle, 
    yearsOfExperience, cvLink, company, linkedIn, about,
    expertiseAreas 
  } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Create User Account
    const user = await User.create({ 
      id: uuidv4(), 
      email, 
      password: hashedPassword, 
      role_name: 'mentor', 
      status: 'active' 
    });
    
    // 3. Create Mentor Profile (Mapping Frontend names to DB names)
    await Mentor.create({ 
      id: uuidv4(), 
      user_id: user.id, 
      first_name: firstName, 
      last_name: lastName,
      
      // ✅ Mapping missing fields
      phone: phone,
      dob: dateOfBirth, // mapped
      gender: gender,
      
      industry: industry, // stored as String
      position: position, // stored as String
      
      job_title: jobTitle, // mapped
      experience_years: yearsOfExperience, // mapped
      cv_link: cvLink,
      company_name: company,
      social_media: linkedIn,
      about_mentor: about,
      expertise_areas: expertiseAreas,
      
      approval_status: 'pending'
    });

    res.status(201).json({ message: 'Mentor application submitted. Pending approval.' });

  } catch (err) {
    console.error("Mentor Register Error:", err); // logs exact error
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// --- REGISTER STUDENT ---
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ message: 'Email taken' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            id: uuidv4(),
            email,
            password: hashedPassword,
            role_name: 'user',
            status: 'active'
        });

        await AccUser.create({
            id: uuidv4(),
            user_id: user.id,
            first_name: firstName,
            last_name: lastName
        });

        const { accessToken } = generateTokens(user);
        
        res.status(201).json({ 
            message: 'Registration successful',
            accessToken,
            user: { id: user.id, email: user.email, role_name: 'user' }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  login,
  registerMentor,
  register
};