/**
 * Décode la charge utile (payload) d'un token JWT sans bibliothèque externe lourde.
 * @param {string} token 
 * @returns {Object | null}
 */
export const decodeJwt = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du JWT', error);
    return null;
  }
};

/**
 * Vérifie si un token JWT est expiré.
 * @param {string} token 
 * @returns {boolean}
 */
export const isJwtExpired = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};