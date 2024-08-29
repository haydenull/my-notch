import dayjs from 'dayjs'
import { app, BrowserWindow, screen, ipcMain } from 'electron'
import ky from 'ky'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { NOTCH_NORMAL_SIZE, NOTCH_DETAIL_SIZE } from '../lib/constants'
import type { InProgressPomodoroInfo } from '../src/types/pomodoro'
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

// ----------------------------- 窗口管理 -----------------------------
function createMainWindow() {
  const mainWin = windowManager.createWindow(WindowEnum.Main)

  // Test active push message to Renderer-process.
  mainWin.webContents.on('did-finish-load', () => {
    mainWin?.webContents.send('main-process-message', new Date().toLocaleString())
  })
}
function createNotchWindow() {
  const notchWin = windowManager.createWindow(WindowEnum.Notch, {
    route: '/notch',
    frame: false,
    transparent: true,
    width: NOTCH_NORMAL_SIZE.width,
    height: NOTCH_NORMAL_SIZE.height,
    resizable: false,
    alwaysOnTop: true,
    enableLargerThanScreen: true,
    hasShadow: false,
    roundedCorners: false,
  })
  notchWin.setVisibleOnAllWorkspaces(true)
  // 打开独立窗口调试器
  notchWin.webContents.openDevTools({ mode: 'detach' })

  const getHorizontalCenterPosition = (winWidth: number) => {
    const { width: screenWidth } = screen.getPrimaryDisplay().bounds
    return (screenWidth - winWidth) / 2
  }
  const Y_POSITION = 0
  notchWin.setPosition(getHorizontalCenterPosition(NOTCH_NORMAL_SIZE.width), Y_POSITION)
  notchWin.setAlwaysOnTop(true, 'screen-saver')

  // 鼠标进入离开，在 normal 和 detail 之间切换
  let isDetailScreen = false
  let leaveDetailScreenTimeout: NodeJS.Timeout | null = null
  ipcMain.on('enter-detail-screen', () => {
    if (leaveDetailScreenTimeout) {
      clearTimeout(leaveDetailScreenTimeout)
      leaveDetailScreenTimeout = null
    }
    if (!isDetailScreen) {
      console.log('main-process: enter-detail-screen')
      const x = getHorizontalCenterPosition(NOTCH_DETAIL_SIZE.width)
      notchWin.setBounds({ x, y: Y_POSITION, width: NOTCH_DETAIL_SIZE.width, height: NOTCH_DETAIL_SIZE.height }, true)
      isDetailScreen = true
    }
  })
  ipcMain.on('leave-detail-screen', () => {
    if (leaveDetailScreenTimeout) {
      clearTimeout(leaveDetailScreenTimeout)
    }
    leaveDetailScreenTimeout = setTimeout(() => {
      if (isDetailScreen) {
        console.log('main-process: leave-detail-screen')
        notchWin.setBounds(getNormalBounds(), true)
        isDetailScreen = false
      }
    }, 100)
  })

  // 增加或减少 normal 宽度，并重新计算位置
  const extraWidth = { left: 0, right: 0 }
  function getNormalBounds() {
    const width = NOTCH_NORMAL_SIZE.width + extraWidth.left + extraWidth.right
    const height = NOTCH_NORMAL_SIZE.height
    const x = getHorizontalCenterPosition(NOTCH_NORMAL_SIZE.width) - extraWidth.left
    return { x, y: Y_POSITION, width, height }
  }
  // 增加或减少 normal 宽度
  ipcMain.on('update-notch-width', (event, action: { position: 'left' | 'right'; width: number }) => {
    console.log('main-process: update-notch-width', action)
    if (action.position === 'left') {
      extraWidth.left = extraWidth.left + action.width
    } else {
      extraWidth.right = extraWidth.right + action.width
    }
    notchWin.setBounds(getNormalBounds(), true)
  })
}

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
    createNotchWindow()
  }
})

// ----------------------------- 番茄钟 -----------------------------
/** 获取番茄钟信息 */
const getInProgressPomodoroInfo = async () => {
  const res = await ky.get<{ data: InProgressPomodoroInfo }>(
    `https://pomodoro.haydenhayden.com/api/pomodoro/in-progress?currentTime=${encodeURIComponent(dayjs().toISOString())}`,
  )
  const data = await res.json()
  return data.data
}

/** 开启番茄钟信息轮询 */
const startPomodoroInfoPolling = () => {
  setInterval(
    () => {
      getInProgressPomodoroInfo().then((info) => {
        windowManager.getWindow(WindowEnum.Notch)?.webContents.send('in-progress-pomodoro-info', info)
      })
    },
    2 * 60 * 1000,
  )
}
ipcMain.handle('get-in-progress-pomodoro-info', getInProgressPomodoroInfo)

app.whenReady().then(() => {
  createMainWindow()
  createNotchWindow()
  startPomodoroInfoPolling()
})
