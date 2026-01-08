
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "宝华威热处理气氛成本分析系统",
    icon: path.join(__dirname, 'icon.ico'), // 如果你有图标的话
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // 加载本地文件
  win.loadFile('index.html');
  
  // 隐藏菜单栏（可选）
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
