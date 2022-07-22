const ROUTES = {
  ROOT: 'auth',
  LOCAL_LOGIN: '/local/login',
  LOCAL_REGISTER: '/local/register',
  GITHUB: '/github',
  GITHUB_CALLBACK: '/github/callback',
  LOGOUT: '/logout',
  REFRESH: '/refresh',
}

const ERRORS = {
  USER_EXIST: 'User already exist',
  WRONG_CREDENTIALS: 'Wrong credentials',
  UNAUTHORIZED: 'Unauthorized'
}

const STRATEGIES = {
  JWT_AT:{
    NAME: 'jwt-at',
    SECRET_OR_KEY: 'at-ultra-secret-key-123-dupi-dupi',
    EXPIRES_IN: '15m',
  },
  JWT_RT:{
    NAME: 'jwt-rt',
    SECRET_OR_KEY: 'rt-secret-tacos-de-pollo-deliciosos',
    EXPIRES_IN: '7d',
  },
  GITHUB:{
    NAME: 'github',
    SECRET: 'f0e2007fbdf51ad0a36599d3634c91b920d1a983',
    CLIENT_ID: '24da04cf2a36d9300e87',
    CALLBACK_URL: 'http://localhost:3333/auth/github/callback',
  }
}

const METADATA = {
  IS_PUBLIC: {
    KEY: 'isPublic',
    VALUE: true
  },
}

export default {
  ROUTES,
  ERRORS,
  STRATEGIES,
  METADATA
}