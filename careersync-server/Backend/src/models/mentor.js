// src/models/Mentor.model.js
const { DataTypes } = require('sequelize');
const enums = require('./enum');

module.exports = (sequelize) => {
  const Mentor = sequelize.define('Mentor', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    first_name: { type: DataTypes.STRING(255), allowNull: false },
    last_name: { type: DataTypes.STRING(255), allowNull: false },
    gender: { type: DataTypes.ENUM(...enums.Gender), allowNull: false },
    dob: { type: DataTypes.DATEONLY, allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    job_title: { type: DataTypes.STRING(255), allowNull: false },
    expertise_areas: DataTypes.TEXT,
    experience_years: DataTypes.INTEGER,
    company_name: DataTypes.STRING(255),
    social_media: DataTypes.STRING(255),
    about_mentor: DataTypes.TEXT,
    profile_image: DataTypes.STRING(255),
    approval_status: { type: DataTypes.ENUM(...enums.ApprovalStatus), allowNull: false, defaultValue: 'pending' },
    approved_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName: 'Mentor',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['approval_status'] },
      { fields: ['position_id'] },
      { fields: ['industry_id'] },
      { fields: ['user_id'] }
    ]
  });

  Mentor.associate = (models) => {
    Mentor.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Mentor.belongsTo(models.Position, { foreignKey: 'position_id' });
    Mentor.belongsTo(models.Industry, { foreignKey: 'industry_id' });
    Mentor.belongsTo(models.Admin, { foreignKey: 'approved_by' });

    Mentor.hasMany(models.MentorDocument, { foreignKey: 'mentor_id', onDelete: 'CASCADE' });
    Mentor.hasMany(models.MentorEducation, { foreignKey: 'mentor_id', onDelete: 'CASCADE' });
    Mentor.hasMany(models.Session, { foreignKey: 'mentor_id', onDelete: 'CASCADE' });
    Mentor.hasMany(models.ScheduleTimeslot, { foreignKey: 'mentor_id', onDelete: 'CASCADE' });
    Mentor.hasMany(models.Booking, { foreignKey: 'mentor_id' });
    Mentor.hasMany(models.Certificate, { foreignKey: 'mentor_id' });
    Mentor.hasMany(models.Certificate, { as: 'IssuedCertificates', foreignKey: 'issued_by' });
  };

  return Mentor;
};