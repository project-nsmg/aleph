module Main where

import UI.HSCurses.Curses
import FRP.Yampa
import Control.Monad

main :: IO ()
main = do
  initCurses
  keypad stdScr True
  echo False
  cursSet CursorInvisible
  reactimate initialize input (output stdScr) process

initialize :: IO String
initialize = return "Hello Yampa"

input :: Bool -> IO (DTime, Maybe String)
input _ = return (0.0, Nothing)

output :: Window -> Bool -> String -> IO Bool
output w _ x = do
  move 1 10
  wAddStr w x
  refresh
  return False

process :: SF String String
process = identity
