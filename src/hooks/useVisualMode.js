import { useState } from "react";

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);

  return { mode };
}

export default useVisualMode;