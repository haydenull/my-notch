import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron'
import path from 'node:path'

import { VITE_DEV_SERVER_URL, RENDERER_DIST } from './main'
import { __dirname } from './main'

const windows: Map<WindowEnum, BrowserWindow> = new Map()
export enum WindowEnum {
  Main = 'main',
  Notch = 'notch',
}
/** window name map */
const windowNameMap = {
  [WindowEnum.Main]: 'My Notch',
  [WindowEnum.Notch]: 'Notch',
}

interface WindowOptions extends BrowserWindowConstructorOptions {
  url?: string
  route?: string
}

export const windowManager = {
  createWindow(id: WindowEnum, options: WindowOptions = {}): BrowserWindow {
    const name = windowNameMap[id]
    const defaultOptions: WindowOptions = {
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.mjs'),
      },
      title: name,
      width: 800,
      height: 600,
    }

    const mergedOptions = { ...defaultOptions, ...options }
    const win = new BrowserWindow(mergedOptions)
    windows.set(id, win)

    if (options.url) {
      win.loadURL(options.url)
    } else if (VITE_DEV_SERVER_URL) {
      win.loadURL(options.route ? `${VITE_DEV_SERVER_URL}#${options.route}` : VITE_DEV_SERVER_URL)
    } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(RENDERER_DIST, options.route ? `index.html#${options.route}` : 'index.html'))
    }

    return win
  },

  getWindow: (id: WindowEnum) => windows.get(id),

  hideWindow: (id: WindowEnum) => windows.get(id)?.hide(),

  showWindow: (id: WindowEnum) => windows.get(id)?.show(),

  closeWindow(id: WindowEnum) {
    const win = windows.get(id)
    if (win) {
      win.close()
      windows.delete(id)
    }
  },

  closeAllWindows() {
    windows.forEach((win) => win.close())
    windows.clear()
  },
}
