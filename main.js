const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function getConfigPath() {
    return path.join(app.getPath('userData'), 'config.json');
}

function loadConfig() {
    try {
        const configPath = getConfigPath();
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading config:', e);
    }
    return {};
}

function saveConfig(config) {
    try {
        const configPath = getConfigPath();
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (e) {
        console.error('Error saving config:', e);
    }
}


let controlWindow;
let overlayWindow;
let tray = null;
let isEditMode = false;

function createControlWindow() {
    controlWindow = new BrowserWindow({
        width: 400,
        height: 650,
        icon: path.join(__dirname, 'chat.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        title: "Twitch Overlay Control"
    });

    controlWindow.loadFile('index.html');
    
    controlWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            controlWindow.hide();
        }
    });

    controlWindow.on('closed', () => {
        controlWindow = null;
    });
}

function createOverlayWindow(channel) {
    if (overlayWindow) {
        overlayWindow.close();
    }

    const win = new BrowserWindow({
        width: 400,
        height: 600,
        icon: path.join(__dirname, 'chat.ico'),
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    overlayWindow = win;

    // Make the window click-through
    win.setIgnoreMouseEvents(true);

    win.loadFile('overlay.html');

    // Overlay will request channel name when ready

    win.on('closed', () => {
        if (overlayWindow === win) {
            overlayWindow = null;
        }
    });
}

function createTray() {
    if (tray) return;
    tray = new Tray(path.join(__dirname, 'chat.ico'));
    tray.setToolTip('Twitch Overlay Chat');

    const updateMenu = () => {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show Control Window',
                click: () => {
                    if (controlWindow) {
                        controlWindow.show();
                    } else {
                        createControlWindow();
                    }
                }
            },
            {
                label: isEditMode ? '✅ Finish Editing Overlay' : '🛠️ Enter Edit Mode',
                click: () => {
                    isEditMode = !isEditMode;
                    if (overlayWindow && !overlayWindow.isDestroyed()) {
                        overlayWindow.setIgnoreMouseEvents(!isEditMode);
                        overlayWindow.webContents.send('edit-mode-changed', isEditMode);
                    }
                    updateMenu();
                }
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    app.isQuiting = true;
                    app.quit();
                }
            }
        ]);
        tray.setContextMenu(contextMenu);
    };
    
    tray.updateMenu = updateMenu;
    updateMenu();

    tray.on('double-click', () => {
        if (controlWindow) {
            controlWindow.show();
        } else {
            createControlWindow();
        }
    });
}

app.whenReady().then(() => {
    createTray();
    createControlWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createControlWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

let currentConfig = null;

// IPC communication
ipcMain.handle('get-config', () => {
    return loadConfig();
});

ipcMain.on('save-config', (event, config) => {
    const existing = loadConfig();
    const updated = { ...existing, ...config };
    saveConfig(updated);
});

ipcMain.on('start-overlay', (event, config) => {
    currentConfig = config;
    createOverlayWindow(config.channel);
    if (controlWindow) {
        controlWindow.hide();
    }
});

ipcMain.on('overlay-ready', (event) => {
    event.reply('set-channel', currentConfig);
});

ipcMain.on('toggle-edit-mode', (event, isEditing) => {
    isEditMode = isEditing;
    if (overlayWindow && !overlayWindow.isDestroyed()) {
        // When editing, do not ignore mouse events so user can interact/drag
        overlayWindow.setIgnoreMouseEvents(!isEditMode);
        overlayWindow.webContents.send('edit-mode-changed', isEditMode);
    }
    if (tray && tray.updateMenu) tray.updateMenu();
});
