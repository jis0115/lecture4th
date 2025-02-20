'use strict'

import { generate } from '../utils/uid.util'

module.exports = (sequelize, DataTypes) => {
  const Dog = sequelize.define(
    'Dog',
    {
      uid: {
        allowNull: false,
        unique: true,
        type: 'BINARY(6)',
        defaultValue: () => {
          return Buffer(generate(), 'hex')
        },
        get: function () {
          return Buffer(this.getDataValue('uid')).toString('hex')
        }
      },
      isAdopted: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      type: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING
      },
      age: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.TINYINT.UNSIGNED
      },
      gender: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.ENUM('m', 'f')
      },
      thumbnailImg: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'dogs',
      timestamps: true
    }
  )

  Dog.associate = function (models) {
    Dog.hasMany(models.DogImage, {
      as: 'imgs',
      foreignKey: 'dogId'
    })

    Dog.hasMany(models.DogVaccine, {
      as: 'vaccines',
      foreignKey: 'dogId'
    })

    Dog.belongsToMany(models.User, {
      as: 'users',
      through: 'IsAdoptedTo',
      foreignKey: 'dogId',
      otherKey: 'userId'
    })
  }

  return Dog
}