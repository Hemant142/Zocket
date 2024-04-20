import React, { useState, useRef } from "react";
import { ChromePicker } from "react-color";

const ColorPicker = ({ backgroundColor, setBackgroundColor, imageSize, setImageSize, backgroundImage }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const chromePickerRef = useRef(null);

  const addColor = (color) => {
    // Check if the color already exists in selectedColors
    if (!selectedColors.includes(color)) {
      // Limiting to 5 recent colors
      const updatedColors = [color, ...selectedColors];
      setSelectedColors(updatedColors);
      setBackgroundColor(color);
    }
  };

  const removeColor = (color) => {
    const newColors = selectedColors.filter((c) => c !== color);
    setSelectedColors(newColors);
  };

  const handleColorClick = (color) => {
    setBackgroundColor(color);
  };

  const handleSizeChange = (event) => {
    setImageSize(parseInt(event.target.value));
  };

  // Calculate percentage value of background image size and round to remove decimals
  const imageSizePercentage = Math.round(((imageSize - 50) / 150) * 100);

  return (
    <div className="mt-4">
      {backgroundImage && ( // Only render if there is a background image
        <div className="mt-4">
          <label htmlFor="imageSizeInput" className="block text-sm font-medium text-gray-700">
            Image Size
          </label>
          <div className="flex items-center">
           
            <input
              type="range"
              id="imageSizeInput"
              className="flex-grow h-2 appearance-none rounded-md bg-gray-300"
              min="50"
              max="200"
              value={imageSize}
              onChange={handleSizeChange}
            />
            <span className="text-sm text-gray-600 ml-2">{`${imageSizePercentage}%`}</span> {/* Display percentage */}
          </div>
        </div>
      )}
      <h2 className="text-lg font-bold mb-2">Background Color</h2>
      <div className="color-picker-wrapper relative">
        <button
          className="color-picker-button absolute top-0 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white text-xl font-bold shadow-md"
          style={{ right: "-50px" }}
          onClick={() => addColor(backgroundColor)}
        >
          +
        </button>
        <ChromePicker
          ref={chromePickerRef}
          color={backgroundColor}
          onChange={(color) => setBackgroundColor(color.hex)}
          disableAlpha={true}
          className="rounded-lg shadow-md"
          width={300}
        />
        <div className="mt-2 grid grid-cols-2 gap-4 overflow-auto border rounded-md border-gray-300 shadow-md max-h-200px">
          {selectedColors.map((color, index) => (
            <div key={index} className="flex items-center mb-2">
              <div
                className="w-12 h-12 rounded-full mr-2 cursor-pointer border-2 border-white"
                onClick={() => handleColorClick(color)}
                style={{ backgroundColor: color, backgroundImage: `url(${color})`, backgroundSize: `${imageSize}%`, backgroundPosition: 'center' }}
              ></div>
              <span className="text-gray-700">{color}</span>
              <button
                onClick={() => removeColor(color)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
              >
                -
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
