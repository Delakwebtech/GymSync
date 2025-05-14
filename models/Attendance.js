const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define("Attendance", {
    attendanceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

Attendance.associate = (models) => {
    Attendance.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer',
    });
};

module.exports = Attendance;
