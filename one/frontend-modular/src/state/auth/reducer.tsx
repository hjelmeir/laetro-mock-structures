
import { AUTH, Auth, AuthAction, BasicAuth, TokenAuth, defaultAuthState } from './state' // or type

export const authReducer = (state: Auth = defaultAuthState, action: AuthAction): Auth => {
  if (state === undefined) return defaultAuthState

  const { type, payload } = action
  if (state.isAuthPending == null) console.log('>>> authReducer:', type, state)

  if (!type || !payload) return state

  switch (action.type) {
    case AUTH.LOGIN_REQUEST:
    case AUTH.TOKEN_LOGIN_REQUEST:
    case AUTH.REGISTER_REQUEST:
    case AUTH.VALIDATE_SESSION_REQUEST:
      return {
        ...state,
        isAuthPending: true,
      }

    case AUTH.VALIDATE_SESSION_RESPONSE:
      return {
        ...state,
        ...payload,
        isAuthPending: false,
      }
    case AUTH.LOGIN_RESPONSE:
    case AUTH.LOGOUT:
    case AUTH.GUEST_USER_RESPONSE:
      return {
        ...state,
        ...payload,
        isAuthPending: false,
      }
    case AUTH.REGISTER_RESPONSE:
      return { ...state, ...payload, isAuthPending: false }

    default:
      return state
  }
}