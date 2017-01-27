'use strict'

const debug = require('debug')('tc:main')
debug('init')
process.on('exit', function(code) {
    debug('process exited with', code)
})

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
    
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200, 
        height: 800,
        show: false
    })

    // and load the index.html of the app.
    if (debug.enabled){
        win.loadURL('http://localhost:13371')
    }else{
        win.loadURL(url.format({
            pathname: path.join(__dirname, '/node_modules/troncast-screen/dist/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }


    //Load vue devtools
    if (debug.enabled){
        const devtoolsInstaller = require('electron-devtools-installer')
        devtoolsInstaller.default(devtoolsInstaller.VUEJS_DEVTOOLS)
            .then((name) => {
                debug('dev-tool','Added Extension:',name)
                // Open the DevTools
                win.webContents.openDevTools()
            })
            .catch((err) => debug('dev-tool','An error occurred:', err))
    }

    win.once('ready-to-show', () => {
        debug('ready-to-show','URL loaded:',win.getURL())
        win.show()
    })

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null
    })
}


app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//macOS especific
app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})