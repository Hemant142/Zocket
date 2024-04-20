import React, { useState } from 'react';
import Canvas from './Canvas';
import ColorPicker from './ColorPicker';

const CanvasEditor = () => {
  const [backgroundColor, setBackgroundColor] = useState('#0369A1');
  const [image, setImage] = useState(null); // State to store the selected image
  const [imageSize, setImageSize] = useState(100); // Initial size of the background image
  const [textContent, setTextContent] = useState(''); // State to store the text content

  // Function to handle image selection
  const handleImageSelect = (event) => {
    const selectedImage = event.target.files[0];
    setImage(URL.createObjectURL(selectedImage));
  };

  const handleSizeChange = (event) => {
    setImageSize(parseInt(event.target.value));
  };

  const handleTextChange = (event) => {
    setTextContent(event.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-row justify-between w-full max-w-screen-lg">
        {/* Left side: Canvas */}
        <div className="flex flex-col items-center p-8 bg-gray rounded-lg shadow-lg mr-4">
          <h1 className="text-3xl font-bold mb-4">Canvas Editor</h1>
          <div className="rounded-lg overflow-hidden"> {/* Add wrapping div with border radius */}
            <Canvas
              backgroundColor={backgroundColor}
              backgroundImage={image}
              setBackgroundImage={setImage}
              imageSize={imageSize}
              textContent={textContent} // Pass text content to the canvas
            />
          </div>
        </div>
        
        {/* Right side: Color Picker, Image upload, and Text input */}
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg ml-4">
          <div>
            <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
            <input id="imageInput" type="file" accept="image/*" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer mb-4" onChange={handleImageSelect} />
          </div>
          <div className="mb-4">
            <ColorPicker backgroundImage={image} backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} imageSize={imageSize} setImageSize={setImageSize} />
          </div>
          {/* <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Add Content</h2>
            <input type="text" value={textContent} onChange={handleTextChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
