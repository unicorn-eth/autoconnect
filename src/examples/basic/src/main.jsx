import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/global.css";

// ============================================================================
// DEMO MODE SWITCHER
// ============================================================================
// Toggle between different demo versions:
//
// 1. UX Demo (UXDemoApp) - UX-friendly with RainbowKit
// 2. Technical Test Suite (TechnicalApp) - Comprehensive 9-test suite with RainbowKit
// 3. Pure Wagmi (WagmiOnlyApp) - Minimal integration, NO RainbowKit
// ============================================================================

import TechnicalApp from './App.jsx'
import UXDemoApp from './App-UX-Demo.jsx'
import WagmiOnlyApp from './App-Wagmi-Only.jsx'

function DemoSwitcher() {
  const [mode, setMode] = useState('ux')

  const demos = [
    {
      id: 'ux',
      name: 'UX Demo',
      description: 'User-friendly demo with RainbowKit',
      component: UXDemoApp
    },
    {
      id: 'technical',
      name: 'Technical Test Suite',
      description: 'Comprehensive 9-test suite with RainbowKit',
      component: TechnicalApp
    },
    {
      id: 'wagmi-only',
      name: 'Pure Wagmi',
      description: 'Minimal integration, NO RainbowKit',
      component: WagmiOnlyApp
    }
  ]

  const CurrentDemo = demos.find(d => d.id === mode)?.component || UXDemoApp

  return (
    <>
      <div style={styles.switcher}>
        <div style={styles.switcherContent}>
          <h3 style={styles.switcherTitle}>Choose Demo Mode:</h3>
          <div style={styles.buttonGroup}>
            {demos.map(demo => (
              <button
                key={demo.id}
                onClick={() => setMode(demo.id)}
                style={{
                  ...styles.switcherButton,
                  ...(mode === demo.id && styles.switcherButtonActive)
                }}
              >
                <strong>{demo.name}</strong>
                <span style={styles.switcherButtonDesc}>{demo.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <CurrentDemo />
    </>
  )
}

const styles = {
  switcher: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#1a1a1a',
    borderBottom: '2px solid #333',
    padding: '1rem',
  },
  switcherContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  switcherTitle: {
    color: '#fff',
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    fontWeight: '600',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  switcherButton: {
    flex: '1',
    minWidth: '200px',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '2px solid #444',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left',
  },
  switcherButtonActive: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
    transform: 'scale(1.02)',
  },
  switcherButtonDesc: {
    fontSize: '0.875rem',
    opacity: 0.8,
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoSwitcher />
  </StrictMode>,
)