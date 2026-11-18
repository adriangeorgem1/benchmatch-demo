'use strict';

const candidate = {
  grade: 'B2',
  skills: ['React', 'TypeScript', 'QA Testing'],
  relevantExperienceYears: 3,
  preferredLocation: 'London'
};

const sampleRoles = [
  {
    title: 'Quality Assurance Engineer',
    client: 'Orbit Ledger (fictional)',
    location: 'London',
    acceptedGrades: ['B2', 'B3'],
    requiredSkills: ['TypeScript', 'QA Testing'],
    minimumRelevantExperienceYears: 3
  },
  {
    title: 'Frontend Developer',
    client: 'Northstar Garden Co. (fictional)',
    location: 'Manchester',
    acceptedGrades: ['B1', 'B2'],
    requiredSkills: ['React', 'TypeScript', 'Accessibility Testing'],
    minimumRelevantExperienceYears: 4
  },
  {
    title: 'Test Automation Analyst',
    client: 'Copper Finch Travel (fictional)',
    location: 'Bristol',
    acceptedGrades: ['B3', 'C1'],
    requiredSkills: ['QA Testing', 'Playwright'],
    minimumRelevantExperienceYears: 2
  },
  {
    title: 'Product UI Engineer',
    client: 'Paper Kite Learning (fictional)',
    location: 'Leeds',
    acceptedGrades: null,
    requiredSkills: ['React', 'CSS'],
    minimumRelevantExperienceYears: 2.5
  },
  {
    title: 'QA Analyst',
    client: 'Lantern House Studio (fictional)',
    location: 'London',
    acceptedGrades: ['B2'],
    requiredSkills: null,
    minimumRelevantExperienceYears: null
  },
  {
    title: 'Software Test Engineer',
    client: 'Blue Acorn Tools (fictional)',
    location: 'Glasgow',
    acceptedGrades: ['B2', 'B4'],
    requiredSkills: ['TypeScript', 'QA Testing', 'API Testing'],
    minimumRelevantExperienceYears: 3
  }
];

let roles = cloneRoles(sampleRoles);

const gradeInput = document.querySelector('#candidate-grade');
const skillsInput = document.querySelector('#candidate-skills');
const experienceInput = document.querySelector('#candidate-experience');
const locationInput = document.querySelector('#candidate-location');
const demandFileInput = document.querySelector('#demand-file');
const importMessage = document.querySelector('#import-message');
const loadSampleButton = document.querySelector('#load-sample');
const downloadExampleLink = document.querySelector('#download-example');
const searchInput = document.querySelector('#role-search');
const locationFilter = document.querySelector('#location-filter');
const roleList = document.querySelector('#role-list');
const resultCount = document.querySelector('#results-count');
const emptyState = document.querySelector('#empty-state');
const clearFiltersButton = document.querySelector('#clear-filters');

const csvColumns = [
  { key: 'title', label: 'Title' },
  { key: 'client', label: 'Client' },
  { key: 'location', label: 'Location' },
  { key: 'acceptedGrades', label: 'Accepted Grades' },
  { key: 'requiredSkills', label: 'Required Skills' },
  { key: 'minimumRelevantExperienceYears', label: 'Minimum Relevant Experience (Years)' }
];

function cloneRoles(source) {
  return source.map((role) => ({
    ...role,
    acceptedGrades: role.acceptedGrades === null ? null : [...role.acceptedGrades],
    requiredSkills: role.requiredSkills === null ? null : [...role.requiredSkills]
  }));
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderCandidateEditor() {
  gradeInput.value = candidate.grade;
  skillsInput.value = candidate.skills.join(', ');
  experienceInput.value = candidate.relevantExperienceYears === null
    ? ''
    : String(candidate.relevantExperienceYears);
  locationInput.value = candidate.preferredLocation;
}

function formatExperience(years) {
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}

function analyzeRole(role) {
  let matchingSkills = null;
  let missingSkills = null;

  if (role.requiredSkills !== null && candidate.skills.length > 0) {
    const candidateSkills = new Set(candidate.skills.map((skill) => skill.toLowerCase()));
    matchingSkills = role.requiredSkills.filter((skill) =>
      candidateSkills.has(skill.toLowerCase())
    );
    missingSkills = role.requiredSkills.filter((skill) =>
      !candidateSkills.has(skill.toLowerCase())
    );
  }

  const candidateGrade = candidate.grade.trim();
  const gradeAccepted = role.acceptedGrades === null || !candidateGrade
    ? null
    : role.acceptedGrades.includes(candidateGrade);
  const experienceMet = role.minimumRelevantExperienceYears === null ||
    candidate.relevantExperienceYears === null
    ? null
    : candidate.relevantExperienceYears >= role.minimumRelevantExperienceYears;

  const checks = [
    { key: 'skills', state: matchingSkills === null ? 'unknown' : missingSkills.length > 0 ? 'gap' : 'pass' },
    { key: 'grade', state: gradeAccepted === null ? 'unknown' : gradeAccepted ? 'pass' : 'gap' },
    { key: 'experience', state: experienceMet === null ? 'unknown' : experienceMet ? 'pass' : 'gap' }
  ];

  const summary = checks.some((check) => check.state === 'gap')
    ? 'Gaps to review'
    : checks.some((check) => check.state === 'unknown')
      ? 'Needs confirmation'
      : 'Meets listed requirements';

  return {
    matchingSkills,
    missingSkills,
    gradeAccepted,
    experienceMet,
    checks,
    summary
  };
}

function skillExplanation(role, analysis) {
  if (role.requiredSkills === null) {
    return { state: 'unknown', text: 'Needs confirmation — required skills were not provided.' };
  }
  if (candidate.skills.length === 0) {
    return { state: 'unknown', text: 'Needs confirmation — add candidate skills to compare.' };
  }
  if (analysis.missingSkills.length === 0) {
    return {
      state: 'pass',
      text: `All listed skills match: ${analysis.matchingSkills.join(', ')}.`
    };
  }

  const matchingText = analysis.matchingSkills.length > 0
    ? `Matching: ${analysis.matchingSkills.join(', ')}. `
    : 'Matching: none. ';
  return {
    state: 'gap',
    text: `${matchingText}Missing: ${analysis.missingSkills.join(', ')}.`
  };
}

function gradeExplanation(role, analysis) {
  if (role.acceptedGrades === null) {
    return { state: 'unknown', text: 'Needs confirmation — accepted grades were not provided.' };
  }
  const candidateGrade = candidate.grade.trim();
  if (!candidateGrade) {
    return { state: 'unknown', text: 'Needs confirmation — enter a candidate grade to check.' };
  }
  if (analysis.gradeAccepted) {
    return { state: 'pass', text: `${candidateGrade} is explicitly listed as accepted.` };
  }
  return { state: 'gap', text: `${candidateGrade} is not explicitly listed as accepted.` };
}

function experienceExplanation(role, analysis) {
  if (role.minimumRelevantExperienceYears === null) {
    return { state: 'unknown', text: 'Needs confirmation — the minimum was not provided.' };
  }
  if (candidate.relevantExperienceYears === null) {
    return { state: 'unknown', text: 'Needs confirmation — enter candidate experience to check.' };
  }
  if (analysis.experienceMet) {
    return {
      state: 'pass',
      text: `${formatExperience(candidate.relevantExperienceYears)} meets the ${role.minimumRelevantExperienceYears}-year minimum.`
    };
  }
  return {
    state: 'gap',
    text: `${formatExperience(candidate.relevantExperienceYears)} is below the ${role.minimumRelevantExperienceYears}-year minimum.`
  };
}

function appendRequirement(parent, label, result) {
  const item = makeElement('li', `requirement-check requirement-check--${result.state}`);
  item.append(makeElement('span', 'requirement-label', label));
  item.append(makeElement('span', 'requirement-detail', result.text));
  parent.append(item);
}

function renderRole(role) {
  const analysis = analyzeRole(role);
  const card = makeElement('article', 'role-card');
  const heading = makeElement('header', 'role-card__heading');
  const titleGroup = makeElement('div');
  titleGroup.append(makeElement('h3', '', role.title));
  titleGroup.append(makeElement('p', 'role-client', role.client || 'Client needs confirmation'));
  heading.append(titleGroup);
  heading.append(makeElement('span', 'role-location', role.location || 'Location needs confirmation'));
  card.append(heading);

  const outcome = makeElement(
    'p',
    `role-outcome role-outcome--${analysis.summary === 'Meets listed requirements'
      ? 'pass'
      : analysis.summary === 'Gaps to review' ? 'gap' : 'unknown'}`,
    analysis.summary
  );
  card.append(outcome);

  const requirements = makeElement('ul', 'requirement-list');
  appendRequirement(requirements, 'Skills', skillExplanation(role, analysis));
  appendRequirement(requirements, 'Grade', gradeExplanation(role, analysis));
  appendRequirement(requirements, 'Experience', experienceExplanation(role, analysis));
  card.append(requirements);
  return card;
}

function searchableText(role) {
  return [
    role.title,
    role.client || '',
    role.location || '',
    role.acceptedGrades ? role.acceptedGrades.join(' ') : '',
    role.requiredSkills ? role.requiredSkills.join(' ') : '',
    role.minimumRelevantExperienceYears === null
      ? ''
      : `${role.minimumRelevantExperienceYears} years`
  ].join(' ').toLowerCase();
}

function updateLocationOptions() {
  const selectedLocation = locationFilter.value;
  const locations = [...new Set(roles.map((role) => role.location).filter(Boolean))].sort();
  const allLocations = makeElement('option', '', 'All locations');
  allLocations.value = '';
  locationFilter.replaceChildren(allLocations);

  locations.forEach((location) => {
    const option = makeElement('option', '', location);
    option.value = location;
    locationFilter.append(option);
  });

  locationFilter.value = locations.includes(selectedLocation) ? selectedLocation : '';
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedLocation = locationFilter.value;
  const visibleRoles = roles.filter((role) => {
    const matchesSearch = searchableText(role).includes(query);
    const matchesLocation = !selectedLocation || role.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  roleList.replaceChildren(...visibleRoles.map(renderRole));
  resultCount.textContent = `Showing ${visibleRoles.length} of ${roles.length} roles`;
  emptyState.hidden = visibleRoles.length > 0;
  clearFiltersButton.disabled = query.length === 0 && selectedLocation.length === 0;
}

function setImportMessage(message, state) {
  importMessage.textContent = message;
  importMessage.className = `import-message${state ? ` import-message--${state}` : ''}`;
}

function useRoles(newRoles, message) {
  roles = newRoles;
  searchInput.value = '';
  locationFilter.value = '';
  updateLocationOptions();
  render();
  setImportMessage(message, 'success');
}

function clearFilters() {
  searchInput.value = '';
  locationFilter.value = '';
  render();
  searchInput.focus();
}

function finishCSVRow(rows, row, field) {
  row.push(field);
  rows.push(row);
}

function parseCSV(text) {
  const source = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let afterQuote = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (inQuotes) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
        afterQuote = true;
      } else {
        field += character;
      }
      continue;
    }

    if (afterQuote) {
      if (character === ',') {
        row.push(field);
        field = '';
        afterQuote = false;
      } else if (character === '\n' || character === '\r') {
        finishCSVRow(rows, row, field);
        row = [];
        field = '';
        afterQuote = false;
        if (character === '\r' && source[index + 1] === '\n') index += 1;
      } else if (character !== ' ' && character !== '\t') {
        throw new Error(`Unexpected character after a quoted value near character ${index + 1}.`);
      }
      continue;
    }

    if (character === '"') {
      if (field.length > 0) {
        throw new Error(`Unexpected quote near character ${index + 1}.`);
      }
      inQuotes = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      finishCSVRow(rows, row, field);
      row = [];
      field = '';
      if (character === '\r' && source[index + 1] === '\n') index += 1;
    } else {
      field += character;
    }
  }

  if (inQuotes) {
    throw new Error('The CSV ends inside a quoted value. Check that each quote is closed.');
  }
  if (field.length > 0 || row.length > 0 || afterQuote) {
    finishCSVRow(rows, row, field);
  }
  return rows;
}

function normalizeHeader(header) {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function splitList(value, label, rowNumber) {
  if (!value.trim()) return null;
  const items = value.split('|').map((item) => item.trim());
  if (items.some((item) => item.length === 0)) {
    throw new Error(`Row ${rowNumber}: separate ${label} with | and do not leave an empty item.`);
  }
  return items;
}

function parseDemandCSV(text) {
  const rows = parseCSV(text);
  if (rows.length === 0 || rows[0].every((cell) => cell.trim() === '')) {
    throw new Error('The file is empty. Include the required column headers and at least one role.');
  }

  const headers = rows[0].map((header) => normalizeHeader(header));
  if (headers.some((header) => header.length === 0)) {
    throw new Error('Every CSV column needs a header. Download the example to see the required columns.');
  }

  const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index);
  if (duplicates.length > 0) {
    throw new Error('The CSV has duplicate column headers. Each column must have a unique name.');
  }

  const missingColumns = csvColumns.filter((column) =>
    !headers.includes(normalizeHeader(column.label))
  );
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.map((column) => column.label).join(', ')}.`);
  }

  const indexes = Object.fromEntries(csvColumns.map((column) => [
    column.key,
    headers.indexOf(normalizeHeader(column.label))
  ]));
  const dataRows = rows.slice(1)
    .map((data, index) => ({ data, rowNumber: index + 2 }))
    .filter(({ data }) => data.some((cell) => cell.trim() !== ''));

  if (dataRows.length === 0) {
    throw new Error('No role rows were found after the headers.');
  }

  const importedRoles = [];
  const errors = [];
  dataRows.forEach(({ data, rowNumber }) => {
    try {
      if (data.length !== headers.length) {
        throw new Error(`Row ${rowNumber}: expected ${headers.length} columns but found ${data.length}.`);
      }

      const read = (key) => data[indexes[key]].trim();
      const title = read('title');
      if (!title) {
        throw new Error(`Row ${rowNumber}: Title cannot be empty.`);
      }

      const acceptedGrades = splitList(read('acceptedGrades'), 'accepted grades', rowNumber);
      const requiredSkills = splitList(read('requiredSkills'), 'required skills', rowNumber);
      const experienceText = read('minimumRelevantExperienceYears');
      const experience = experienceText === '' ? null : Number(experienceText);
      if (experience !== null && (!Number.isFinite(experience) || experience < 0)) {
        throw new Error(`Row ${rowNumber}: Minimum Relevant Experience (Years) must be a non-negative number or blank.`);
      }

      importedRoles.push({
        title,
        client: read('client') || null,
        location: read('location') || null,
        acceptedGrades,
        requiredSkills,
        minimumRelevantExperienceYears: experience
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `Row ${rowNumber}: unable to read the role.`);
    }
  });

  if (errors.length > 0) {
    const shownErrors = errors.slice(0, 5);
    const remaining = errors.length - shownErrors.length;
    throw new Error(`${shownErrors.join(' ')}${remaining > 0 ? ` And ${remaining} more row error(s).` : ''}`);
  }
  return importedRoles;
}

function csvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function prepareExampleDownload() {
  const lines = [
    csvColumns.map((column) => column.label),
    ...sampleRoles.map((role) => [
      role.title,
      role.client,
      role.location,
      role.acceptedGrades === null ? '' : role.acceptedGrades.join('|'),
      role.requiredSkills === null ? '' : role.requiredSkills.join('|'),
      role.minimumRelevantExperienceYears
    ])
  ];
  const csv = lines.map((line) => line.map(csvCell).join(',')).join('\r\n');
  downloadExampleLink.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
}

document.querySelector('#candidate-form').addEventListener('submit', (event) => {
  event.preventDefault();
});
gradeInput.addEventListener('input', () => {
  candidate.grade = gradeInput.value;
  render();
});
skillsInput.addEventListener('input', () => {
  candidate.skills = skillsInput.value.split(',').map((skill) => skill.trim()).filter(Boolean);
  render();
});
experienceInput.addEventListener('input', () => {
  const experience = experienceInput.valueAsNumber;
  candidate.relevantExperienceYears = experienceInput.value === '' ||
    !Number.isFinite(experience) || experience < 0
    ? null
    : experience;
  render();
});
locationInput.addEventListener('input', () => {
  candidate.preferredLocation = locationInput.value;
});
searchInput.addEventListener('input', render);
locationFilter.addEventListener('change', render);
clearFiltersButton.addEventListener('click', clearFilters);
loadSampleButton.addEventListener('click', () => {
  useRoles(cloneRoles(sampleRoles), 'Loaded all six fictional sample roles.');
});
demandFileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      throw new Error('Choose a CSV file. In Excel, save the demand sheet as CSV first.');
    }
    const importedRoles = parseDemandCSV(await file.text());
    useRoles(importedRoles, `Loaded ${importedRoles.length} role(s) from ${file.name}.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The file could not be read.';
    setImportMessage(`Import failed: ${message}`, 'error');
  } finally {
    demandFileInput.value = '';
  }
});

renderCandidateEditor();
updateLocationOptions();
prepareExampleDownload();
render();
