export type InProgressPomodoroInfo = {
  isInPomodoro: boolean
  latestPomodoro: {
    start_time: string
    duration: number
  }
  currentTime: string
}
