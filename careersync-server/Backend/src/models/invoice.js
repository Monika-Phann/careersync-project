// src/models/Invoice.model.js
const { DataTypes } = require('sequelize');
const enums = require('./enum');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    mentor_name_snapshot: { type: DataTypes.STRING(255), allowNull: false },
    mentor_position_snapshot: { type: DataTypes.STRING(255), allowNull: false },
    acc_user_name_snapshot: { type: DataTypes.STRING(255), allowNull: false },
    start_date_snapshot: { type: DataTypes.DATE, allowNull: false },
    end_date_snapshot: { type: DataTypes.DATE, allowNull: false },
    session_price_snapshot: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    payment_method_snapshot: { type: DataTypes.ENUM(...enums.PaymentMethod), allowNull: false },
    status: { type: DataTypes.ENUM(...enums.PaymentStatus), allowNull: false, defaultValue: 'pending' },
    deleted_at: DataTypes.DATE
  }, {
    tableName: 'Invoice',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['payment_id'] },
      { fields: ['mentor_id'] },
      { fields: ['acc_user_id'] }
    ]
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Payment, { foreignKey: 'payment_id', onDelete: 'CASCADE' });
    Invoice.belongsTo(models.Mentor, { foreignKey: 'mentor_id' });
    Invoice.belongsTo(models.AccUser, { foreignKey: 'acc_user_id' });
  };

  return Invoice;
};