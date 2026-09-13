import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';

// Configuration des options de retour haptique (vibration)
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Chargement des sons de succès et d'erreur pour le retour audio en arrière-plan
// Assurez-vous d'avoir placé les fichiers .mp3 dans vos assets (src/assets/sounds/)
Sound.setCategory('Playback');

const successSound = new Sound('scan_success.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Erreur lors du chargement du son de succès', error);
  }
});

const errorSound = new Sound('scan_error.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log("Erreur lors du chargement du son d'erreur", error);
  }
});

export const hardwareScanner = {
  /**
   * Déclenche un retour haptique et sonore de succès lors d'un scan valide.
   */
  triggerSuccess: () => {
    // Déclenche une vibration haptique forte et nette
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);

    // Joue le bip sonore de succès
    if (successSound) {
      successSound.stop(() => {
        successSound.play((success) => {
          if (!success) {
            console.log("La lecture du son de succès a échoué.");
          }
        });
      });
    }
  },

  /**
   * Déclenche un retour haptique et sonore d'échec (ex: QR code inconnu ou invalide).
   */
  triggerError: () => {
    // Déclenche une vibration d'erreur
    ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);

    // Joue le bip sonore d'erreur
    if (errorSound) {
      errorSound.stop(() => {
        errorSound.play((success) => {
          if (!success) {
            console.log("La lecture du son d'erreur a échoué.");
          }
        });
      });
    }
  },

  /**
   * Libère les ressources audio lorsque le composant ou l'application se démonte.
   */
  releaseResources: () => {
    if (successSound) successSound.release();
    if (errorSound) errorSound.release();
  }
};