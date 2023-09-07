import { Sequelize } from 'sequelize';
// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: "C:/Users/jaoua/OneDrive/Bureau/POLITO/Web app/Exam/exam3-guesswho-jouchaib2020/server/db/db.sqlite", // relative path doesn't work
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
