import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.text}>Sorry, the page you are looking for does not exist.</p>
      <Link to="/dashboard" style={styles.link}>Go back to Dashboard</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  link: {
    fontSize: '1rem',
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default NotFound;
