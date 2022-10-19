require('dotenv/config');
const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,

  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  },
);

// //  Test connection with database;
// db.authenticate().then(() => {
//   console.log('Connection successful!');
// }).catch((err) => {
//   console.log(`Something is wrong: ${err}`);
// });

module.exports = {
  Sequelize,
  db,
};
