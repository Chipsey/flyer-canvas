import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Container,
} from "@mui/material";

const FlyerDesign = ({ onGenerate }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/process-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.top_colors) {
        setColors(response.data.top_colors);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to draw on the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var modifiedColor;

    // Set background color if extracted colors exist
    if (colors.length > 1) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `rgba(${colors[0].rgb.join(",")},0.1)`);
      gradient.addColorStop(0.3, `rgba(${colors[1].rgb.join(",")},0.06)`);
      gradient.addColorStop(0.6, `rgba(${colors[1].rgb.join(",")},0.05)`);
      gradient.addColorStop(1, `rgba(${colors[0].rgb.join(",")},0.1)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      modifiedColor = colors[0].rgb.map((value) => Math.min(value + 30, 255)); // Ensure RGB values don't exceed 255
      ctx.fillStyle = `rgb(${modifiedColor.join(",")})`; // Apply modified color
    } else {
      // If not enough colors are available, use a solid background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const lineHeight = 9 * 16; // Define line height (space between lines)
    const margin = 20; // Define margin between title and description

    // Draw the white box (you can adjust the position and size as needed)
    ctx.fillRect(0, 0, 30, canvas.height); // Parameters: x, y, width, height

    // Draw the title
    ctx.font = "20rem Playlist";
    ctx.fillStyle = `${modifiedColor != null ? `rgb(${modifiedColor.join(",")})` : "#000000"}`; // White color

    const textWidth = ctx.measureText(title).width;
    const titleX = (canvas.width - textWidth) / 2;
    const titleY = 3300; // Title Y position
    ctx.fillText(title, titleX, titleY);

    ctx.font = "6rem helvetica";
    const subTextWidth = ctx.measureText(subtitle).width;
    const subTitleX = (canvas.width - subTextWidth) / 2;
    ctx.fillText(subtitle, subTitleX, titleY + 150);

    // Function to handle text wrapping
    const wrapText = (text, maxWidth) => {
      const words = text.split(" ");
      let lines = [];
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let testLine = currentLine + words[i] + " ";
        let testWidth = ctx.measureText(testLine).width;

        // If the line exceeds max width, push the current line and start a new one
        if (testWidth > maxWidth && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = words[i] + " ";
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }

      return lines;
    };

    // Draw the description with wrapping
    ctx.font = "5rem helvetica"; // Set font size for description
    const maxWidth = canvas.width - 100 * 16; // Max width for text (with some margin)
    const descriptionLines = wrapText(description, maxWidth);

    let desY = titleY + lineHeight + margin + 200; // Y position for description after title

    // Draw each line of the description
    descriptionLines.forEach((line) => {
      const desWidth = ctx.measureText(line).width;
      const desX = (canvas.width - desWidth) / 2; // Center the text horizontally
      ctx.fillText(line, desX, desY);
      desY += lineHeight; // Move to the next line
    });

    ctx.font = "6rem helvetica";

    ctx.fillText("Chipsey", 40, 5000 - 40);

    //circles
    if (colors.length > 1) {
      // Draw first circle
      // Circle 1: Red
      const x1 = 2500 - 15 - 100,
        y1 = desY,
        radius1 = 30;
      ctx.fillStyle = `rgba(${colors[0].rgb.join(",")},1)`; // Red color
      ctx.beginPath();
      ctx.arc(x1, y1, radius1, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();

      // Circle 2: Green
      const x2 = 2500 - 15,
        y2 = desY,
        radius2 = 30;
      ctx.fillStyle = `rgba(${colors[1].rgb.join(",")},1)`; // Green color
      ctx.beginPath();
      ctx.arc(x2, y2, radius2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();

      // Circle 3: Blue
      const x3 = 2500 - 15 + 100,
        y3 = desY,
        radius3 = 30;
      ctx.fillStyle = `rgba(${colors[2].rgb.join(",")},1)`; // Blue color
      ctx.beginPath();
      ctx.arc(x3, y3, radius3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    }
  };

  // Redraw canvas when title, description, or colors change
  useEffect(() => {
    drawCanvas();
  }, [title, subtitle, description, colors]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        {/* Left Side - Form */}
        <Box sx={{ flex: 1, paddingRight: 2 }}>
          <Typography variant="h4" gutterBottom>
            Chipsey Add+
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Subtitle"
              variant="outlined"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              multiline
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="body1">Upload Image:</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: 16 }}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? <CircularProgress size={24} /> : "Extract Colors"}
              </Button>
            </Box>
          </form>

          {isLoading && (
            <Typography sx={{ mt: 2 }}>
              Processing image, please wait...
            </Typography>
          )}

          {colors.length > 0 && !isLoading && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Extracted Colors:</Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {colors.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 50,
                      height: 50,
                      backgroundColor: `rgba(${color.rgb.join(",")})`,
                      borderRadius: "50%",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Right Side - Canvas */}
        <Box sx={{ flex: 1.5, paddingLeft: 2, overflow: "hidden" }}>
          <Typography variant="h6" gutterBottom>
            Real-Time Preview:
          </Typography>
          <canvas
            ref={canvasRef}
            width={5000}
            height={5000}
            style={{
              border: "1px solid #ccc",
              transform: "scale(0.1)", // Zoom out the canvas by 10%
              transformOrigin: "top left", // Ensure scaling from the top-left corner
              width: "400rem", // Adjust based on zoom
              height: "400rem", // Adjust based on zoom
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default FlyerDesign;
