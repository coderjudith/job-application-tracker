import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);

export const authService = {
  // Sign up new user
  async signUp(email, password) {
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      });
    });
  },

  // Confirm sign up
  async confirmSignUp(email, code) {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);
      
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },

  // Sign in
  async signIn(email, password) {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });

      const userData = {
        Username: email,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const token = result.getAccessToken().getJwtToken();
          resolve({
            user: cognitoUser,
            token,
            email
          });
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  },

  // Sign out
  signOut() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    localStorage.removeItem('token');
  },

  // Get current user session
  async getCurrentSession() {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        resolve(null);
        return;
      }
      
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        
        const token = session.getAccessToken().getJwtToken();
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
            return;
          }
          
          const email = attributes.find(attr => attr.Name === 'email')?.Value;
          resolve({ user: cognitoUser, token, email });
        });
      });
    });
  },

  // Forgot password
  async forgotPassword(email) {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);
      
      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  },

  // Confirm new password
  async confirmPassword(email, code, newPassword) {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);
      
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }
};