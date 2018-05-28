const Sequelize = require('sequelize');

module.exports = function define(person, sequelize) {
	const Person = sequelize.define(
		person,
		{
			id: {
				type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			age: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
		}
	);
	return Person;
};
