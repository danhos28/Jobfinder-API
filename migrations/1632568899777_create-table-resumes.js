/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('resumes', {
    resume_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    jobseeker_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    resume: {
      type: 'TEXT',
    },
  });
  pgm.addConstraint(
    'resumes',
    'fk_resumes_jobseekers',
    'FOREIGN KEY(jobseeker_id) REFERENCES jobseekers(jobseeker_id) ON DELETE CASCADE',
  );
};
exports.down = (pgm) => {
  pgm.dropTable('resumes');
};
