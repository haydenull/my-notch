import { useEffect, useState } from 'react'

import { cn } from '../../../lib/util'

const PomodoroModule = () => {
  const [open, setOpen] = useState(true)

  // 监听打开番茄钟事件
  useEffect(() => {
    const handleOpenPomodoro = () => {
      setOpen(true)
    }
    window.ipcRenderer.on('open-pomodoro', handleOpenPomodoro)
    return () => {
      window.ipcRenderer.off('open-pomodoro', handleOpenPomodoro)
    }
  }, [])

  // 监听关闭番茄钟事件
  useEffect(() => {
    const handleClosePomodoro = () => {
      setOpen(false)
    }
    window.ipcRenderer.on('close-pomodoro', handleClosePomodoro)
    return () => {
      window.ipcRenderer.off('close-pomodoro', handleClosePomodoro)
    }
  }, [])

  // 打开或关闭番茄钟
  const onClick = () => {
    setOpen((cur) => {
      if (cur) {
        console.log('request-close-pomodoro')
        window.ipcRenderer.invoke('request-close-pomodoro')
      } else {
        console.log('request-open-pomodoro')
        window.ipcRenderer.invoke('request-open-pomodoro')
      }
      return !cur
    })
  }

  return (
    <div
      className={cn('flex size-16 items-center justify-center rounded-xl text-xl', {
        'bg-red-900': open,
        'border border-red-900': !open,
      })}
      onClick={onClick}
    >
      🍅
    </div>
  )
}

export default PomodoroModule
