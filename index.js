import express from 'express';
import { createCanvas } from 'canvas';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
	try {
		// Image dimensions
		const width = parseInt(req.query.width) || 800;
		const height = parseInt(req.query.height) || 600;

		if (width > 2000 || height > 2000) {
			return res
				.status(400)
				.send({ error: 'Width and height must be 2000 or less.' });
		}

		// Create a canvas
		const canvas = createCanvas(width, height);
		const context = canvas.getContext('2d');

		// Background color
		context.fillStyle = getRandomColor();
		context.fillRect(0, 0, width, height);

		// Add text
		const text = `${width} x ${height}`;

		context.fillStyle = '#000';
		context.font = 'bold 36px Sans';
	
		// Measure text width for centering
		const textWidth = context.measureText(text).width;
		const textX = (width - textWidth) / 2;
		const textY = height / 2;
	
		// Draw text
		context.fillText(text, textX, textY);

		// Convert canvas to a Buffer
		const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });

		// Set headers for image response
		res.setHeader('Content-Type', 'image/jpeg');
		res.send(buffer); // Send the image directly
	} catch (error) {
		console.error('Error creating image:', error);
		res.status(500).send({ error: 'Error creating image' });
	}
});

function getRandomColor() {
	const r = Math.floor(Math.random() * 256); // Red (0-255)
	const g = Math.floor(Math.random() * 256); // Green (0-255)
	const b = Math.floor(Math.random() * 256); // Blue (0-255)
	return `rgb(${r}, ${g}, ${b})`;
}

dotenv.config();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
