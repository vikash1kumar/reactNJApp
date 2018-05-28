const Sequelize = require('sequelize');

module.exports = function define(person, sequelize) {
	const Pet = sequelize.define(
		pet,
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
			personId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
		}
	);
	return Pet;
};
module.exports.associations = function associations(models) {
	models.pet.belongsTo(models.person, {foreignKey: 'personId'});
};
