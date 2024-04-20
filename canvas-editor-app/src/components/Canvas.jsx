import React, { useRef, useEffect, useState } from "react";

const Canvas = ({ backgroundColor, backgroundImage, setBackgroundImage, imageSize, textContent }) => {
  const canvasRef = useRef(null);
  const textRef = useRef(null); // Ref for the text div
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [textPosition, setTextPosition] = useState({ x: 10, y: 0 });
  const [textContainerHeight, setTextContainerHeight] = useState(0); // State for text container height
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw diagonal stripe pattern
    ctx.fillStyle = "white"; // Set the background color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with white color

    // Calculate the line width based on canvas dimensions
    const lineWidth = Math.sqrt(canvas.width ** 2.5 + canvas.height ** 2) / 10;

    // Increase the gap between lines
    const gapWidth = lineWidth * 3;

    // Draw diagonal stripes
    ctx.strokeStyle = backgroundColor; // Set the stripe color
    ctx.lineWidth = lineWidth; // Set the stripe width

    for (let i = -canvas.width; i < canvas.width; i += gapWidth) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + canvas.width, canvas.height);
      ctx.stroke();
    }

    // Draw background image
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        // Calculate image dimensions
        let imgWidth = canvas.width / 2 * (imageSize / 100); // Adjust image width based on imageSize
        let imgHeight = canvas.height / 2 * (imageSize / 100); // Adjust image height based on imageSize

        // Draw image at the specified position
        ctx.drawImage(img, imagePosition.x, imagePosition.y, imgWidth, imgHeight);
      };
      img.src = backgroundImage;
    }

    // Draw text content
    if (textContent) {
      ctx.fillStyle = "black"; // Set text color
      ctx.font = "20px Arial"; // Set font size and family

      // Calculate text width and height
      const textWidth = canvas.width / 2; // Half of the canvas width
      const textHeight = canvas.height;

      // Split text content into lines
      const lines = wrapText(ctx, textContent, textWidth, textHeight);

      // Calculate text position
      const yPos = canvas.height - textHeight; // Align text to the bottom
      setTextPosition({ x: 10, y: yPos });

      // Draw text in paragraph format
      let lineHeight = 25; // Set line height
      lines.forEach((line, index) => {
        ctx.fillText(line, textPosition.x, textPosition.y + (index * lineHeight)); // Draw each line of text
      });

      // Calculate total text height
      const totalTextHeight = lines.length * lineHeight;
      // Update text container height
      setTextContainerHeight(totalTextHeight);
    }
  }, [backgroundColor, backgroundImage, imageSize, imagePosition, textContent, textPosition]);

  const wrapText = (context, text, maxWidth, maxHeight) => {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      let word = words[i];
      let width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    return lines;
  };

  const handleImageDragStart = (event) => {
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    setIsDraggingImage(true);
    setDragStart({ x: offsetX, y: offsetY });
  };

  const handleTextDragStart = (event) => {
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    setIsDraggingText(true);
    setDragStart({ x: offsetX, y: offsetY });
  };

  const handleDragEnd = () => {
    setIsDraggingImage(false);
    setIsDraggingText(false);
  };

  const handleDrag = (event) => {
    if (isDraggingImage) {
      const offsetX = event.nativeEvent.offsetX;
      const offsetY = event.nativeEvent.offsetY;
      const dx = offsetX - dragStart.x;
      const dy = offsetY - dragStart.y;
      setImagePosition((prevPosition) => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy,
      }));
      setDragStart({ x: offsetX, y: offsetY });
    }

    if (isDraggingText) {
      const offsetX = event.nativeEvent.offsetX;
      const offsetY = event.nativeEvent.offsetY;
      const dx = offsetX - dragStart.x;
      const dy = offsetY - dragStart.y;
      // Update text position
      const newTextPosition = {
        x: textPosition.x + dx,
        y: textPosition.y + dy,
      };
      setTextPosition(newTextPosition);
      // Update drag start position
      setDragStart({ x: offsetX, y: offsetY });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedImage = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setBackgroundImage(e.target.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        className="mt-8 border border-gray-400 shadow-lg rounded-lg"
        height={400}
        width={400}
        onDrop={handleDrop}
        onMouseDown={handleImageDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      />
      {/* Text div */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          top: textPosition.y,
          left: textPosition.x,
          width: '50%', // Set width to half of the canvas width
          height: textContainerHeight, // Set height dynamically
          border: '1px dashed #000', // Add dashed border for visualization
          pointerEvents: isDraggingText ? 'none' : 'auto', // Disable pointer events when dragging
          cursor: 'move', // Set cursor to move when not dragging
        }}
        onMouseDown={handleTextDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {textContent}
      </div>
    </div>
  );
};

export default Canvas;
