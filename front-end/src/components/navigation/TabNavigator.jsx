import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/navigation/TabNavigator';

// Imports des composants et options de header externalisés
import { 
  DashboardHeaderTitle, 
  headerScreenOptions 
} from './HeaderNavigator';

// Imports de vos écrans
import DashboardScreen from '../../screens/DashboardScreen';
import ScanScreen from '../../screens/ScanScreen';
import MapScreen from '../../screens/MapScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import SyncCenterScreen from '../../screens/SyncCenterScreen';
import AnomalyScreen from '../../screens/AnomalyScreen';
import AnomalyFormScreen from '../../screens/anomalies/AnomalyFormScreen';
import LogisticDetailScreen from '../../screens/logistics/LogisticDetailScreen';
import StepValidationScreen from '../../screens/logistics/StepValidationScreen';
import LogisticHistoryScreen from '../../screens/logistics/LogisticHistoryScreen';
import StepFormScreen from '../../screens/logistics/StepFormScreen';
import ItemScreen from '../../screens/ItemScreen';
import ItemFormScreen from '../../screens/items/ItemFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        ...headerScreenOptions
      })}
    >
      <Stack.Screen 
        name="DashboardMain" 
        component={DashboardScreen} 
        options={({ navigation }) => ({ 
          headerTitleAlign: 'left',
          headerTitle: (props) => (
            <DashboardHeaderTitle 
              {...props} 
              navigation={navigation} 
              title="Mon Espace Personnel"
              showIcon={true}
            />
          )
        })}
      />
      <Stack.Screen 
        name="LogisticDetail" 
        component={LogisticDetailScreen} 
        options={({ navigation }) => ({ 
          headerTitle: (props) => (
            <DashboardHeaderTitle 
              {...props} 
              navigation={navigation} 
              title="Détail logistique" 
              showIcon={false} 
            />
          )
        })} 
      />
      <Stack.Screen 
        name="StepValidation" 
        component={StepValidationScreen} 
        options={({ navigation }) => ({ 
          headerTitle: (props) => (
            <DashboardHeaderTitle 
              {...props} 
              navigation={navigation} 
              title="Validation étape" 
              showIcon={false} 
            />
          )
        })} 
      />

      <Stack.Screen 
        name="StepForm" 
        component={StepFormScreen} 
        options={({ navigation }) => ({ 
          headerTitle: (props) => (
            <DashboardHeaderTitle 
              {...props} 
              navigation={navigation} 
              title="Formulaire Étape" 
              showIcon={false} 
            />
          )
        })} 
      />

      <Stack.Screen 
        name="LogisticHistory" 
        component={LogisticHistoryScreen} 
        options={({ navigation }) => ({ 
          headerTitle: (props) => (
            <DashboardHeaderTitle 
              {...props} 
              navigation={navigation} 
              title="Historique & Traçabilité" 
              showIcon={false} 
            />
          )
        })} 
      />
    </Stack.Navigator>
  );
}

function AnomalyStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        ...headerScreenOptions
      })}
    >
      <Stack.Screen 
        name="AnomalyMain" 
        component={AnomalyScreen} 
        options={{ 
          headerTitle: () => <DashboardHeaderTitle title="Supervision des Anomalies" showIcon={false} />
        }}
      />
      <Stack.Screen 
        name="AnomalyFormScreen" 
        component={AnomalyFormScreen} 
        options={{ 
          headerTitle: () => <DashboardHeaderTitle title="Déclarer une Anomalie" showIcon={false} />
        }}
      />
    </Stack.Navigator>
  );
}

function ItemStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        ...headerScreenOptions
      })}
    >
      <Stack.Screen 
        name="ItemMain" 
        component={ItemScreen} 
        options={{ 
          headerTitle: () => <DashboardHeaderTitle title="Gestion des Équipements" showIcon={false} />
        }}
      />
      <Stack.Screen 
        name="ItemForm" 
        component={ItemFormScreen} 
        options={{ 
          headerTitle: () => <DashboardHeaderTitle title="Ajouter un Équipement" showIcon={false} />
        }}
      />
    </Stack.Navigator>
  );
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // 🟢 Masquage dynamique de la barre pour DashboardMain
        tabBarStyle: (() => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'DashboardMain';
          if (route.name === 'DashboardTab' && routeName !== 'DashboardMain') {
            return { display: 'none' }; // Cache la barre si on navigue dans un sous-écran du Dashboard (ex: LogisticDetail)
          }
          if (route.name === 'DashboardTab' && routeName === 'DashboardMain') {
            return { display: 'none' }; // 👈 Cache complètement la barre sur la page DashboardMain
          }
          return styles.tabBar; // Affiche la barre par défaut pour les autres onglets
        })(),
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#0056b3',
        tabBarInactiveTintColor: '#6c757d',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse';
          if (route.name === 'DashboardTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'ScanTab') iconName = focused ? 'scan' : 'scan-outline';
          else if (route.name === 'MapTab') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'ItemTab') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'SyncTab') iconName = focused ? 'sync' : 'sync-outline';
          else if (route.name === 'AnomalyTab') iconName = focused ? 'warning' : 'warning-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardStack} 
        options={{ title: 'Opérations' }} 
      />
      <Tab.Screen 
        name="ScanTab" 
        component={ScanScreen} 
        options={{ 
          title: 'Scan',
          ...headerScreenOptions,
          headerShown: true,
        }} 
      />
      <Tab.Screen 
        name="MapTab" 
        component={MapScreen} 
        options={{ 
          title: 'Carte',
          ...headerScreenOptions,
          headerShown: true,
          headerTitle: () => (
            <DashboardHeaderTitle 
              title="Cartographie des incidents" 
              showIcon={false} 
            />
          )
        }} 
      />
      <Tab.Screen 
        name="ItemTab" 
        component={ItemStack} 
        options={{ 
          title: 'Équipements',
          headerShown: false,
        }} 
      />
      <Tab.Screen 
        name="SyncTab" 
        component={SyncCenterScreen} 
        options={{ 
          title: 'Synchro',
          ...headerScreenOptions,
          headerShown: true,
        }} 
      />
      <Tab.Screen 
        name="AnomalyTab" 
        component={AnomalyStack} 
        options={{ 
          title: 'Anomalies',
          headerShown: false,
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profil', 
          ...headerScreenOptions,
          headerShown: true,
          headerTitle: () => (
            <DashboardHeaderTitle 
              title="Mon Compte" 
              showIcon={false} 
            />
          )
        }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;