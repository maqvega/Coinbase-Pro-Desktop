const electron = require('electron');
const { app, BrowserView, BrowserWindow } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let mainView;

function createWindow () {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  const sidebarWidth = 75;

  // Create the application window.
  win = new BrowserWindow({ width: width,
    height: height,
    minWidth: 400 + sidebarWidth,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false
    }
  });

  // Load the sidebar
  win.loadFile('sidebar.html');

  // Load the Coinbase Pro, offset by the sidebar
  mainView = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  });
  win.setBrowserView(mainView);
  mainView.setBounds({ x: sidebarWidth,
    y: 0,
    width: width - sidebarWidth,
    height: height - 50 });
  mainView.setAutoResize({ width: true, height: true});
  mainView.webContents.loadURL('https://pro.coinbase.com/trade/BTC-USD');

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    mainView = null;
  });

  require('./menu.js');
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
