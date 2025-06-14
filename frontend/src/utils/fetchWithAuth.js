import apiUrl from '../config/api';
import getAuthHeader from './authHeader';

const fetchWithAuth = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export default fetchWithAuth;