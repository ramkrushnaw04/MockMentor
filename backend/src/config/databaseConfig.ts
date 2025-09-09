import {Sequelize} from 'sequelize'

const sequelize = new Sequelize("MockMentor", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, 
});

(async function() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}) ()

export default sequelize;