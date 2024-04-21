import React, { useState, useRef } from "react";
import PickColor from "react-pick-color";

const ColorPicker = ({ backgroundColor, setBackgroundColor, imageSize, setImageSize, backgroundImage }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [sketchColors, setSketchColors] = useState([]);
  const [documentColors, setDocumentColors] = useState([]);
  const [presetColors, setPresetColors] = useState(["#ff0000", "#00ff00", "#0369A1"]); // Initial personal color is black
  const colorPickerRef = useRef(null);

  const addColor = (color) => {
    // Check if the color already exists in selectedColors
    if (!selectedColors.includes(color)) {
      // Limiting to 5 recent colors
      const updatedColors = [color, ...selectedColors.slice(0, 4)]; // Only keep 5 recent colors
      setSelectedColors(updatedColors);
      setBackgroundColor(color);
    }
  };

  const removeColor = (color) => {
    const newColors = selectedColors.filter((c) => c !== color);
    setSelectedColors(newColors);
  };

  const handleColorChange = (color) => {
    setBackgroundColor(color);
  };

  const handleSizeChange = (event) => {
    setImageSize(parseInt(event.target.value));
  };

  const handleSketchColor = (color) => {
    // Add sketched color to the sketchColors array
    setSketchColors([...sketchColors, color]);
  };

  const addDocumentColor = (color) => {
    // Add color to the document colors array
    setDocumentColors([...documentColors, color]);
  };

  const handlePersonalColorChange = (color) => {
    // Set personal color    
    // setPersonalColor(color);
  };

  const handleAddColor = () => {
    // Add color selected in the picker
    setPresetColors([...presetColors, backgroundColor]); // Push the new color to presetColors array
  };

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
            <span className="text-sm text-gray-600 ml-2">{`${imageSize}%`}</span> {/* Display percentage */}
          </div>
        </div>
      )}
      <h2 className="text-lg font-bold mb-2">Background Color</h2>
      <div className="color-picker-wrapper relative">
        <PickColor
          color={backgroundColor}
          onChange={(color) => handleColorChange(color.hex)}
          className="rounded-lg shadow-md"
          width={300}
          colorList={selectedColors} // Set the color list
          onDelete={(color) => removeColor(color)} // Handle color deletion
          presetColors={presetColors} // Set preset colors
          onSketchColor={(color) => handleSketchColor(color)} // Handle sketch color
          documentColors={documentColors} // Set document colors
          onDocumentColor={(color) => addDocumentColor(color)} // Handle document color
          personalColor={presetColors} // Set personal color
          onPersonalColorChange={(color) => handlePersonalColorChange(color)} // Handle personal color change
        />
        <div className="flex items-center mt-2">
          {presetColors.map((color, index) => (
            <button
              key={index}
              className="w-8 h-8 mr-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            ></button>
          ))}
          <button
            className="w-8 h-8 rounded-full bg-gray-300 border border-gray-200 text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={handleAddColor} // Call handleAddColor function on click
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
