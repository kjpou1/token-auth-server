import Configuration from '@/helpers/ConfigProvider';

const API_VERSION = Configuration.value('apiVersion');
const API_URL = `${Configuration.value('apiURL')}${API_VERSION}/`;

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
