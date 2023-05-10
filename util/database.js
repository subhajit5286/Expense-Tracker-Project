const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensetracker','root','walkcook76', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize; 