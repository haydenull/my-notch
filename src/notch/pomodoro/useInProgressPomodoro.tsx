import { useEffect, useState } from 'react'

import type { InProgressPomodoroInfo } from '../../types/pomodoro'

const useInProgressPomodoro = () => {
  const [inProgressPomodoroInfo, setInProgressPomodoroInfo] = useState<InProgressPomodoroInfo>()

  // 页面加载时，主动获取一次 inProgressPomodoroInfo
  useEffect(() => {
    window.ipcRenderer.invoke('get-in-progress-pomodoro-info').then(setInProgressPomodoroInfo)
  }, [])

  // 监听 in-progress-pomodoro-info 事件, 更新 inProgressPomodoroInfo
  useEffect(() => {
    const handlePomodoroInfo = (_event: Electron.IpcRendererEvent, info: InProgressPomodoroInfo) => {
      console.log('in-progress-pomodoro-info', info)
      setInProgressPomodoroInfo(info)
    }
    window.ipcRenderer.on('in-progress-pomodoro-info', handlePomodoroInfo)

    return () => {
      window.ipcRenderer.off('in-progress-pomodoro-info', handlePomodoroInfo)
    }
  }, [])

  return inProgressPomodoroInfo
}

export default useInProgressPomodoro
