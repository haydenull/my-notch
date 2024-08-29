import { atom, useAtom } from 'jotai'

const notificationItemsAtom = atom<NotificationItem[]>([])

type NotificationItem = {
  type: 'pomodoro'
  width: number
  position: 'left' | 'right'
}
const useNotificationItems = () => {
  const [notificationItems, setNotificationItems] = useAtom(notificationItemsAtom)

  const leftNotificationItems = notificationItems.filter((item) => item.position === 'left')
  const rightNotificationItems = notificationItems.filter((item) => item.position === 'right')

  const addNotificationItem = (item: NotificationItem) => {
    if (notificationItems.some((item) => item.type === item.type)) return
    window.ipcRenderer.send('update-notch-width', { position: item.position, width: item.width })
    setNotificationItems((prev) => [...prev, item])
  }
  const removeNotificationItem = (type: NotificationItem['type']) => {
    const item = notificationItems.find((item) => item.type === type)
    if (item) {
      window.ipcRenderer.send('update-notch-width', { position: item.position, width: -item.width })
    }
    setNotificationItems((prev) => prev.filter((item) => item.type !== type))
  }

  return {
    leftNotificationItems,
    rightNotificationItems,
    addNotificationItem,
    removeNotificationItem,
  }
}

export default useNotificationItems
