const electron = require('electron');
const { ipcMain, dialog } = require('electron');
const fs = require('fs');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const databasesPath = "./databases"
const configsPath = "./databasesConfig"

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800, height: 600, 
        webPreferences: { 
            nodeIntegration: true, 
            // enableRemoteModule: true,
            // contextIsolation: false,
            // nodeIntegrationInWorker: true,
            // nodeIntegrationInSubFrames: true,
            preload: __dirname + '/Preload.js'
    }});

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// load the dialog module, to show the dialogs during the app usage
app.whenReady().then(() => {
    ipcMain.handle('dialog', async (event, method, params) => {       
      var response = await dialog[method](params);
      return response;
    });

    ipcMain.handle("listDatabases", async (event) => {
        return fs.readdirSync(databasesPath)
    });

    ipcMain.handle("deleteDatabase", async (event, filename) => {
        var response = {msg: "Base de Dados removida com sucesso", ok: true}
        try {
            fs.rmSync(path.join(databasesPath, filename))
        } catch (error) {
            response.msg = "Falha na remoção: " + error
            response.ok = false
        }
        return response
    });

    ipcMain.handle('readDatabase', async (event, filePath) => {
        if(filePath === path.basename(filePath))
            filePath = path.join(databasesPath, filePath);
        var fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent;
    });

    ipcMain.handle('saveDatabase', async (event, filename, dataContent) => {
        var response = {msg: "Conteúdo Salvo", ok: true}
        try{
            fs.writeFileSync(path.join(databasesPath, filename), dataContent)
        }catch(err){
            response.msg = "Falha no salvamento" + err
            response.ok = false
        }
        return response
    });

    ipcMain.handle('readClasses', async (event, databaseName) => {
        var databaseConfigFile = databaseName.replace(".csv", ".json")
        var databaseConfig = fs.readFileSync(path.join(configsPath, databaseConfigFile), 'utf8')
        return JSON.parse(databaseConfig)
    });

    ipcMain.handle('saveClasses', async (event, dataContent, databaseName) => {
        var response = {msg: "Conteúdo Salvo", ok: true}
        var databaseConfigFile = databaseName.replace(".csv", ".json")
        try{
            fs.writeFileSync(path.join(configsPath, databaseConfigFile), JSON.stringify(dataContent))
        }catch(err){
            response.msg = "Falha no salvamento" + err
            response.ok = false
        }
        return response
    })
});