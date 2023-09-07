import { Sequelize } from 'sequelize';
// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: "/data/db/db.sqlite", // relative path doesn't work
});



(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    sequelize.options.logging = console.log;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
