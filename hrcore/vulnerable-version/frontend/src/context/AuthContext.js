/**
 * VULNERABLE: Role is read from AsyncStorage - user can edit role to 'admin' (Vuln #7 - Client-side role escalation)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');
      const userId = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('name');
      const email = await AsyncStorage.getItem('email');
      const department = await AsyncStorage.getItem('department');
      const salary = await AsyncStorage.getItem('salary');
      if (token && userId) {
        setUser({
          id: userId,
          name: name || 'User',
          email: email || '',
          role: role || 'employee',
          department: department || '',
          salary: salary ? parseFloat(salary) : null,
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Login failed');
    }
    const data = await res.json();
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('role', data.user.role);
    await AsyncStorage.setItem('userId', String(data.user.id));
    await AsyncStorage.setItem('name', data.user.name || '');
    await AsyncStorage.setItem('email', data.user.email || '');
    await AsyncStorage.setItem('department', data.user.department || '');
    await AsyncStorage.setItem('salary', data.user.salary != null ? String(data.user.salary) : '');
    setUser({ ...data.user, id: String(data.user.id) });
  }

  async function register(payload) {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Registration failed');
    }
    const data = await res.json();
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('role', data.user.role);
    await AsyncStorage.setItem('userId', String(data.user.id));
    await AsyncStorage.setItem('name', data.user.name || '');
    await AsyncStorage.setItem('email', data.user.email || '');
    await AsyncStorage.setItem('department', data.user.department || '');
    await AsyncStorage.setItem('salary', data.user.salary != null ? String(data.user.salary) : '');
    setUser({ ...data.user, id: String(data.user.id) });
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch (_) {}
    await AsyncStorage.multiRemove(['token', 'role', 'userId', 'name', 'email', 'department', 'salary']);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loadStoredAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
