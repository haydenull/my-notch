import { useRef } from 'react'

import { NOTCH_DETAIL_SIZE, NOTCH_NORMAL_SIZE } from '../../lib/constants'
import { cn } from '../../lib/util'
import PomodoroInfo from './pomodoro/PomodoroInfo'
import { useDetailScreenEvents } from './useDetailScreenEvents'
import useNotificationItems from './useNotificationItems'

const Notch = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const { screenMode } = useDetailScreenEvents(rootRef)
  const { leftNotificationItems } = useNotificationItems()
  const extraLeftWidth = leftNotificationItems.reduce((acc, item) => acc + item.width, 0)

  return (
    <div ref={rootRef} className="relative h-screen w-screen cursor-pointer overflow-hidden rounded-b-xl bg-black">
      <div
        className={cn('h-full w-fit', screenMode === 'detail' ? 'absolute' : '')}
        style={{
          height: NOTCH_NORMAL_SIZE.height,
          left: getHorizontalCenterX(NOTCH_DETAIL_SIZE.width, extraLeftWidth),
          top: 0,
        }}
      >
        <PomodoroInfo />
        {/* Notch 占位区域 */}
        <div className="h-full" style={{ width: NOTCH_NORMAL_SIZE.width }}></div>
      </div>
    </div>
  )
}

function getHorizontalCenterX(containerWidth: number, extraLeftWidth: number) {
  return (containerWidth - NOTCH_NORMAL_SIZE.width) / 2 - extraLeftWidth
}

export default Notch
