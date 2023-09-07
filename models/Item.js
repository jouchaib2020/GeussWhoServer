import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import domain from './Domain.js';

const Item = sequelize.define('Item', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    name: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    image: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    properties: {
        type :DataTypes.JSON
    }
});
Item.belongsTo(domain, { as: 'domain', foreignKey: 'domainId' });
export default Item;