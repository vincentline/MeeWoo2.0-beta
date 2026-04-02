// 命令行配置数据（由 AI 维护，用户无需手动编辑）
const COMMAND_CONFIG = {
  "commands": [
    { "category": "Figma", "command": "bunx cursor-talk-to-figma-socket" },
    { "category": "Git", "command": "git status" },
    { "category": "Git", "command": "git add ." },
    { "category": "Git", "command": "git commit -m \"Initial commit\"" },
    { "category": "Git", "command": "git push origin main" },
    { "category": "Linux", "command": "ls -la" },
    { "category": "Linux", "command": "pwd" },
    { "category": "Linux", "command": "sudo apt update" },
    { "category": "npm", "command": "npm install" },
    { "category": "npm", "command": "npm run build" },
    { "category": "npm", "command": "npm run dev" },
    { "category": "npm", "command": "npm run figma" },
    { "category": "Python", "command": "python scripts/feishu_agent_runner.py" },
    { "category": "Python", "command": "python scripts/feishu_mcp_server.py" },
    { "category": "Tunnel", "command": "cloudflared tunnel run feishu-ai" },
    { "category": "Windows", "command": "dir" },
    { "category": "Windows", "command": "ipconfig" },
    { "category": "Windows", "command": "ping google.com" }
  ]
};

function loadConfig() {
  renderCommands(COMMAND_CONFIG.commands);
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
      buttonElement.textContent = cmd.command;
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