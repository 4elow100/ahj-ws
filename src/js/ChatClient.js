import { BASE_URL } from '../utils/config';
import createElement from '../utils/CreateElement';
import formatDate from '../utils/formatDate';
import defaultImage from '../img/default-avatar.jpg';

export default class ChatClient {
  constructor() {
    this.isAuth = false;
    this.init = this.init.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this._addMessage = this._addMessage.bind(this);
    this._addUser = this._addUser.bind(this);
    this._onWSMessage = this._onWSMessage.bind(this);
  }

  init(isAuth, user) {
    this.socket = new WebSocket(`wss://${BASE_URL}`);

    this.isAuth = isAuth;

    if (isAuth) this.user = user;

    this.socket.addEventListener('open', () => {});
    this.socket.addEventListener('message', (e) => {
      this._onWSMessage(e);
    });
    this.socket.addEventListener('error', (e) => {
      console.log(e);
      console.log('error');
    });
    this.socket.addEventListener('close', (e) => {
      console.log(e);
    });
  }

  exitUser() {
    this.socket.send(
      JSON.stringify({
        type: 'exit',
        user: this.user,
      }),
    );
  }

  sendMessage(msg) {
    this.socket.send(
      JSON.stringify({
        type: 'send',
        message: msg,
        user: this.user,
      }),
    );
  }

  _onWSMessage(e) {
    const data = JSON.parse(e.data);

    if (Array.isArray(data)) {
      this._addUser(data);
    } else {
      this._addMessage(data);
    }
  }

  _addMessage(data) {
    const messageList = document.querySelector('.chat-scroll');

    const container = createElement('article', 'message-container');

    const header = createElement('header', 'message-header');
    let userName = data.user.name;

    container.appendChild(header);

    const messageEl = createElement('div', 'message-text', data.message);
    container.appendChild(messageEl);
    messageList.appendChild(container);
    if (this.isAuth) {
      if (data.user.name === this.user.name) {
        userName = 'You';
        container.classList.add('message-owner');
        setTimeout(() => {
          const chat = document.querySelector('.chat-scroll');
          const lastMsg = chat.lastElementChild;
          if (lastMsg) {
            chat.scrollTop =
              lastMsg.offsetTop +
              lastMsg.offsetHeight -
              chat.clientHeight +
              parseInt(getComputedStyle(chat).paddingBottom);
          }
        }, 0);
      }
    }
    header.textContent = `${userName}, ${formatDate()}`;
  }

  _addUser(dataList) {
    const usersList = document.querySelector('.users-list');

    usersList.innerHTML = '';

    dataList.forEach((data) => {
      const container = createElement('li', 'user-container');

      const avatar = createElement('div', 'user-avatar');

      const image = createElement('img', '');
      image.src = defaultImage;
      image.setAttribute('alt', 'Photo of User');

      avatar.appendChild(image);
      container.appendChild(avatar);

      const userName = createElement('div', 'user-name');
      userName.textContent = data.name;

      if (this.isAuth) {
        if (data.name === this.user.name) {
          userName.textContent = 'You';
          container.classList.add('user-owner');
        }
      }

      container.appendChild(userName);
      usersList.appendChild(container);
    });
  }
}
