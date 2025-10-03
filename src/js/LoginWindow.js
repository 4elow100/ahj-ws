import createElement from '../utils/CreateElement';
import { BASE_URL } from '../utils/config';
import ChatClient from './ChatClient';
import Tooltip from './Tooltip';

export default class LoginWindow {
  constructor() {
    this._onClick = this._onClick.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onInput = this._onInput.bind(this);
    this._removeEl = this._removeEl.bind(this);
    this.chat = new ChatClient();
    this.tooltip = new Tooltip();
    this._init();
  }

  _init() {
    const back = createElement('div', 'login-back');

    const container = createElement('div', 'login-container');

    const header = createElement('header', 'login-header', 'Введите псевдоним');
    container.append(header);

    const form = createElement('form', 'login-form');

    const input = createElement('input', 'login-input');
    input.type = 'text';
    input.setAttribute('aria-label', 'Login Input Field');
    this.input = input;
    form.append(input);

    const button = createElement('button', 'login-btn btn', 'Продолжить');
    form.append(button);

    this.form = form;

    container.append(form);

    back.append(container);

    this.el = back;
    this._eventListeners();
  }

  _onSubmit(e) {
    e.preventDefault();

    if (!this.input.value.trim()) {
      this.input.classList.add('bad-status');
      return;
    }

    fetch(`https://${BASE_URL}/new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.input.value.trim(),
      }),
    })
      .then((response) => {
        if (response.status !== 409) {
          return response.json();
        } else {
          this.tooltip.show(this.form, 'Данный псевдоним уже занят, выберите другой');
          this.input.classList.add('bad-status');
        }
      })
      .then((data) => {
        if (data) {
          this.chat.init(true, data.user);
          this._removeEl();
        }
      })
      .catch((err) => console.error(err));
  }

  _onClick(e) {
    if (!e.target.closest('.login-container')) {
      this._removeEl();
      this.chat.init(false);
      return;
    }
  }

  _onInput(e) {
    if (e.target.value.trim()) {
      e.target.classList.remove('bad-status');
      this.tooltip.hide();
    }
  }

  _eventListeners() {
    this.form.addEventListener('submit', this._onSubmit);
    this.input.addEventListener('input', this._onInput);
    this.el.addEventListener('click', this._onClick);
  }

  _removeEl() {
    this.form.removeEventListener('submit', this._onSubmit);
    this.input.removeEventListener('input', this._onInput);
    this.el.removeEventListener('click', this._onClick);
    this.el.remove();
  }
}
