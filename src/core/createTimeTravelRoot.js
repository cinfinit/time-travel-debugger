
import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    useCallback,
  } from 'react';
  
  export function createTimeTravelRoot() {
    const TimeTravelContext = createContext(null); // ← Must default to null
  
    function TimeTravelProvider({ children }) {
      const [history, setHistory] = useState([
        { state: {}, timestamp: Date.now() },
      ]);
      const [pointer, setPointer] = useState(0);
      const stateRegistry = useRef({});
      const isPlayingRef = useRef(false);
      const intervalRef = useRef(null);
  
      const register = (key, initialValue, setter) => {
        stateRegistry.current[key] = setter;
  
        // Avoid duplicate registration
        if (history[pointer]?.state?.[key] === undefined) {
          setHistory((prev) => {
            const newState = {
              ...prev[pointer].state,
              [key]: initialValue,
            };
            return [
              ...prev.slice(0, pointer),
              { state: newState, timestamp: Date.now() },
            ];
          });
        }
      };
  
      const commit = (key, value) => {
        const latest = history[pointer]?.state || {};
        const newSnapshot = {
          state: {
            ...latest,
            [key]: value,
          },
          timestamp: Date.now(),
        };
        const newHistory = [...history.slice(0, pointer + 1), newSnapshot];
        setHistory(newHistory);
        setPointer(newHistory.length - 1);
      };
  
      const goTo = (index) => {
        if (index < 0 || index >= history.length) return;
  
        setPointer(index);
        const snapshot = history[index];
        if (!snapshot) return;
  
        Object.entries(snapshot.state).forEach(([key, value]) => {
          const setter = stateRegistry.current[key];
          if (setter) setter(value);
        });
      };
  
      const rewind = () => {
        goTo(pointer - 1);
      };
  
      const fastForward = () => {
        goTo(pointer + 1);
      };
  
      const play = () => {
        isPlayingRef.current = true;
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setPointer((prev) => {
            const next = prev + 1;
            if (next < history.length) {
              goTo(next);
              return next;
            } else {
              pause();
              return prev;
            }
          });
        }, 1000);
      };
  
      const pause = () => {
        isPlayingRef.current = false;
        clearInterval(intervalRef.current);
      };
      const registerSnapshot = (partialState) => {
        setHistory((prev) => [
          ...prev,
          {
            timestamp: Date.now(),
            state: {
              ...(prev[prev.length - 1]?.state || {}),
              ...partialState,
            },
          },
        ]);
        setPointer((prev) => prev + 1);
      };
      const contextValue = {
        history,
        pointer,
        register,
        registerSnapshot,
        commit,
        goTo,
        rewind,
        fastForward,
        play,
        pause,
        isPlaying: isPlayingRef.current,
      };
  
      return (
        <TimeTravelContext.Provider value={contextValue}>
          {children}
        </TimeTravelContext.Provider>
      );
    }
  
    function useTimeTravelState(key, initialValue) {
      const context = useContext(TimeTravelContext);
      if (!context) {
        throw new Error(
          '`useTimeTravelState` must be used within a <TimeTravelProvider>'
        );
      }
  
      const [local, setLocal] = useState(initialValue);
  
      useEffect(() => {
        context.register(key, initialValue, setLocal);
      }, []);
  
      const setState = useCallback(
        (newVal) => {
          const value = typeof newVal === 'function' ? newVal(local) : newVal;
          setLocal(value);
          context.commit(key, value);
        },
        [context, local]
      );
  
      return [local, setState];
    }
  
    function useTimeTravelControls() {
      const context = useContext(TimeTravelContext);
      if (!context) {
        throw new Error(
          '`useTimeTravelControls` must be used within a <TimeTravelProvider>'
        );
      }
      return context;
    }
  
    return {
      TimeTravelProvider,
      useTimeTravelState,
      useTimeTravelControls,
    };
  }
  