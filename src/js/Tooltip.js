import createElement from '../utils/CreateElement';

export default class Tooltip {
  constructor() {
    this.init();
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  init() {
    const tooltip = createElement('div', 'tooltip top');
    const arrow = createElement('div', 'tooltip-arrow');
    const inner = createElement('div', 'tooltip-inner');

    tooltip.appendChild(arrow);
    tooltip.appendChild(inner);

    this.inner = inner;
    this.el = tooltip;
  }

  show(elem, text) {
    this.inner.textContent = text;

    elem.appendChild(this.el);
    this.el.classList.add('in');

    this.el.style = 'min-width: 302px';

    const { width } = elem.getBoundingClientRect();

    const popLeft = Math.max(width / 2 - this.el.offsetWidth / 2, 5);
    this.el.style.left = popLeft + 'px';

    const popTop = 0 - this.el.offsetHeight - 5;

    this.el.style.top = popTop + 'px';
  }

  hide() {
    this.el.classList.remove('in');
  }
}
