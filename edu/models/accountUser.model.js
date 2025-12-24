const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AccUser = sequelize.define('AccUser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  profile_image: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'acc_user',
  timestamps: true,
  underscored: true
});

AccUser.associate = (db) => {
  if (db.User) {
    AccUser.belongsTo(db.User, { foreignKey: 'user_id' });
  }
};

module.exports = AccUser;