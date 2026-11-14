'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('mayaDesktop', {
  isDesktop: true,
  chooseFolder: () => ipcRenderer.invoke('mayaacc:chooseFolder'),
  writeFile: (dir, name, text) => ipcRenderer.invoke('mayaacc:writeFile', dir, name, text),
  list: dir => ipcRenderer.invoke('mayaacc:list', dir),
  remove: (dir, name) => ipcRenderer.invoke('mayaacc:remove', dir, name)
});
