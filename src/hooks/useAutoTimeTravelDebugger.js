import { useEffect, useRef } from 'react';
import { useTimeTravelControls } from '../core';
export function useAutoTimeTravelDebugger(stateObject, label = 'mainState') {
  const prevRef = useRef({});
  const { registerSnapshot } = useTimeTravelControls();

  useEffect(() => {
    const prev = prevRef.current;
    const hasChanged = Object.entries(stateObject).some(
      ([key, value]) => prev[key] !== value
    );

    if (hasChanged) {
      registerSnapshot({ [label]: stateObject });
      prevRef.current = { ...stateObject };
    }
  }, [stateObject, label]);
}
