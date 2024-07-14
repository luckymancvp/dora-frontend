function checkMediaType(types, file) {
  if (!file || !file.type) return;
  return types.some(t => file.type.toLowerCase().includes(t));
}

export function isImageFile(file) {
  return checkMediaType(['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'], file);
}