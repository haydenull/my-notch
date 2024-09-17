export enum PomodoroTypeEnum {
  Work = 1,
  Break = 2,
}
export type InProgressPomodoroInfo = {
  isInPomodoro: boolean
  latestPomodoro: {
    start_time: string
    duration: number
    type: PomodoroTypeEnum
  }
  currentTime: string
}
