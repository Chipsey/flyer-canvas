import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Container,
  Grid2,
} from "@mui/material";
import colorPalettes from "../../assets/const";
import jsPDF from "jspdf";

const FlyerDesign = () => {
  const [title, setTitle] = useState("Back Cover");
  const [subtitle, setSubtitle] = useState("iPhone 11");
  const [description, setDescription] = useState(
    "Luxury Original Phone Cases Compatible with Apple Iphone 11, And Also Suitable for Apple 15 Plus with Drop Protection."
  );
  const [price, setPrice] = useState(700);
  const [sContent1, setSContent1] = useState("Limited Stock!");
  const [sContent2, setSContent2] = useState("Available only at UOM area!");
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const colorPallets = colorPalettes;
  const [selectedColorPaletteIndex, setSelectedColorPaletteIndex] = useState();

  const downloadCanvasAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL("image/png"); // Convert to PNG

    const link = document.createElement("a");
    link.href = image;
    link.download = "flyer.png"; // Filename
    link.click();
  };

  const downloadCanvasAsPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pdf = new jsPDF("portrait", "px", [canvas.width, canvas.height]); // Set same size as canvas
    const image = canvas.toDataURL("image/png"); // Convert to PNG

    pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height); // Add image to PDF
    pdf.save("flyer.pdf"); // Save as PDF
  };

  useEffect(() => {
    setSelectedColorPaletteIndex(4);
    setColors(colorPallets[4]);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleImageColorChange = async (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }
  };
  const handlePaletteClick = (palette, index) => {
    setColors(palette);
    setSelectedColorPaletteIndex(index);
    console.log("Selected Palette:", palette);
  };

  // Function to draw on the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (colors.length < 1) {
      return;
    }

    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background color if extracted colors exist
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `rgba(${colors[0].rgb.join(",")},0)`);
    gradient.addColorStop(
      1 - (canvas.height - canvas.width) / canvas.height,
      `rgba(${colors[1].rgb.join(",")},0)`
    );
    gradient.addColorStop(
      1 - (canvas.height - canvas.width) / canvas.height,
      `rgba(${colors[1].rgb.join(",")},0.9)`
    );
    gradient.addColorStop(1, `rgba(${colors[0].rgb.join(",")},0.9)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(${colors[0].rgb.join(",")},1)`;

    // Constants for layout
    const lineHeight = 9 * 16; // Line height
    const margin = 20; // Margin between title and description
    const titleY = canvas.width + 350; // Title Y position

    // Draw the white box
    ctx.fillStyle = `rgba(${colors[2].rgb.join(",")},0.7)`;
    ctx.fillRect((2 * canvas.width) / 3, 0, canvas.width / 3, 40);

    ctx.fillStyle = `rgba(${colors[1].rgb.join(",")},0.7)`;
    ctx.fillRect(canvas.width / 3, 0, canvas.width / 3, 40);

    ctx.fillStyle = `rgba(${colors[0].rgb.join(",")},0.7)`;
    ctx.fillRect(0, 0, canvas.width / 3, 40);

    ctx.fillStyle = `rgba(${colors[2].rgb.join(",")},1)`;
    // Draw the title
    ctx.font = "bold 12rem helvetica";
    const textWidth = ctx.measureText(title).width;
    const titleX = (canvas.width - textWidth) / 2;
    ctx.fillText(title, titleX, titleY);

    // Draw subtitle
    ctx.font = "5rem helvetica";
    const subTextWidth = ctx.measureText(subtitle).width;
    const subTitleX = (canvas.width - subTextWidth) / 2;
    ctx.fillText(subtitle, subTitleX, titleY + 120);

    // Function to wrap text if it exceeds max width
    const wrapText = (text, maxWidth) => {
      const words = text.split(" ");
      let lines = [];
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let testLine = currentLine + words[i] + " ";
        let testWidth = ctx.measureText(testLine).width;

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

    // Draw description with wrapping
    ctx.font = "5rem helvetica"; // Set font size for description
    const maxWidth = canvas.width - 100 * 16; // Max width with margin
    const descriptionLines = wrapText(description, maxWidth);

    let desY = titleY + lineHeight + margin + 130; // Y position for description

    // Draw each line of the description
    descriptionLines.forEach((line) => {
      const desWidth = ctx.measureText(line).width;
      const desX = (canvas.width - desWidth) / 2;
      ctx.fillText(line, desX, desY);
      desY += lineHeight; // Move to next line
    });

    // Footer text
    ctx.font = "4rem helvetica";
    const xillicaWidth = ctx.measureText("Xillica").width;
    const xillicaX = (canvas.width - xillicaWidth) / 2;
    ctx.fillText("Xillica", xillicaX, 6000 - 40);

    // Draw circles if colors are available
    // Circle 1: First color
    const x1 = canvas.width / 2 - 10 - 80,
      y1 = desY,
      radius1 = 20;
    ctx.fillStyle = `rgba(${colors[0].rgb.join(",")},1)`; // First color
    ctx.beginPath();
    ctx.arc(x1, y1, radius1, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // Circle 2: Second color
    const x2 = canvas.width / 2 - 10,
      y2 = desY,
      radius2 = 20;
    ctx.fillStyle = `rgba(${colors[1].rgb.join(",")},1)`; // Second color
    ctx.beginPath();
    ctx.arc(x2, y2, radius2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // Circle 3: Third color
    const x3 = canvas.width / 2 - 10 + 80,
      y3 = desY,
      radius3 = 20;
    ctx.fillStyle = `rgba(${colors[2].rgb.join(",")},1)`;
    ctx.beginPath();
    ctx.arc(x3, y3, radius3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // Load and draw the image onto the canvas if it exists
    if (image) {
      const img = new Image();
      img.src = URL.createObjectURL(image); // Use the current uploaded image
      img.onload = () => {
        const imgX = 0; // Center the image horizontally
        const imgY = 40; // Position image below description
        ctx.drawImage(img, imgX, imgY, canvas.width, canvas.width);
      };
    }
    const content1Y = desY + 400;

    ctx.fillStyle = `rgba(${colors[2].rgb.join(",")},0.2)`;
    ctx.fillRect(canvas.width / 3, content1Y - 280, 10, 500);
    ctx.fillRect((2 * canvas.width) / 3, content1Y - 280, 10, 500);

    ctx.fillStyle = `rgba(${colors[2].rgb.join(",")},1)`;

    ctx.font = "5rem helvetica";
    const content1 = ctx.measureText(sContent1).width;
    const content1X = (canvas.width - content1) / 8;
    ctx.fillText(sContent1, content1X, content1Y);

    ctx.font = "5rem helvetica";
    const content21 = ctx.measureText("Best Price! Only,").width;
    const content21X = (canvas.width - content21) / 2;
    ctx.fillText("Best Price! Only,", content21X, content1Y - 80);

    ctx.font = "bold 7rem helvetica";
    const content2 = ctx.measureText(`Rs.${price}.00`).width;
    const content2X = (canvas.width - content2) / 2;
    ctx.fillText(`Rs.${price}.00`, content2X, content1Y + 80);

    ctx.font = "5rem helvetica";
    const content3X = (2 * canvas.width) / 3 + canvas.width / 20;
    ctx.fillText(sContent2, content3X, content1Y);

    const content4Y = content1Y + 400;

    ctx.font = "bold 4.7rem helvetica";
    const content4 = ctx.measureText("Whatsapp: 071 620 5445").width;
    const content4X = (canvas.width - content4) / 2;
    ctx.fillText("Whatsapp: 071 620 5445", content4X, content4Y);
  };

  // Redraw canvas when title, description, or colors change
  useEffect(() => {
    drawCanvas();
  }, [title, subtitle, description, colors, price, sContent1, sContent2]);

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
              InputProps={{
                style: { fontSize: "0.7rem" },
              }}
              InputLabelProps={{
                style: { fontSize: "0.7rem" },
              }}
            />

            <TextField
              fullWidth
              label="Subtitle"
              variant="outlined"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                style: { fontSize: "0.7rem" },
              }}
              InputLabelProps={{
                style: { fontSize: "0.7rem" },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              multiline
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                style: { fontSize: "0.7rem" },
              }}
              InputLabelProps={{
                style: { fontSize: "0.7rem" },
              }}
            />
            <Grid2 container gap={2}>
              <TextField
                label="Price"
                variant="outlined"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
              <TextField
                label="Special Message 1"
                variant="outlined"
                value={sContent1}
                multiline
                onChange={(e) => setSContent1(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
              <TextField
                label="Special Message 2"
                variant="outlined"
                value={sContent2}
                multiline
                onChange={(e) => setSContent2(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
            </Grid2>

            <Box
              sx={{
                background: "rgba(0,0,0,0.1)",
                padding: "1rem",
                borderRadius: "1rem",
              }}
            >
              <Typography variant="body1">Upload Image:</Typography>
              <input
                type="file"
                accept="image/*"
                onInput={handleImageChange}
                style={{ marginBottom: 8 }}
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={isLoading}
                  onClick={handleImageColorChange}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Generate"}
                </Button>
              </Box>
            </Box>
          </form>

          {isLoading && (
            <Typography sx={{ mt: 2 }}>
              Processing image, please wait...
            </Typography>
          )}

          {colors.length > 0 && !isLoading && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Blending Colors:</Typography>
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
          {colorPalettes.length > 0 && !isLoading && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Color Palettes:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {colorPalettes.map((palette, index) => (
                  <Box
                    key={index}
                    onClick={() => handlePaletteClick(palette, index)}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      backgroundColor:
                        selectedColorPaletteIndex == index
                          ? "rgba(70, 70, 70, 1)"
                          : "rgba(176, 176, 176, 0.1)",
                      padding: 1,
                      borderRadius: 5,
                    }}
                  >
                    {palette.map((color, colorIndex) => (
                      <Box
                        key={colorIndex}
                        sx={{
                          width: 10,
                          height: 10,
                          backgroundColor: `rgb(${color.rgb.join(",")})`,
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Right Side - Canvas */}
        <Box sx={{ flex: 1, paddingLeft: 2, overflow: "hidden" }}>
          <Box sx={{ mt: 2, mb: 2, display: "flex", gap: 2 }}>
            <Typography variant="h8" gutterBottom>
              Real-Time Preview:
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "0.6rem", padding: "0px 8px" }}
              onClick={downloadCanvasAsImage}
            >
              Download as Image
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ fontSize: "0.6rem", padding: "0px 8px" }}
              onClick={downloadCanvasAsPDF}
            >
              Download as PDF
            </Button>
          </Box>
          <canvas
            ref={canvasRef}
            width={4000}
            height={6000}
            style={{
              border: "1px solid #ccc",
              transform: "scale(0.1)", // Zoom out the canvas by 10%
              transformOrigin: "top left", // Ensure scaling from the top-left corner
              width: "333.33rem", // Adjust based on zoom
              height: "500rem", // Adjust based on zoom
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default FlyerDesign;
