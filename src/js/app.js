import LoginWindow from './LoginWindow';

document.addEventListener('DOMContentLoaded', () => {
  const loginWindow = new LoginWindow();
  document.body.appendChild(loginWindow.el);

  const messageField = document.querySelector('.message-textarea');

  messageField.addEventListener('input', (e) => {
    if (e.target.innerText.trim()) {
      e.target.classList.remove('bad-status');
    }
  });

  messageField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loginWindow.chat.user) {
        alert('Пожалуйста. авторизуйтесь');
        return;
      }

      if (!e.target.innerText.trim()) {
        e.target.classList.add('bad-status');
      } else {
        loginWindow.chat.sendMessage(e.target.innerText.trim());
        e.target.innerText = '';
      }
    }
  });

  window.addEventListener('unload', (e) => {
    e.preventDefault();
    if (loginWindow.chat.user) loginWindow.chat.exitUser();
  });
});
