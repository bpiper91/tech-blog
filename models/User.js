const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
    // check user password for login
    authenticate(userPassword) {
        return bcrypt.compareSync(userPassword, this.password);
    };
};

// create fields/columns for User model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [7]
            }
        }
    },
    {
        hooks: {
            // hash password before creating a new user
            async beforeCreate(newUserCreds) {
                newUserCreds.password = await bcrypt.hash(newUserCreds.password, 10);
                return newUserCreds;
            },
            // hash password before updating a user's password
            async beforeUpdate(updatedUserCreds) {
                updatedUserCreds.password = await bcrypt.hash(updatedUserCreds.password, 10);
                return updatedUserCreds;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;