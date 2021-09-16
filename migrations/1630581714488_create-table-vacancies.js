/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('vacancies', {
    vacancy_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    employer_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    job_title: {
      type: 'TEXT',
      notNull: true,
    },
    job_desc: {
      type: 'TEXT',
      notNull: true,
    },
    job_qualifications: {
      type: 'TEXT',
      notNull: true,
    },
    job_notes: {
      type: 'TEXT',
      notNull: true,
    },
    job_level: {
      type: 'TEXT',
      notNull: true,
    },
    job_educationReq: {
      type: 'TEXT',
      notNull: true,
    },
    company: {
      type: 'TEXT',
      notNull: true,
    },
    company_about: {
      type: 'TEXT',
    },
    salary: {
      type: 'TEXT',
      notNull: true,
    },
    employment_type: {
      type: 'TEXT',
      notNull: true,
    },
    category: {
      type: 'TEXT',
      notNull: true,
    },
    job_location: {
      type: 'TEXT',
      notNull: true,
    },
    job_thumb: {
      type: 'TEXT',
    },
    job_createAt: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'vacancies',
    'fk_vacancies_employer',
    'FOREIGN KEY(employer_id) REFERENCES employers(employer_id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('vacancies');
};
