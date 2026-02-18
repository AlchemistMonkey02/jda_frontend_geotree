/**
 * Resizes an image file to a maximum width, maintaining aspect ratio.
 * @param {File} file - The image file to resize.
 * @param {number} maxWidth - The maximum width allowed (default: 800px).
 * @returns {Promise<File>} - A promise that resolves to the resized File object.
 */
export const resizeImage = (file, maxWidth = 800) => {
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

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("Canvas to Blob conversion failed"));
                        return;
                    }
                    // Create a new File object with the resized blob, preserving the original name and type
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now(),
                    });
                    resolve(resizedFile);
                }, file.type, 0.85); // 0.85 quality for good compression/quality balance
            };
            image.onerror = () => reject(new Error("Failed to load image"));
            image.src = readerEvent.target.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
};
