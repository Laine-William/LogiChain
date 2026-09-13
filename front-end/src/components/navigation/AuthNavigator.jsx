import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../../styles/navigation/AuthNavigator';

// Imports des écrans d'authentification
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../../screens/auth/ResetPasswordScreen'; // 👈 Import de l'écran de réinitialisation avec code

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#333',
        headerTitleStyle: styles.headerTitle,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'Connexion',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          title: 'Créer un compte',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ 
          title: 'Mot de passe oublié',
          headerShown: true
        }}
      />
      {/* 🟢 Ajout de la route correspondante pour la saisie du code de réinitialisation */}
      <Stack.Screen 
        name="VerifyResetCode" 
        component={ResetPasswordScreen} 
        options={{ 
          title: 'Nouveau mot de passe',
          headerShown: true
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;