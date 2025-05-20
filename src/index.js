// import { createTimeTravelRoot } from './core/createTimeTravelRoot';

// export const {
//   TimeTravelProvider,
//   useTimeTravelState,
//   useTimeTravelControls
// } = createTimeTravelRoot();

import { 
  TimeTravelProvider,
  useTimeTravelState,
  useTimeTravelControls
 } from './core';

 export {
    TimeTravelProvider,
    useTimeTravelState,
    useTimeTravelControls
}


export { useAutoTimeTravelDebugger } from './hooks/useAutoTimeTravelDebugger';
export { default as TimeTravelDebugger } from './components/TimeTravelDebugger';
