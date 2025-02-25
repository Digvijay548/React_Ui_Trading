// AuthService.js
const AuthService = {
  login: (sessionId) => {
    sessionStorage.setItem('sessionId', sessionId); // Store sessionId in sessionStorage
  },
  logout: () => {
    sessionStorage.removeItem('sessionId'); // Remove sessionId from sessionStorage
  },
  isLoggedIn: () => {
    return sessionStorage.getItem('sessionId') !== null; // Check if sessionId exists
  },
};

export default AuthService;
