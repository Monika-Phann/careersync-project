// src/models/ScheduleTimeslot.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ScheduleTimeslot = sequelize.define('ScheduleTimeslot', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
    deleted_at: DataTypes.DATE
  }, {
    tableName: 'Schedule_Timeslot',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['mentor_id', 'start_date'], name: 'idx_timeslot_calendar' },
      { fields: ['session_id'] },
      { fields: ['booking_id'] }
    ]
  });

  ScheduleTimeslot.associate = (models) => {
    ScheduleTimeslot.belongsTo(models.Session, { foreignKey: 'session_id' });
    ScheduleTimeslot.belongsTo(models.Mentor, { foreignKey: 'mentor_id' });
    ScheduleTimeslot.hasOne(models.Booking, { foreignKey: 'schedule_timeslot_id' });
    ScheduleTimeslot.belongsTo(models.Booking, { foreignKey: 'booking_id' });
  };

  return ScheduleTimeslot;
};