import { useState, useEffect } from 'react'
import './App.css'
import MapComponent from './components/MapComponent'
import PinInput from './components/PinInput'

function App() {
  const [pins, setPins] = useState([]);

  // Add a new pin to the state
  const handleAddPin = (newPin) => {
    console.log("Adding new pin:", newPin);
    setPins(prevPins => [...prevPins, newPin]);
  };

  // Update a pin's position after geocoding
  const handlePinGeocoded = (index, position) => {
    console.log(`Geocoding completed for pin at index ${index}:`, position);
    setPins(prevPins => {
      const updatedPins = [...prevPins];
      if (index >= 0 && index < updatedPins.length) {
        updatedPins[index] = {
          ...updatedPins[index],
          position
        };
      } else {
        console.error(`Invalid pin index: ${index} (pins length: ${updatedPins.length})`);
      }
      // Log the updated pins array for debugging
      console.log("Updated pins array:", updatedPins);
      return updatedPins;
    });
  };

  // Remove a pin by index
  const handleRemovePin = (indexToRemove) => {
    console.log(`Removing pin at index ${indexToRemove}`);
    setPins(prevPins => prevPins.filter((_, index) => index !== indexToRemove));
  };

  // Debug effect to log pins state changes
  useEffect(() => {
    console.log("Pins state updated:", pins);
  }, [pins]);

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
                  <li key={`pin-list-${index}-${pin.name}`}>
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
