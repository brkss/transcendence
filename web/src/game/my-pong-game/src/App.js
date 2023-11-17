import React, { useRef } from 'react';
import PongSketch from './PongSketch';

function App() {
  const pongDivRef = useRef(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Pong Game</h1>
        <PongSketch canvasParentRef={pongDivRef} />
    </div>
  );
}

export default App;
