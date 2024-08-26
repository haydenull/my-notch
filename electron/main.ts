import { app, BrowserWindow } from 'electron'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { WindowEnum, windowManager } from './window'

const require = createRequire(import.meta.url)
export const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let mainWin: BrowserWindow | null

function createMainWindow() {
  // win = new BrowserWindow({
  //   icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.mjs'),
  //   },
  // })
  mainWin = windowManager.createWindow(WindowEnum.Main)

  // Test active push message to Renderer-process.
  mainWin.webContents.on('did-finish-load', () => {
    mainWin?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // if (VITE_DEV_SERVER_URL) {
  //   win.loadURL(VITE_DEV_SERVER_URL)
  // } else {
  //   // win.loadFile('dist/index.html')
  //   win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  // }

  // test notch window
  const notchWin = windowManager.createWindow(WindowEnum.Notch, {
    route: '/notch',
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWin = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.whenReady().then(createMainWindow)
