import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

export const setSecureAuth = async (user, token) => {
    try {
        if (token) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
        if (user) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
        }
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde sécurisée de la session :', error);
    }
};

export const getSecureAuth = async () => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    const user = userJson ? JSON.parse(userJson) : null;
    return { token, user };
  } catch (error) {
    console.error('❌ Erreur lors de la lecture sécurisée de la session :', error);
    return { token: null, user: null };
  }
};

export const clearSecureAuth = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression sécurisée de la session :', error);
  }
};