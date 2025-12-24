const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  profile_image: { type: DataTypes.STRING }
}, {
  tableName: 'admin', // ✅ CRITICAL FIX
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Admin.associate = (db) => {
  Admin.belongsTo(db.User, { foreignKey: 'user_id' });
};

module.exports = Admin;