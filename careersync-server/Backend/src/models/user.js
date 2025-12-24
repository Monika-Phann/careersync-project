const { DataTypes } = require('sequelize');
const enums = require('./enum');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    
    // ✅ FIXED: Changed default from 'mentee' to 'acc_user'
    // This matches your enum.js file and stops the server crash.
    role_name: { 
      type: DataTypes.ENUM(...enums.UserRole), 
      allowNull: false, 
      defaultValue: 'acc_user' 
    },
    
    status: { type: DataTypes.ENUM(...enums.AccountStatus), allowNull: false, defaultValue: 'unverified' },
    email_verified_at: { type: DataTypes.DATE },
    last_login: { type: DataTypes.DATE },
    last_password_change: { type: DataTypes.DATE },
    deleted_at: { type: DataTypes.DATE }
  }, {
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
    indexes: [
      { unique: true, fields: ['email'] },
      { fields: ['role_name'] },
      { fields: ['status'] }
    ]
  });

  User.associate = (models) => {
    User.hasOne(models.Admin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasOne(models.Mentor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasOne(models.AccUser, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasMany(models.LoginSession, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasMany(models.PasswordReset, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  return User;
};