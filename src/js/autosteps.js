import { parseHeadings } from './helpers/headings';

const isStep = h => /^Step \d+:/.test(h.textContent);
const getContainer = () => document.querySelector('[data-autosteps]');
const getSteps = () => {
  const headings = Array.prototype.slice.call(document.querySelectorAll('.content h3')) || [];
  return headings.filter(isStep);
};

const generateSteps = headings => {
  return headings
    .map(h => {
      return `<li>
        <a href="${h.href}" data-turbolinks="false">${h.text}</a>
      </li>`;
    })
    .join('');
};

const initialize = () => {
  const container = getContainer();
  const stepsHeadings = getSteps();

  if (!container || stepsHeadings.length < 1) {
    return;
  }

  const stepsList = generateSteps(parseHeadings(stepsHeadings));
  const stepsHtml = `
    <ul class="content__autosteps">
      ${stepsList}
    </ul>
  `;

  container.innerHTML = stepsHtml;
};

document.addEventListener('turbolinks:load', initialize);
document.addEventListener('autosteps:reinitialize', initialize);
