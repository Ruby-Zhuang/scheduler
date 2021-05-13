import { useState } from "react";

// Custom Hook that allows us to manage the visual mode of any component
function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); // Keep track of the history of the modes

  /*
   * Transition Function
   * Hook will update the current mode to a new mode and add it to the story
   * If specified, hook will replace the current mode in the history with a new one 
   */
  function transition(newMode, replace = false) {
    if (replace) {
      const newHistory = history.slice(0, -1); // Shallow copies history array without last item
      setHistory([...newHistory, newMode]) // Is there a way to do this using prev?
    } else {
      setHistory((prev) => [...prev, newMode]);
    }

    setMode(newMode);
  }

  /*
   * Back Function
   * Hook will allows us to go back to the previous mode by removing the last history mode
   */
  function back() {
    if (history.length <= 1) return;  // Limit to not allow user to go back past the initial mode

    const newHistory = history.slice(0, -1); // Shallow copies history array without last item
    const prevMode = newHistory[newHistory.length - 1];

    setHistory(newHistory);
    setMode(prevMode);
  }

  return { mode, transition, back };
}

export default useVisualMode;