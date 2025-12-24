// src/models/Booking.model.js
const { DataTypes } = require('sequelize');
const enums = require('./enum');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    mentor_name_snapshot: { type: DataTypes.STRING(255), allowNull: false },
    acc_user_name_snapshot: { type: DataTypes.STRING(255), allowNull: false },
    position_name_snapshot: { type: DataTypes.STRING(255), allowNull: false },
    session_price_snapshot: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    start_date_snapshot: { type: DataTypes.DATE, allowNull: false },
    end_date_snapshot: { type: DataTypes.DATE, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.ENUM(...enums.BookingStatus), allowNull: false, defaultValue: 'pending' },
    deleted_at: DataTypes.DATE
  }, {
    tableName: 'Booking',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['mentor_id'] },
      { fields: ['acc_user_id'] },
      { fields: ['status'] },
      { fields: ['createdAt'] }
    ]
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.ScheduleTimeslot, { foreignKey: 'schedule_timeslot_id' });
    Booking.belongsTo(models.Mentor, { foreignKey: 'mentor_id', as: 'mentorUser' });
    Booking.belongsTo(models.AccUser, { foreignKey: 'acc_user_id', as: 'menteeUser' });
    Booking.belongsTo(models.Position, { foreignKey: 'position_id' });
    Booking.belongsTo(models.Session, { foreignKey: 'session_id' });

    Booking.hasOne(models.Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
    Booking.hasOne(models.Certificate, { foreignKey: 'booking_id', onDelete: 'SET NULL' });
    Booking.hasOne(models.ScheduleTimeslot, { foreignKey: 'booking_id' });
  };

  return Booking;
};