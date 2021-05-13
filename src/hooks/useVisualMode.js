import { useState } from "react";

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode) {
    setMode(newMode);
    setHistory((prev) => [...prev, newMode]);
  }

  function back() {
    if (history.length <= 1) return;  // Limit to not allow user to go back past the initial mode
    
    const newHistory = history.slice(0, -1); // Shallow copies history arrow without last item
    const prevMode = newHistory[newHistory.length - 1];

    setHistory(newHistory);
    setMode(prevMode);
  }

  return { mode, transition, back };
}

export default useVisualMode;