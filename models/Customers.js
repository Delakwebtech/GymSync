const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define("Customer", {
    customerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please add a name'
            }
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Please add a phone number'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true }
    },
    assignedInstructorId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    lastCheckIn: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false,
    },
});

// Define associations as a static method
Customer.associate = (models) => {
    Customer.belongsTo(models.Instructor, {
        foreignKey: 'assignedInstructorId',
        as: 'instructor',
    });

    Customer.hasMany(models.Attendance, {
        foreignKey: 'customerId',
        as: 'attendances',
    });
};

// Customer.belongsTo(models.Instructor, {
//     foreignKey: 'assignedInstructorId',
//     as: 'instructor',
// });

// Customer.hasMany(models.Attendance, {
//     foreignKey: 'customerId',
//     as: 'attendances',
// });

module.exports = Customer;
