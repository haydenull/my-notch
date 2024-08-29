import { atom, useAtom } from 'jotai'
import { useEffect, type RefObject } from 'react'

export const screenModeAtom = atom<'normal' | 'detail'>('normal')

export const useDetailScreenEvents = (ref: RefObject<HTMLDivElement>) => {
  const [screenMode, setScreenMode] = useAtom(screenModeAtom)

  useEffect(() => {
    const div = ref.current
    if (div) {
      const handleMouseEnter = () => {
        setScreenMode('detail')
        console.log('enter-detail-screen')
        window.ipcRenderer.send('enter-detail-screen')
      }
      const handleMouseLeave = () => {
        setScreenMode('normal')
        console.log('leave-detail-screen')
        window.ipcRenderer.send('leave-detail-screen')
      }

      div.addEventListener('mouseenter', handleMouseEnter)
      div.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        div.removeEventListener('mouseenter', handleMouseEnter)
        div.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [ref])

  return { screenMode }
}
