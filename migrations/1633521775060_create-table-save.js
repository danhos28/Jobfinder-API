/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('savejobs', {
    save_id: {
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
  });
  pgm.addConstraint(
    'savejobs',
    'fk_savejobs_vacancies',
    'FOREIGN KEY(vacancy_id) REFERENCES vacancies(vacancy_id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'savejobs',
    'fk_savejobs_jobseekers',
    'FOREIGN KEY(jobseeker_id) REFERENCES jobseekers(jobseeker_id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('savejobs');
};
