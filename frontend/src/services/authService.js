const API_VERSION = process.env.VUE_APP_API_VERSION;
const API_URL = `${process.env.VUE_APP_API_URL}${API_VERSION}/`;

class AuthService {
  static async signIn(user) {
    const response = await fetch(`${API_URL}login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.json();
  }

  static async register(user) {
    const response = await fetch(`${API_URL}register`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
        roles: ['User', 'Admin'],
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.json();
  }
}

export default AuthService;
