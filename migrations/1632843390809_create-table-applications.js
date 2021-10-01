/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('applications', {
    application_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    jobseeker_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    vacancy_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    message: {
      type: 'TEXT',
    },
    response: {
      type: 'TEXT',
      notNull: true,
    },
    applied_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'applications',
    'fk_applications_jobseekers',
    'FOREIGN KEY(jobseeker_id) REFERENCES jobseekers(jobseeker_id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'applications',
    'fk_applications_vacancies',
    'FOREIGN KEY(vacancy_id) REFERENCES vacancies(vacancy_id) ON DELETE CASCADE',
  );
};
exports.down = (pgm) => {
  pgm.dropTable('applications');
};
