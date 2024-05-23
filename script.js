let originalImageData = null;
let originalImage = null;
let pixelSize = 5;
const maxCanvasWidth = 800;
const maxCanvasHeight = 600;

document.getElementById('upload').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
	const file = event.target.files[0];
	const reader = new FileReader();
	reader.onload = function(e) {
		originalImage = new Image();
		originalImage.onload = function() {
			const canvas = document.getElementById('canvas');
			const ctx = canvas.getContext('2d');
			const scale = Math.min(maxCanvasWidth / originalImage.width, maxCanvasHeight / originalImage.height);
			canvas.width = originalImage.width * scale;
			canvas.height = originalImage.height * scale;
			ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
			originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			canvas.style.display = 'block';
			document.getElementById('controls').style.display = 'flex';
			document.getElementById('download-section').style.display = 'block';
			document.querySelector('.download-heading').style.display = 'block';
			showDonationsText();
			showKofiButton();
			pixelateImage();
		}
		originalImage.src = e.target.result;
	}
	reader.readAsDataURL(file);
}

function pixelateImage() {
	if (!originalImageData) return;

	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;

	ctx.putImageData(originalImageData, 0, 0);
	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;

	for (let y = 0; y < height; y += pixelSize) {
		for (let x = 0; x < width; x += pixelSize) {
			const red = data[((width * y) + x) * 4];
			const green = data[((width * y) + x) * 4 + 1];
			const blue = data[((width * y) + x) * 4 + 2];
			const alpha = data[((width * y) + x) * 4 + 3];

			for (let n = 0; n < pixelSize; n++) {
				for (let m = 0; m < pixelSize; m++) {
					if (x + m < width && y + n < height) {
						data[((width * (y + n)) + (x + m)) * 4] = red;
						data[((width * (y + n)) + (x + m)) * 4 + 1] = green;
						data[((width * (y + n)) + (x + m)) * 4 + 2] = blue;
						data[((width * (y + n)) + (x + m)) * 4 + 3] = alpha;
					}
				}
			}
		}
	}

	ctx.putImageData(imgData, 0, 0);
}

function changePixelSize(change) {
	const pixelSizeDisplay = document.getElementById('pixelSizeDisplay');
	pixelSize = Math.min(Math.max(pixelSize + change, 1), 20);
	pixelSizeDisplay.textContent = pixelSize;
	if (document.getElementById('upload').files.length > 0) {
		pixelateImage();
	}
}

function downloadImage(size) {
	let downloadWidth, downloadHeight;
	if (size === 'original') {
		downloadWidth = originalImage.width;
		downloadHeight = originalImage.height;
	} else {
		[downloadWidth, downloadHeight] = size.split('x').map(Number);
	}
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = downloadWidth;
	canvas.height = downloadHeight;
	ctx.drawImage(originalImage, 0, 0, downloadWidth, downloadHeight);
	pixelateCanvas(ctx, downloadWidth, downloadHeight);

	const link = document.createElement('a');
	link.href = canvas.toDataURL('image/png');
	link.download = 'pixelated-image.png';
	link.click();

	showDonationsText();
	showKofiButton();
}

function pixelateCanvas(ctx, width, height) {
	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;

	for (let y = 0; y < height; y += pixelSize) {
		for (let x = 0; x < width; x += pixelSize) {
			const red = data[((width * y) + x) * 4];
			const green = data[((width * y) + x) * 4 + 1];
			const blue = data[((width * y) + x) * 4 + 2];
			const alpha = data[((width * y) + x) * 4 + 3];

			for (let n = 0; n < pixelSize; n++) {
				for (let m = 0; m < pixelSize; m++) {
					if (x + m < width && y + n < height) {
						data[((width * (y + n)) + (x + m)) * 4] = red;
						data[((width * (y + n)) + (x + m)) * 4 + 1] = green;
						data[((width * (y + n)) + (x + m)) * 4 + 2] = blue;
						data[((width * (y + n)) + (x + m)) * 4 + 3] = alpha;
					}
				}
			}
		}
	}

	ctx.putImageData(imgData, 0, 0);
}


function showDonationsText() {
	const donationsText = document.querySelector('.donations-text');
	if (donationsText) {
		donationsText.style.display = 'block';
	}
}


function showKofiButton() {
	const kofiButtonContainer = document.getElementById('kofi-button-container');
	if (kofiButtonContainer) {
		kofiButtonContainer.style.display = 'block';
	}
}
