
import React from 'react';

function getDiff(a, b) {
  const result = {};
  for (const key in b) {
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
      result[key] = { from: a[key], to: b[key] };
    }
  }
  return result;
}

const styles = {
  container: {
    background: '#2C3E50',
    padding: '12px 16px',
    borderRadius: 4,
    color: '#ECF0F1',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
    margin: 0,
  },
  item: {
    marginBottom: 8,
  },
  key: {
    color: '#9AAAB8',
    fontWeight: 'bold',
  },
  from: {
    color: '#e74c3c',
    textDecoration: 'line-through',
    marginRight: 6,
  },
  to: {
    color: '#2ecc71',
  },
  noDiff: {
    color: '#9AAAB8',
    fontStyle: 'italic',
  },
};

export default function DiffViewer({ a, b }) {
  const diffs = getDiff(a, b);

  return (
    <div style={styles.container}>
      {Object.keys(diffs).length === 0 ? (
        <p style={styles.noDiff}>No differences</p>
      ) : (
        <ul style={styles.list}>
          {Object.entries(diffs).map(([key, { from, to }]) => (
            <li key={key} style={styles.item}>
              <span style={styles.key}>{key}</span>:&nbsp;
              <span style={styles.from}>{JSON.stringify(from)}</span>
              →
              <span style={styles.to}> {JSON.stringify(to)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
