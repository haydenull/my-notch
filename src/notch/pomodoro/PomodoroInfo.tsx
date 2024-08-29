import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

import { screenModeAtom } from '../useDetailScreenEvents'
import useNotificationItems from '../useNotificationItems'
import useInProgressPomodoro from './useInProgressPomodoro'

dayjs.extend(duration)

const WIDTH = 70

const PomodoroInfo = () => {
  const info = useInProgressPomodoro()
  const { addNotificationItem, removeNotificationItem } = useNotificationItems()
  const [remainingTime, setRemainingTime] = useState('')
  const screenMode = useAtomValue(screenModeAtom)

  // 控制通知栏显示
  const showPomodoroInfo = Boolean(info)
  useEffect(() => {
    if (showPomodoroInfo) {
      addNotificationItem({ type: 'pomodoro', width: WIDTH, position: 'left' })
    } else {
      removeNotificationItem('pomodoro')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPomodoroInfo])

  // 倒计时
  useEffect(() => {
    if (!info) return

    let timer: NodeJS.Timeout | null = null

    const updateRemainingTime = () => {
      const startTime = dayjs(info.latestPomodoro.start_time)
      const endTime = startTime.add(info.latestPomodoro.duration, 'second')
      const remaining = dayjs.duration(endTime.diff(dayjs()))

      if (remaining.asSeconds() <= 0) {
        setRemainingTime('00:00')
        if (timer) clearInterval(timer)
      } else {
        // 根据屏幕模式设置不同的时间格式
        setRemainingTime(screenMode === 'detail' ? remaining.format('mm:ss') : remaining.format('mm:--'))
      }
    }

    updateRemainingTime()
    timer = setInterval(updateRemainingTime, 1000)

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [info, screenMode]) // 添加 screenMode 作为依赖项

  if (!info) return null

  return (
    <div
      className="flex h-full items-center justify-end overflow-hidden bg-black text-sm text-red-500"
      style={{ width: `${WIDTH}px` }}
    >
      🍅<span className="ml-0.5 font-medium">{remainingTime}</span>
    </div>
  )
}

export default PomodoroInfo
