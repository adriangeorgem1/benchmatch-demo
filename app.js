'use strict';

const candidate = {
  grade: 'B2',
  skills: ['React', 'TypeScript', 'QA Testing'],
  relevantExperienceYears: 3,
  preferredLocation: 'London'
};

const roles = [
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

const searchInput = document.querySelector('#role-search');
const locationFilter = document.querySelector('#location-filter');
const roleList = document.querySelector('#role-list');
const resultCount = document.querySelector('#results-count');
const emptyState = document.querySelector('#empty-state');
const clearFiltersButton = document.querySelector('#clear-filters');

function renderSnapshot() {
  const rolesNeedingConfirmation = roles.filter((role) =>
    role.acceptedGrades === null ||
    role.requiredSkills === null ||
    role.minimumRelevantExperienceYears === null
  ).length;
  const rolesAcceptingCandidateGrade = roles.filter((role) =>
    role.acceptedGrades && role.acceptedGrades.includes(candidate.grade)
  ).length;

  document.querySelector('#role-total').textContent = String(roles.length);
  document.querySelector('#grade-total').textContent = String(rolesAcceptingCandidateGrade);
  document.querySelector('#confirmation-total').textContent = String(rolesNeedingConfirmation);
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function appendSkillGroup(parent, label, skills, variant) {
  const group = makeElement('div', 'skill-group');
  group.append(makeElement('span', 'skill-label', label));

  if (skills.length === 0) {
    group.append(makeElement('p', 'skill-empty', 'None'));
  } else {
    const list = makeElement('ul', 'skill-list');
    skills.forEach((skill) => {
      list.append(makeElement('li', `skill-chip skill-chip--${variant}`, skill));
    });
    group.append(list);
  }

  parent.append(group);
}

function analyzeRole(role) {
  let matchingSkills = null;
  let missingSkills = null;

  if (role.requiredSkills !== null) {
    const candidateSkills = new Set(candidate.skills.map((skill) => skill.toLowerCase()));
    matchingSkills = role.requiredSkills.filter((skill) =>
      candidateSkills.has(skill.toLowerCase())
    );
    missingSkills = role.requiredSkills.filter((skill) =>
      !candidateSkills.has(skill.toLowerCase())
    );
  }

  return {
    matchingSkills,
    missingSkills,
    gradeAccepted: role.acceptedGrades === null
      ? null
      : role.acceptedGrades.includes(candidate.grade),
    experienceMet: role.minimumRelevantExperienceYears === null
      ? null
      : candidate.relevantExperienceYears >= role.minimumRelevantExperienceYears
  };
}

function renderSkills(role, parent, analysis) {
  parent.append(makeElement('h4', '', 'Required skills'));

  if (analysis.matchingSkills === null || analysis.missingSkills === null) {
    parent.append(makeElement(
      'p',
      'skill-unknown',
      'Needs confirmation — required skills were not provided.'
    ));
    return;
  }

  appendSkillGroup(parent, 'Matching skills', analysis.matchingSkills, 'match');
  appendSkillGroup(parent, 'Missing required skills', analysis.missingSkills, 'missing');
}

function appendCheck(parent, label, state, message) {
  const row = makeElement('div', 'check-row');
  row.append(makeElement('dt', '', label));

  const description = makeElement('dd');
  description.append(makeElement('span', `status status--${state}`, {
    yes: 'Yes',
    no: 'No',
    unknown: 'Needs confirmation'
  }[state]));
  description.append(document.createTextNode(message));
  row.append(description);
  parent.append(row);
}

function renderChecks(role, parent, analysis) {
  parent.append(makeElement('h4', '', 'Eligibility checks'));
  const checks = makeElement('dl', 'checks');

  if (analysis.gradeAccepted === null) {
    appendCheck(checks, 'Grade', 'unknown', 'accepted grades were not provided.');
  } else {
    appendCheck(
      checks,
      'Grade',
      analysis.gradeAccepted ? 'yes' : 'no',
      analysis.gradeAccepted
        ? `${candidate.grade} is explicitly listed as accepted.`
        : `${candidate.grade} is not explicitly listed as accepted.`
    );
  }

  if (analysis.experienceMet === null) {
    appendCheck(checks, 'Experience', 'unknown', 'minimum relevant experience was not provided.');
  } else {
    appendCheck(
      checks,
      'Experience',
      analysis.experienceMet ? 'yes' : 'no',
      analysis.experienceMet
        ? `${candidate.relevantExperienceYears} years meets the ${role.minimumRelevantExperienceYears}-year minimum.`
        : `${candidate.relevantExperienceYears} years is below the ${role.minimumRelevantExperienceYears}-year minimum.`
    );
  }

  parent.append(checks);
}

function appendSummaryItem(parent, label, state, message) {
  const item = makeElement('li', `summary-item summary-item--${state}`);
  item.append(makeElement('span', 'summary-label', label));
  item.append(makeElement('span', 'summary-value', message));
  parent.append(item);
}

function renderRole(role) {
  const analysis = analyzeRole(role);
  const card = makeElement('article', 'role-card');
  const heading = makeElement('header', 'role-card__heading');
  const titleGroup = makeElement('div');
  titleGroup.append(makeElement('h3', '', role.title));
  titleGroup.append(makeElement('p', 'role-client', role.client));
  heading.append(titleGroup);
  heading.append(makeElement('span', 'role-location', role.location));
  card.append(heading);

  const summary = makeElement('ul', 'role-summary');
  const skillsState = analysis.matchingSkills === null
    ? 'unknown'
    : analysis.missingSkills.length === 0 ? 'yes' : 'no';
  const skillsMessage = analysis.matchingSkills === null
    ? 'Needs confirmation'
    : `${analysis.matchingSkills.length} matched · ${analysis.missingSkills.length} missing`;
  const gradeState = analysis.gradeAccepted === null
    ? 'unknown'
    : analysis.gradeAccepted ? 'yes' : 'no';
  const gradeMessage = analysis.gradeAccepted === null
    ? 'Needs confirmation'
    : analysis.gradeAccepted ? `${candidate.grade} accepted` : `${candidate.grade} not listed`;
  const experienceState = analysis.experienceMet === null
    ? 'unknown'
    : analysis.experienceMet ? 'yes' : 'no';
  const experienceMessage = analysis.experienceMet === null
    ? 'Needs confirmation'
    : analysis.experienceMet ? 'Meets minimum' : 'Below minimum';

  appendSummaryItem(summary, 'Skills', skillsState, skillsMessage);
  appendSummaryItem(summary, 'Grade', gradeState, gradeMessage);
  appendSummaryItem(summary, 'Experience', experienceState, experienceMessage);
  card.append(summary);

  const explanation = makeElement('details', 'role-explanation');
  explanation.append(makeElement('summary', '', 'View matching details'));
  const details = makeElement('div', 'role-card__details');
  const skills = makeElement('section');
  skills.setAttribute('aria-label', 'Skill comparison');
  renderSkills(role, skills, analysis);

  const eligibility = makeElement('section');
  eligibility.setAttribute('aria-label', 'Grade and experience checks');
  renderChecks(role, eligibility, analysis);

  details.append(skills, eligibility);
  explanation.append(details);
  card.append(explanation);
  return card;
}

function searchableText(role) {
  return [
    role.title,
    role.client,
    role.location,
    role.acceptedGrades ? role.acceptedGrades.join(' ') : '',
    role.requiredSkills ? role.requiredSkills.join(' ') : '',
    role.minimumRelevantExperienceYears === null
      ? ''
      : `${role.minimumRelevantExperienceYears} years`
  ].join(' ').toLowerCase();
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

function clearFilters() {
  searchInput.value = '';
  locationFilter.value = '';
  render();
  searchInput.focus();
}

const locations = [...new Set(roles.map((role) => role.location))].sort();
locations.forEach((location) => {
  const option = makeElement('option', '', location);
  option.value = location;
  locationFilter.append(option);
});

searchInput.addEventListener('input', render);
locationFilter.addEventListener('change', render);
clearFiltersButton.addEventListener('click', clearFilters);
renderSnapshot();
render();
