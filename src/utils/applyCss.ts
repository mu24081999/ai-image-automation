// utils/applyFilter.ts

export const applyCssFilter = (
  img: HTMLImageElement,
  filter: string
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas 2D context is not available");

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.filter = filter;
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to convert canvas to blob"));
        return;
      }
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, "image/jpeg");
  });
};
export const applyDuskFilter = async (imageBlob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(imageBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter =
        "brightness(0.9) contrast(1.1) sepia(0.2) hue-rotate(295deg) saturate(0.9)";
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((filteredBlob) => {
        if (filteredBlob) {
          resolve(URL.createObjectURL(filteredBlob));
        }
      }, "image/jpeg");

      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
};
