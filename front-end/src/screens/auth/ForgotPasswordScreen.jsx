import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import { styles } from '../../styles/auth/ForgotPasswordScreen';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ModalAlert from '../../components/ModalAlert';
import apiClient from '../../services/api/clientApi';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info' });

  const handleResetPassword = async () => {
    if (!email) {
      setAlertConfig({
        visible: true,
        title: 'Champ requis',
        message: 'Veuillez saisir votre adresse email.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/users/forgot-password', { email });

      setIsLoading(false);
      setAlertConfig({
        visible: true,
        title: 'Code envoyé',
        message: 'Un code à 6 chiffres a été envoyé à votre adresse email (valide 15 minutes).',
        type: 'success',
      });

    } catch (error) {
      setIsLoading(false);
      console.error('❌ Erreur de réinitialisation :', error);

      const errorMessage = error.response?.data?.message || 'Impossible de joindre le serveur. Veuillez réessayer.';

      setAlertConfig({
        visible: true,
        title: 'Erreur',
        message: errorMessage,
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior="height" 
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Réinitialisation</Text>
        <Text style={styles.subtitle}>
          Entrez votre adresse email. Nous vous enverrons un code de validation à 6 chiffres valable 15 minutes.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Adresse Email"
          value={email}
          onChangeText={setEmail}
          placeholder="exemple@logichain.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button 
          title="Envoyer le code" 
          onPress={handleResetPassword} 
          isLoading={isLoading} 
        />
      </View>

      <ModalAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        duration={1500}
        onClose={() => {
          setAlertConfig({ ...alertConfig, visible: false });
          if (alertConfig.type === 'success') {
            // Redirection vers l'écran de saisie du code en passant l'email
            navigation.navigate('VerifyResetCode', { email });
          }
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;