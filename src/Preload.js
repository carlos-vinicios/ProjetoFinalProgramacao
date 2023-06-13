const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
    loadDatabases: () => ipcRenderer.invoke('listDatabases'),
    readDatabase: (filePath) => ipcRenderer.invoke('readDatabase', filePath),
    saveDatabase: (filename, dataContent) => ipcRenderer.invoke('saveDatabase', filename, dataContent),
    deleteDatabase: (databaseName) => ipcRenderer.invoke('deleteDatabase', databaseName),
    readClasses: (filename) => ipcRenderer.invoke('readClasses', filename),
    saveClasses: (dataContent, databaseName) => ipcRenderer.invoke('saveClasses', dataContent, databaseName),
});
