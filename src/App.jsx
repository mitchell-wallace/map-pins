import { useState } from 'react'
import './App.css'
import MapComponent from './components/MapComponent'
import PinInput from './components/PinInput'

function App() {
  const [pins, setPins] = useState([]);

  // Add a new pin to the state
  const handleAddPin = (newPin) => {
    setPins(prevPins => [...prevPins, newPin]);
  };

  // Update a pin's position after geocoding
  const handlePinGeocoded = (index, position) => {
    setPins(prevPins => {
      const updatedPins = [...prevPins];
      updatedPins[index] = {
        ...updatedPins[index],
        position
      };
      return updatedPins;
    });
  };

  return (
    <div className="app-container">
      <h1>Victoria, Australia Map</h1>
      <div className="content-container">
        <div className="sidebar">
          <PinInput onAddPin={handleAddPin} />
          <div className="pins-list">
            <h3>Added Pins</h3>
            {pins.length === 0 ? (
              <p>No pins added yet</p>
            ) : (
              <ul>
                {pins.map((pin, index) => (
                  <li key={index}>
                    {pin.name}
                    {pin.position && (
                      <span className="coordinates">
                        [{pin.position[0].toFixed(4)}, {pin.position[1].toFixed(4)}]
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <MapComponent 
          pins={pins} 
          onPinGeocoded={handlePinGeocoded} 
        />
      </div>
    </div>
  )
}

export default App
