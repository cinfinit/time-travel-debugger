
import React, { useState, useEffect } from 'react';
import { useTimeTravelControls } from '../core';
import DiffViewer from './DiffViewer';

const styles = {
  container: {
    border: '1px solid #2C3E50',
    marginTop: 20,
    backgroundColor: '#1B1F23',
    color: '#ECF0F1',
    fontFamily: 'monospace',
    borderRadius: 6,
    overflow: 'hidden',
  },
  controls: {
    padding: '10px 16px',
    background: '#2C3E50',
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  button: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#ECF0F1',
    color: '#2C3E50',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  layout: {
    display: 'flex',
    height: 300,
  },
  timeline: {
    width: '40%',
    backgroundColor: '#1B1F23',
    borderRight: '1px solid #2C3E50',
    overflowY: 'auto',
  },
  timelineItem: (selected) => ({
    padding: '10px 14px',
    background: selected ? '#2C3E50' : 'transparent',
    color: selected ? '#ECF0F1' : '#9AAAB8',
    cursor: 'pointer',
    borderBottom: '1px solid #2C3E50',
    fontSize: 14,
  }),
  detailPanel: {
    width: '60%',
    padding: 16,
    overflowY: 'auto',
    backgroundColor: '#1B1F23',
  },
  heading: {
    marginTop: 0,
    fontSize: 16,
    borderBottom: '1px solid #2C3E50',
    paddingBottom: 6,
    marginBottom: 10,
  },
  pre: {
    backgroundColor: '#2C3E50',
    color: '#ECF0F1',
    padding: 10,
    borderRadius: 4,
    fontSize: 13,
    overflowX: 'auto',
  },
};

export default function TimeTravelDebugger() {
  const {
    history,
    pointer,
    rewind,
    fastForward,
    play,
    pause,
    goTo,
    isPlaying,
  } = useTimeTravelControls();

  const [selectedIndex, setSelectedIndex] = useState(pointer);

  useEffect(() => {
    setSelectedIndex(pointer);
  }, [pointer]);

  const currentSnapshot = history[selectedIndex];
  const prevSnapshot = history[selectedIndex - 1];

  const handleJump = (index) => {
    setSelectedIndex(index);
    goTo(index);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (selectedIndex === history.length - 1) {
        setSelectedIndex(0);
        goTo(0);
      }
      play();
    }
  };

  const handleNextSnapshot = () => {
    if (selectedIndex === history.length - 1) {
      pause();
      setSelectedIndex(0);
      goTo(0);
    } else {
      setSelectedIndex(selectedIndex + 1);
      goTo(selectedIndex + 1);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(() => {
        handleNextSnapshot();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, selectedIndex]);

  return (
    <div style={styles.container}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#1B1F23',
          borderBottom: '1px solid #2C3E50',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            color: '#ECF0F1',
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          🧭 Time Travel Debugger
        </h3>
        &emsp;
        <span
          style={{
            marginTop: '3px',
            fontSize: 12,
            fontStyle: 'italic',
            color: '#9AAAB8',
          }}
        >
          @cinfinit
        </span>
      </div>
   
      {/* Controls */}
      <div style={styles.controls}>
     

        <button style={styles.button} onClick={rewind} title="Rewind">
          ⏮ Rewind
        </button>
        <button
          style={styles.button}
          onClick={fastForward}
          title="Fast Forward"
        >
          ⏭ Forward
        </button>
        <button
          style={styles.button}
          onClick={handlePlayPause}
          title="Play/Pause"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      {/* Layout */}
      <div style={styles.layout}>
        {/* Timeline */}
        <div style={styles.timeline}>
          {history.map((snap, i) => (
            <div
              key={i}
              onClick={() => handleJump(i)}
              style={styles.timelineItem(i === pointer)}
            >
              <div style={{ fontSize: 12 }}>
                <span style={{ color: '#9AAAB8' }}>
                  [{new Date(snap.timestamp).toLocaleTimeString()}]
                </span>{' '}
                Snapshot #{i}
              </div>
            </div>
          ))}
        </div>

        {/* State + Diff Panel */}
        <div style={styles.detailPanel}>
          <h4 style={styles.heading}>Current State</h4>
          <pre style={styles.pre}>
            {JSON.stringify(currentSnapshot?.state, null, 2)}
          </pre>

          {prevSnapshot && (
            <>
              <h4 style={styles.heading}>Diff from Previous</h4>
              <DiffViewer a={prevSnapshot.state} b={currentSnapshot.state} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
