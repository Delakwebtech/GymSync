const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

const Instructor = sequelize.define("Instructor", {
    instructorId: {
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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please provide a password'
            },
            len: {
                args: [6],
                msg: 'Password should be at least 6 characters long'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    hooks: {
        beforeCreate: async (instructor) => {
            if (instructor.password) {
                const salt = await bcrypt.genSalt(10);
                instructor.password = await bcrypt.hash(instructor.password, salt);
            }
        },
        beforeUpdate: async (instructor) => {
            if (instructor.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                instructor.password = await bcrypt.hash(instructor.password, salt);
            }
        },
        afterCreate: async (instructor, options) => {
            const { User } = require("./User"); // dynamically require to avoid circular import
            await User.create({
                fullName: instructor.fullName,
                email: instructor.email,
                phoneNumber: instructor.phoneNumber,
                password: instructor.password, // already hashed
                role: "instructor",
            });
        }
    }
});

// Password validation method
Instructor.prototype.validatePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

Instructor.associate = (models) => {
    Instructor.hasMany(models.Customer, {
        foreignKey: 'assignedInstructorId',
        as: 'customers',
    });
};

module.exports = Instructor;