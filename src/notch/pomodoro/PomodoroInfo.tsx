import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

import { cn } from '../../../lib/util'
import { PomodoroTypeEnum } from '../../types/pomodoro'
import { screenModeAtom } from '../useDetailScreenEvents'
import useNotificationItems from '../useNotificationItems'
import useInProgressPomodoro from './useInProgressPomodoro'

dayjs.extend(duration)

const WIDTH = 70

const PomodoroInfo = () => {
  const info = useInProgressPomodoro()
  const { addNotificationItem, removeNotificationItem } = useNotificationItems()
  const [pomodoroInfo, setPomodoroInfo] = useState({
    remainingTime: '',
    type: PomodoroTypeEnum.Work,
  })
  const screenMode = useAtomValue(screenModeAtom)
  // 番茄钟功能是否开启
  const [isPomodoroFeatureOpen, setIsPomodoroFeatureOpen] = useState(true)

  // 控制通知栏显示
  const showPomodoroInfo = isPomodoroFeatureOpen && Boolean(info)
  useEffect(() => {
    if (showPomodoroInfo) {
      addNotificationItem({ type: 'pomodoro', width: WIDTH, position: 'left' })
    } else {
      removeNotificationItem('pomodoro')
    }
  }, [showPomodoroInfo, addNotificationItem, removeNotificationItem])

  // 倒计时
  useEffect(() => {
    if (!info) return

    let timer: NodeJS.Timeout | null = null

    const updateRemainingTime = () => {
      const startTime = dayjs(info.latestPomodoro.start_time)
      const endTime = startTime.add(info.latestPomodoro.duration, 'second')
      const remaining = dayjs.duration(endTime.diff(dayjs()))

      if (remaining.asSeconds() <= 0) {
        setPomodoroInfo({
          remainingTime: '00:00',
          type: info.latestPomodoro.type,
        })
        if (timer) clearInterval(timer)
      } else {
        // 根据屏幕模式设置不同的时间格式
        setPomodoroInfo({
          remainingTime: screenMode === 'detail' ? remaining.format('mm:ss') : remaining.format('mm:--'),
          type: info.latestPomodoro.type,
        })
      }
    }

    updateRemainingTime()
    timer = setInterval(updateRemainingTime, 1000)

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [info, screenMode])

  // 监听关闭番茄钟事件
  useEffect(() => {
    const handleClosePomodoro = () => {
      removeNotificationItem('pomodoro')
      setIsPomodoroFeatureOpen(false)
    }
    window.ipcRenderer.on('close-pomodoro', handleClosePomodoro)
    return () => {
      window.ipcRenderer.off('close-pomodoro', handleClosePomodoro)
    }
  }, [removeNotificationItem])

  if (!showPomodoroInfo) return null

  return (
    <div
      className={cn('flex h-full items-center justify-end overflow-hidden bg-black text-sm', {
        'text-red-500': pomodoroInfo.type === PomodoroTypeEnum.Work,
        'text-green-500': pomodoroInfo.type === PomodoroTypeEnum.Break,
      })}
      style={{ width: `${WIDTH}px` }}
    >
      🍅<span className="ml-0.5 font-medium">{pomodoroInfo.remainingTime}</span>
    </div>
  )
}

export default PomodoroInfo
