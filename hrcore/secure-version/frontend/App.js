import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SearchScreen from './src/screens/SearchScreen';
import LeaveRequestScreen from './src/screens/LeaveRequestScreen';
import AdminPanelScreen from './src/screens/AdminPanelScreen';
import DocumentUploadScreen from './src/screens/DocumentUploadScreen';
import MyLeaveRequestsScreen from './src/screens/MyLeaveRequestsScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#eee' }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
            <Stack.Screen name="MyLeaveRequests" component={MyLeaveRequestsScreen} />
            <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
            <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
