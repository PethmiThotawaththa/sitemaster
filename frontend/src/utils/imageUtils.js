const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getInventoryImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/200x200?text=No+Image';
  if (imagePath.startsWith('/uploads/')) {
    return `${baseURL}${imagePath}`;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseURL}/uploads/inventory${cleanPath}`;
};

export const getProjectImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/200x200?text=No+Image';
  if (imagePath.startsWith('/uploads/')) {
    return `${baseURL}${imagePath}`;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseURL}/uploads/projects${cleanPath}`;
};

export const getCartImageUrl = (imagePath, itemType) => {
  if (!imagePath) return 'https://placehold.co/200x200?text=No+Image';
  if (imagePath.startsWith('/uploads/')) {
    return `${baseURL}${imagePath}`;
  }
  const folder = itemType === 'Inventory' ? 'inventory' : 'projects';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseURL}/uploads/${folder}${cleanPath}`;
};

export const getPaymentImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/200x200?text=No+Image';
  // Normalize the path by replacing backslashes with forward slashes
  const normalizedPath = imagePath.replace(/\\/g, '/');
  // Remove any leading slashes to simplify checks
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  // Check if the path already includes 'uploads/payments/'
  if (cleanPath.startsWith('uploads/payments/')) {
    return `${baseURL}/${cleanPath}`;
  }
  // Check if the path includes 'uploads/' but not 'uploads/payments/'
  if (cleanPath.startsWith('uploads/')) {
    const fileName = cleanPath.split('/').pop();
    return `${baseURL}/uploads/payments/${fileName}`;
  }
  // Otherwise, assume it's just the filename and prepend the full path
  return `${baseURL}/uploads/payments/${cleanPath}`;
};

export const handleImageError = (event, itemName) => {
  const errorMessage = event.error ? 
    (event.error.message || event.error.toString()) : 
    'Failed to load image (no specific error message provided)';
  console.error(`Image load error for ${itemName}:`, {
    src: event.target.src,
    error: errorMessage,
    status: event.target.status || 'N/A',
  });
  event.target.src = 'https://placehold.co/200x200?text=Image+Failed';
};