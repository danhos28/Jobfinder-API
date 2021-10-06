/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('interviews', {
    interview_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    application_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    employer_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    jobseeker_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    interviewer: {
      type: 'TEXT',
      notNull: true,
    },
    type: {
      type: 'TEXT',
      notNull: true,
    },
    datetime: {
      type: 'TEXT',
      notNull: true,
    },
    link: {
      type: 'TEXT',
      notNull: true,
    },
    notes: {
      type: 'TEXT',
    },
    job_title: {
      type: 'TEXT',
      notNull: true,
    },
    company: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'interviews',
    'fk_interviews_employers',
    'FOREIGN KEY(employer_id) REFERENCES employers(employer_id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'interviews',
    'fk_interviews_jobseekers',
    'FOREIGN KEY(jobseeker_id) REFERENCES jobseekers(jobseeker_id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'applications',
    'fk_interviews_applications',
    'FOREIGN KEY(application_id) REFERENCES applications(application_id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('interviews');
};
