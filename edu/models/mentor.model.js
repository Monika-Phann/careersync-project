const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  // ✅ CHANGED: Simple String to match Frontend
  industry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ✅ CHANGED: Simple String to match Frontend
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING, // Changed to STRING to avoid ENUM issues for now
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  job_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expertise_areas: {
    type: DataTypes.TEXT,
  },
  experience_years: {
    type: DataTypes.STRING, // Changed to STRING to match input safely
  },
  cv_link: { // ✅ ADDED: Missing column for CV
    type: DataTypes.STRING,
  },
  company_name: {
    type: DataTypes.STRING,
  },
  social_media: {
    type: DataTypes.STRING,
  },
  about_mentor: {
    type: DataTypes.TEXT,
  },
  profile_image: {
    type: DataTypes.STRING,
  },
  approval_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  approved_by: {
    type: DataTypes.UUID,
  },
  approved_at: {
    type: DataTypes.DATE,
  }
}, {
  tableName: 'mentor',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Mentor.associate = (db) => {
  Mentor.belongsTo(db.User, { foreignKey: 'user_id' });
  // Removed strict associations to Position/Industry for simplicity
  if (db.MentorEducation) {
      Mentor.hasMany(db.MentorEducation, { foreignKey: 'mentor_id', as: 'education' });
  }
};

module.exports = Mentor;