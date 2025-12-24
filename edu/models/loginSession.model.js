const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoginSession = sequelize.define('LoginSession', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'user', // Points to 'user' table
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'login_session',
  timestamps: false,
  underscored: true
});

module.exports = LoginSession;