import { useRef } from 'react'

import { NOTCH_DETAIL_SIZE, NOTCH_NORMAL_SIZE } from '../../lib/constants'
import { cn } from '../../lib/util'
import PomodoroModule from './pomodoro/PomodoroModule'
import PomodoroNotificationItem from './pomodoro/PomodoroNotificationItem'
import { useDetailScreenEvents } from './useDetailScreenEvents'
import useNotificationItems, { type NotificationItem } from './useNotificationItems'

const ITEM_GAP = 8
const EDGE_PADDING = 4
const NotificationItems = ({ items }: { items: NotificationItem['type'][] }) => {
  return (
    <div className="flex h-full items-center" style={{ paddingLeft: EDGE_PADDING + 'px', gap: ITEM_GAP + 'px' }}>
      {items.map((item) => {
        switch (item) {
          case 'pomodoro':
            return <PomodoroNotificationItem key={item} />
          // 可以在这里添加更多的通知类型
          default:
            return null
        }
      })}
    </div>
  )
}

const Notch = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const { screenMode } = useDetailScreenEvents(rootRef)
  const { leftNotificationItems } = useNotificationItems()
  const extraLeftWidth = leftNotificationItems.reduce(
    (acc, item) => acc + item.width,
    EDGE_PADDING + ITEM_GAP * (leftNotificationItems.length - 1),
  )

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
        {/* Notch 左侧 通知项，边距为 EDGE_PADDING，间距为 ITEM_GAP */}
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
          <PomodoroModule />
        </div>
      ) : null}
    </div>
  )
}

function getHorizontalCenterX(containerWidth: number, extraLeftWidth: number) {
  return (containerWidth - NOTCH_NORMAL_SIZE.width) / 2 - extraLeftWidth
}

export default Notch
