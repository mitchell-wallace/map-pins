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

  // Remove a pin by index
  const handleRemovePin = (indexToRemove) => {
    setPins(prevPins => prevPins.filter((_, index) => index !== indexToRemove));
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
                    <div className="pin-item">
                      <div className="pin-info">
                        <span className="pin-name">{pin.name}</span>
                        {pin.position && (
                          <span className="coordinates">
                            [{pin.position[0].toFixed(4)}, {pin.position[1].toFixed(4)}]
                          </span>
                        )}
                      </div>
                      <button 
                        className="remove-pin-btn" 
                        onClick={() => handleRemovePin(index)}
                        aria-label="Remove pin"
                      >
                        ×
                      </button>
                    </div>
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
