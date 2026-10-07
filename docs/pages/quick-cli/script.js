async function loadConfig() {
  try {
    const response = await fetch('config.json');
    const config = await response.json();
    renderCommands(config.commands);
  } catch (error) {
    console.error('加载配置失败:', error);
  }
}

function renderCommands(commands) {
  const container = document.getElementById('commandContainer');
  container.innerHTML = '';

  const groupedCommands = commands.reduce((groups, command) => {
    const category = command.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {});

  const sortedCategories = Object.keys(groupedCommands).sort();

  sortedCategories.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'command-category';

    const titleElement = document.createElement('h2');
    titleElement.className = 'category-title';
    titleElement.textContent = category;
    categoryElement.appendChild(titleElement);

    const gridElement = document.createElement('div');
    gridElement.className = 'command-grid';

    const sortedCommands = groupedCommands[category].sort((a, b) => {
      return a.command.localeCompare(b.command);
    });

    sortedCommands.forEach(cmd => {
      const buttonElement = document.createElement('button');
      buttonElement.className = 'command-button';
      
      if (cmd.description) {
        buttonElement.classList.add('has-description');
        const cmdLine = document.createElement('span');
        cmdLine.className = 'cmd-line';
        cmdLine.textContent = cmd.command;
        const descLine = document.createElement('span');
        descLine.className = 'cmd-desc';
        descLine.textContent = cmd.description;
        buttonElement.appendChild(cmdLine);
        buttonElement.appendChild(descLine);
      } else {
        buttonElement.textContent = cmd.command;
      }
      
      buttonElement.addEventListener('click', () => copyToClipboard(cmd.command));
      gridElement.appendChild(buttonElement);
    });

    categoryElement.appendChild(gridElement);
    container.appendChild(categoryElement);
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
  } catch (error) {
    console.error('复制失败:', error);
    showToast('复制失败');
  }
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toastElement = document.createElement('div');
  toastElement.className = 'toast-message';
  toastElement.textContent = message;
  container.appendChild(toastElement);

  setTimeout(() => {
    toastElement.classList.add('show');
  }, 100);

  setTimeout(() => {
    toastElement.classList.remove('show');
    setTimeout(() => {
      container.removeChild(toastElement);
    }, 300);
  }, 3000);
}

function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.classList.toggle('dark-mode', savedTheme === 'dark');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  });
}

function init() {
  loadConfig();
  initThemeToggle();
}

window.addEventListener('DOMContentLoaded', init);