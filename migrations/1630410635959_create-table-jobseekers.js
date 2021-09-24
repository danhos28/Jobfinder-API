/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('jobseekers', {
    jobseeker_id: {
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
    phone_number: {
      type: 'TEXT',
    },
    tagline: {
      type: 'TEXT',
    },
    profile_picture: {
      type: 'TEXT',
    },
    experiences: {
      type: 'TEXT',
    },
    skills: {
      type: 'TEXT',
    },
    certificates: {
      type: 'TEXT',
    },
    education: {
      type: 'TEXT',
    },
    address: {
      type: 'TEXT',
    },
    summary: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('jobseekers');
};
