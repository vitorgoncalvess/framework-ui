import { useState } from "react"

const useDebounceState = <T>(obj: T, updateFn: (state: T) => void): [T, ((arg: T) => void)] => {
  const [time, setTime] = useState<NodeJS.Timeout>()
  const [debounceState, setDebounceState] = useState<T>(obj)
  
  const updateState = (newState: T) => {
    setDebounceState(newState)
    if (time) {
      clearTimeout(time)
    }
    setTime(setTimeout(() => {
      updateFn(newState)
      console.log(newState)
    }, 1000))
  }

  return [debounceState, updateState]
}

export default useDebounceState