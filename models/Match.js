import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from "./User.js";
import Item from "./Item.js";

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isWon: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});
// Define association between Match and User
Match.belongsTo(User, { as: 'player', foreignKey: 'userId' });
Match.belongsTo(Item, { as: 'secretItem', foreignKey: 'secretItemId'});
export default Match;