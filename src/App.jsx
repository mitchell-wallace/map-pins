import { useState } from 'react'
import './App.css'
import MapComponent from './components/MapComponent'

function App() {
  return (
    <div className="app-container">
      <h1>Victoria, Australia Map</h1>
      <MapComponent />
    </div>
  )
}

export default App
