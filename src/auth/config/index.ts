import { CookieOptions } from "express"

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
  USER_NOT_FOUND: 'User not found',
  WRONG_CREDENTIALS: 'Wrong credentials',
  UNAUTHORIZED: 'Unauthorized'
}

const STRATEGIES = {
  JWT_AT: {
    NAME: 'jwt-at',
    SECRET_OR_KEY: 'at-ultra-secret-key-123-dupi-dupi',
    EXPIRES_IN: '15m',
  },
  JWT_RT: {
    NAME: 'jwt-rt',
    SECRET_OR_KEY: 'rt-secret-tacos-de-pollo-deliciosos',
    EXPIRES_IN: '7d',
  },
  GITHUB: {
    NAME: 'github',
    CLIENT_ID: '10ffac4463a000f025f0',
    SECRET: '858269edf821d7fe0958fcbe7545d667b408dee7',
    CALLBACK_URL: 'http://localhost:3333/auth/github/callback',
    SCOPE: ['read:user']
  }
}

const METADATA = {
  IS_PUBLIC: {
    KEY: 'isPublic',
    VALUE: true
  },
}

const CRYPT = {
  SALT_ROUNDS: 10,
}

const COOKIE= {
  JWT_RT:{
    NAME: 'refresh_token',
    CONFIG:{
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      // httpOnly: true,
      // signed: true,
      // maxAge: 1000 * 60 * 60 * 24 * 7,
      // sameSite: 'lax',
      // secure: false
    } as CookieOptions
  }
}

export default {
  ROUTES,
  ERRORS,
  STRATEGIES,
  METADATA,
  CRYPT,
  COOKIE
}