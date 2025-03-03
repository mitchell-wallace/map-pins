import { useState } from 'react';

function PinInput({ onAddPin }) {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('suburb'); // 'suburb' or 'coordinates'
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError('');
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    setInput('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      setError('Please enter a value');
      return;
    }

    if (inputType === 'coordinates') {
      // Parse coordinates in format "latitude, longitude"
      const coordsPattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      
      if (!coordsPattern.test(input)) {
        setError('Please enter valid coordinates in format "latitude, longitude"');
        return;
      }

      const [lat, lng] = input.split(',').map(coord => parseFloat(coord.trim()));
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setError('Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180');
        return;
      }

      onAddPin({
        position: [lat, lng],
        name: `Pin at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`
      });
    } else {
      // For suburb names
      onAddPin({
        name: input,
        type: 'suburb'
      });
    }

    setInput('');
  };

  return (
    <div className="pin-input-container">
      <h3>Add a New Pin</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-type-selector">
          <label>
            <input
              type="radio"
              value="suburb"
              checked={inputType === 'suburb'}
              onChange={handleTypeChange}
            />
            Suburb Name
          </label>
          <label>
            <input
              type="radio"
              value="coordinates"
              checked={inputType === 'coordinates'}
              onChange={handleTypeChange}
            />
            Coordinates
          </label>
        </div>
        
        <div className="input-field">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={inputType === 'suburb' 
              ? 'Enter suburb name (e.g., Melbourne)' 
              : 'Enter coordinates (e.g., -37.8136, 144.9631)'}
            className={error ? 'error' : ''}
          />
          <button type="submit">Add Pin</button>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        {inputType === 'suburb' && (
          <p className="help-text">
            Enter a suburb name in Victoria, Australia
          </p>
        )}
        
        {inputType === 'coordinates' && (
          <p className="help-text">
            Enter coordinates in the format "latitude, longitude"
          </p>
        )}
      </form>
    </div>
  );
}

export default PinInput;
