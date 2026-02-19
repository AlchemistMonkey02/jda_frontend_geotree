/**
 * Resizes an image file to a maximum dimension (width or height), maintaining aspect ratio.
 * This mimics WhatsApp-like behavior by reducing pixel density and file size.
 * @param {File} file - The image file to resize.
 * @param {number} maxDimension - The maximum dimension allowed (default: 1000px for WhatsApp-like speed).
 * @param {number} quality - The compression quality (0 to 1, default: 0.7).
 * @returns {Promise<File>} - A promise that resolves to the resized File object.
 */
export const resizeImage = (file, maxDimension = 1000, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.match(/image.*/)) {
            reject(new Error("File is not an image"));
            return;
        }

        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const image = new Image();
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                // WhatsApp-like logic: Ensure longest side is within maxDimension
                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // Use better image smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("Canvas to Blob conversion failed"));
                        return;
                    }
                    // Create a new File object with the resized blob
                    const resizedFile = new File([blob], file.name, {
                        type: 'image/jpeg', // Force jpeg for better compression
                        lastModified: Date.now(),
                    });
                    resolve(resizedFile);
                }, 'image/jpeg', quality);
            };
            image.onerror = () => reject(new Error("Failed to load image"));
            image.src = readerEvent.target.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
};

