const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    saveConfig: (config) => ipcRenderer.send('save-config', config),
    startOverlay: (config) => ipcRenderer.send('start-overlay', config),
    toggleEditMode: (isEditing) => ipcRenderer.send('toggle-edit-mode', isEditing),
    onSetChannel: (callback) => ipcRenderer.on('set-channel', callback),
    sendOverlayReady: () => ipcRenderer.send('overlay-ready'),
    onEditModeChanged: (callback) => ipcRenderer.on('edit-mode-changed', callback)
});
