const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LoginSession = sequelize.define('LoginSession', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    
    // ✅ FIXED: Removed 'autoIncrement: true' to stop the Postgres crash
    row_num: { type: DataTypes.INTEGER, unique: true },
    
    refresh_token: { type: DataTypes.TEXT, allowNull: false },
    access_token: { type: DataTypes.TEXT, allowNull: false },
    device_info: DataTypes.TEXT,
    expired_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName: 'Login_Session',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['refresh_token'] }
    ]
  });

  LoginSession.associate = (models) => {
    LoginSession.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  return LoginSession;
};