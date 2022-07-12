import { useState } from "react";

// Custom Hook that allows us to manage the visual mode of any component
function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]); // Keep track of the history of the modes

  /*
   * Transition Function
   * Hook will update the current mode to a new mode and add it to the story
   * If specified, hook will replace the current mode in the history with a new one 
   */
  function transition(newMode, replace = false) {
    if (replace) {
      setHistory((prev) => [...prev.slice(0, -1), newMode])
    } else {
      setHistory((prev) => [...prev, newMode]);
    }
  }

  /*
   * Back Function
   * Hook will allows us to go back to the previous mode by removing the last history mode
   */
  function back() {
    if (history.length <= 1) return;  // Limit to not allow user to go back past the initial mode
    setHistory((prev) => [...prev.slice(0, -1)]);
  }

  // Mode will always be the last history item. Because of React & hooks, state will be updated when returned
  return { mode: history[history.length - 1], transition, back };
}

export default useVisualMode;