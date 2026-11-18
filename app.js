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

function renderSkills(role, parent) {
  parent.append(makeElement('h4', '', 'Required skills'));

  if (role.requiredSkills === null) {
    parent.append(makeElement(
      'p',
      'skill-unknown',
      'Needs confirmation — required skills were not provided.'
    ));
    return;
  }

  const candidateSkills = new Set(candidate.skills.map((skill) => skill.toLowerCase()));
  const matchingSkills = role.requiredSkills.filter((skill) =>
    candidateSkills.has(skill.toLowerCase())
  );
  const missingSkills = role.requiredSkills.filter((skill) =>
    !candidateSkills.has(skill.toLowerCase())
  );

  appendSkillGroup(parent, 'Matching skills', matchingSkills, 'match');
  appendSkillGroup(parent, 'Missing required skills', missingSkills, 'missing');
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

function renderChecks(role, parent) {
  parent.append(makeElement('h4', '', 'Eligibility checks'));
  const checks = makeElement('dl', 'checks');

  if (role.acceptedGrades === null) {
    appendCheck(checks, 'Grade', 'unknown', 'accepted grades were not provided.');
  } else {
    const gradeAccepted = role.acceptedGrades.includes(candidate.grade);
    appendCheck(
      checks,
      'Grade',
      gradeAccepted ? 'yes' : 'no',
      gradeAccepted
        ? `${candidate.grade} is explicitly listed as accepted.`
        : `${candidate.grade} is not explicitly listed as accepted.`
    );
  }

  if (role.minimumRelevantExperienceYears === null) {
    appendCheck(checks, 'Experience', 'unknown', 'minimum relevant experience was not provided.');
  } else {
    const experienceMet = candidate.relevantExperienceYears >= role.minimumRelevantExperienceYears;
    appendCheck(
      checks,
      'Experience',
      experienceMet ? 'yes' : 'no',
      experienceMet
        ? `${candidate.relevantExperienceYears} years meets the ${role.minimumRelevantExperienceYears}-year minimum.`
        : `${candidate.relevantExperienceYears} years is below the ${role.minimumRelevantExperienceYears}-year minimum.`
    );
  }

  parent.append(checks);
}

function renderRole(role) {
  const card = makeElement('article', 'role-card');
  const heading = makeElement('header', 'role-card__heading');
  const titleGroup = makeElement('div');
  titleGroup.append(makeElement('h3', '', role.title));
  titleGroup.append(makeElement('p', 'role-client', role.client));
  heading.append(titleGroup);
  heading.append(makeElement('span', 'role-location', role.location));
  card.append(heading);

  const details = makeElement('div', 'role-card__details');
  const skills = makeElement('section');
  skills.setAttribute('aria-label', 'Skill comparison');
  renderSkills(role, skills);

  const eligibility = makeElement('section');
  eligibility.setAttribute('aria-label', 'Grade and experience checks');
  renderChecks(role, eligibility);

  details.append(skills, eligibility);
  card.append(details);
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
}

const locations = [...new Set(roles.map((role) => role.location))].sort();
locations.forEach((location) => {
  const option = makeElement('option', '', location);
  option.value = location;
  locationFilter.append(option);
});

searchInput.addEventListener('input', render);
locationFilter.addEventListener('change', render);
renderSnapshot();
render();
