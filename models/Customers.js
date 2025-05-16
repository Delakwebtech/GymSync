const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define("Customer", {
    customerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please add a valid email',
            },
        },
    },
    assignedInstructorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "Users",
            key: "userId",
        },
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
    Customer.belongsTo(models.User, {
        foreignKey: 'assignedInstructorId',
        as: 'instructor',
    });

    Customer.hasMany(models.Attendance, {
        foreignKey: 'customerId',
        as: 'attendances',
    });
};

module.exports = Customer;
