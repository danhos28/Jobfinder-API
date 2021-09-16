/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('employers', {
    employer_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    email: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    first_name: {
      type: 'TEXT',
      notNull: true,
    },
    last_name: {
      type: 'TEXT',
      notNull: true,
    },
    company: {
      type: 'TEXT',
      notNull: true,
    },
    position: {
      type: 'TEXT',
      notNull: true,
    },
    profile_picture: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('employers');
};
