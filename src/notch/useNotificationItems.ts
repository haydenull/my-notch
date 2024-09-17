import { useMemoizedFn } from 'ahooks'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

const notificationItemsAtom = atom<NotificationItem[]>([])

export type NotificationItem = {
  type: 'pomodoro'
  width: number
  position: 'left' | 'right'
}
const useNotificationItems = () => {
  const [notificationItems, setNotificationItems] = useAtom(notificationItemsAtom)

  const leftNotificationItems = notificationItems.filter((item) => item.position === 'left')
  const rightNotificationItems = notificationItems.filter((item) => item.position === 'right')

  const addNotificationItem = useMemoizedFn((item: NotificationItem) => {
    setNotificationItems((prev) => {
      if (prev.some((_item) => _item.type === item.type)) {
        return prev // 如果已存在相同类型的项，不做任何改变
      }

      window.ipcRenderer.send('update-notch-width', {
        position: item.position,
        width: item.width,
        from: `add ${item.type} notification item`,
      })

      return [...prev, item]
    })
  })
  const removeNotificationItem = useMemoizedFn((type: NotificationItem['type']) => {
    setNotificationItems((prev) => {
      const item = prev.find((item) => item.type === type)
      if (!item) return prev // 如果找不到匹配的项，不做任何改变

      window.ipcRenderer.send('update-notch-width', {
        position: item.position,
        width: -item.width,
        from: `remove ${item.type} notification item`,
      })

      return prev.filter((item) => item.type !== type)
    })
  })

  return {
    leftNotificationItems,
    rightNotificationItems,
    addNotificationItem,
    removeNotificationItem,
  }
}

export default useNotificationItems
