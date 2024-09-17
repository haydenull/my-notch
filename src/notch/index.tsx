import { useRef } from 'react'

import { NOTCH_DETAIL_SIZE, NOTCH_NORMAL_SIZE } from '../../lib/constants'
import { cn } from '../../lib/util'
import PomodoroInfo from './pomodoro/PomodoroInfo'
import { useDetailScreenEvents } from './useDetailScreenEvents'
import useNotificationItems, { type NotificationItem } from './useNotificationItems'

const NotificationItems = ({ items }: { items: NotificationItem['type'][] }) => {
  return items.map((item) => {
    switch (item) {
      case 'pomodoro':
        return <PomodoroInfo key={item} />
      // 可以在这里添加更多的通知类型
      default:
        return null
    }
  })
}

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
        {/* Notch 左侧 通知项 */}
        <NotificationItems items={['pomodoro']} />
        {/* Notch 占位区域 */}
        <div className="h-full" style={{ width: NOTCH_NORMAL_SIZE.width }}></div>
        {/* Notch 右侧 通知项 */}
        {/* <NotificationItems items={[]} /> */}
      </div>
      {screenMode === 'detail' ? (
        <div
          className="flex gap-4 px-4 py-2"
          style={{
            marginTop: NOTCH_NORMAL_SIZE.height + 'px',
          }}
        >
          <div className="flex size-16 items-center justify-center rounded-xl bg-red-900 text-xl">🍅</div>
        </div>
      ) : null}
    </div>
  )
}

function getHorizontalCenterX(containerWidth: number, extraLeftWidth: number) {
  return (containerWidth - NOTCH_NORMAL_SIZE.width) / 2 - extraLeftWidth
}

export default Notch
