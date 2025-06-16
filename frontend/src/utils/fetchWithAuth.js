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

  const contentType = res.headers.get('content-type');

  // Try to parse only if response is JSON
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    throw new Error(`Unexpected response: ${text}`);
  }

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

export default fetchWithAuth;
