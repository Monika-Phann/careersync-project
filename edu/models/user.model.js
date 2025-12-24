const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  }
}, {
  tableName: 'user', // Singular table name
  timestamps: true,
  underscored: true  // created_at, updated_at
});

User.associate = (db) => {
  User.hasOne(db.AccUser, { foreignKey: 'user_id', as: 'accUser' });
  User.hasOne(db.Mentor, { foreignKey: 'user_id', as: 'mentor' });
  // Add Admin if needed: User.hasOne(db.Admin, { foreignKey: 'user_id', as: 'admin' });
};

module.exports = User;