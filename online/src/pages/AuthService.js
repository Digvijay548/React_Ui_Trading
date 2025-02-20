// AuthService.js
const AuthService = {
  login: (sessionId) => {
    localStorage.setItem('sessionId', sessionId); // Store sessionId in localStorage
  },
  logout: () => {
    localStorage.removeItem('sessionId'); // Remove sessionId from localStorage
  },
  isLoggedIn: () => {
    return localStorage.getItem('sessionId') !== null; // Check if sessionId exists
  },
};

export default AuthService;
