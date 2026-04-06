import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from './config';

export async function api(path, options = {}) {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
  });
  return res;
}
