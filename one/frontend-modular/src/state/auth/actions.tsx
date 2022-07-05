
import { AUTH, Auth, AuthAction, BasicAuth, TokenAuth, defaultAuthState } from '@/models/auth'

export const authLoginRequest = (payload: BasicAuth): AuthAction => ({
  type: AUTH.LOGIN_REQUEST,
  payload,
})

export const authTokenLoginRequest = (payload: TokenAuth): AuthAction => ({
  type: AUTH.TOKEN_LOGIN_REQUEST,
  payload,
})

export const authLoginResponse = (payload: Auth): AuthAction => ({
  type: AUTH.LOGIN_RESPONSE,
  payload,
})

export const authRegisterRequest = (payload: BasicAuth): AuthAction => ({
  type: AUTH.REGISTER_REQUEST,
  payload,
})

export const authRegisterResponse = (payload: Auth): AuthAction => ({
  type: AUTH.REGISTER_RESPONSE,
  payload,
})

export const authValidateSessionRequest = () => ({
  type: AUTH.VALIDATE_SESSION_REQUEST,
})

export const authValidateSessionResponse = (payload: Auth): AuthAction => ({
  type: AUTH.VALIDATE_SESSION_RESPONSE,
  payload,
})

export const authLogoutRequest = (): AuthAction => ({
  type: AUTH.LOGOUT,
})

export const unauthorized = () => ({
  type: AUTH.UNAUTHORIZED,
})

export const createGuestUser = (payload: any): any => ({
  type: AUTH.GUEST_USER,
  payload,
})

export const authGuestUserResponse = (payload: any): any => ({
  type: AUTH.GUEST_USER_RESPONSE,
  payload: payload,
})