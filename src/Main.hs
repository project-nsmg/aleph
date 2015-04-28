module Main where

import UI.HSCurses.Curses
import FRP.Yampa
import Data.IORef
import Data.Time.Clock

type Input = (String, DTime)
type Output = Maybe String
data Stopwatch = Stopwatch { zero :: UTCTime
                           , prev :: UTCTime }

startStopwatch :: UTCTime -> Stopwatch
startStopwatch now = Stopwatch now now

storeStopwatch :: IO (IORef Stopwatch)
storeStopwatch = getCurrentTime >>= (newIORef . startStopwatch)

diffTime :: (IORef Stopwatch) -> IO (DTime, DTime)
diffTime ref = do
  now <- getCurrentTime
  (Stopwatch zero prev) <- readIORef ref
  writeIORef ref (Stopwatch zero now)
  let dt = realToFrac (diffUTCTime now prev)
      timePassed = realToFrac (diffUTCTime now zero)
  return (dt, timePassed)

main :: IO ()
main = do
  initCurses
  keypad stdScr True
  echo False
  cursSet CursorInvisible
  handle <- storeStopwatch
  reactimate initialize (input handle) (output stdScr) process
  endWin

initialize :: IO Input
initialize = return ("Hello Yampa", 0)

input :: (IORef Stopwatch) -> Bool -> IO (DTime, Maybe Input)
input ref _ = do
  (dt, timePassed) <- diffTime ref
  return (dt, Just ("Hello Yampa", timePassed))

output :: Window -> Bool -> Output -> IO Bool
output w _ (Just x) = do
  move 1 10
  wAddStr w x
  refresh
  return False
output w _ Nothing = return True

process :: SF Input Output
process = arr afun
  where afun (message, timePassed)
          | timePassed <= 1 = Just message
          | otherwise       = Nothing
