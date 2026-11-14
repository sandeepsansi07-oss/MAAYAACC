'use strict';
const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

if (!app.requestSingleInstanceLock()) { app.quit(); }
let win = null, closing = false;

const NAME_OK = /^MAYAACC_[\w\- ]{1,60}\.json$/;
function dirOk(d) { return typeof d === 'string' && d.length > 1 && fs.existsSync(d) && fs.statSync(d).isDirectory(); }

ipcMain.handle('mayaacc:chooseFolder', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Choose the MAYAACC backup folder', properties: ['openDirectory', 'createDirectory'] });
  return r.canceled || !r.filePaths.length ? null : r.filePaths[0];
});
ipcMain.handle('mayaacc:writeFile', async (_e, dir, name, text) => {
  if (!dirOk(dir) || !NAME_OK.test(name) || typeof text !== 'string') throw new Error('Invalid backup location or file name.');
  const target = path.join(dir, name), tmp = target + '.tmp';
  fs.writeFileSync(tmp, text, 'utf8');
  fs.renameSync(tmp, target);
  return true;
});
ipcMain.handle('mayaacc:list', async (_e, dir) => {
  if (!dirOk(dir)) throw new Error('The backup folder is not available.');
  return fs.readdirSync(dir).filter(n => NAME_OK.test(n));
});
ipcMain.handle('mayaacc:remove', async (_e, dir, name) => {
  if (!dirOk(dir) || !NAME_OK.test(name)) throw new Error('Invalid backup location or file name.');
  fs.unlinkSync(path.join(dir, name));
  return true;
});

function createWindow() {
  win = new BrowserWindow({
    width: 1366, height: 820, minWidth: 1000, minHeight: 640,
    backgroundColor: '#f4f6fa', autoHideMenuBar: true, show: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Links open in the normal browser; blank windows (print preview) stay inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:|^mailto:|^tel:/i.test(url)) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://')) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); }
  });

  // Save a last backup to the backup folder before the window closes.
  win.on('close', e => {
    if (closing) return;
    e.preventDefault(); closing = true;
    const done = () => { try { win.destroy(); } catch (x) {} };
    const t = setTimeout(done, 5000);
    win.webContents.executeJavaScript('window.MayaBackupFolder&&window.MayaBackupFolder.ready()?window.MayaBackupFolder.runDirty().catch(function(){}):0')
      .catch(() => {}).finally(() => { clearTimeout(t); done(); });
  });
  win.on('closed', () => { win = null; });
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
