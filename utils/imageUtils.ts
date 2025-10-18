export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Fix: Add type check for reader.result to ensure it's a string.
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader result was not a string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
