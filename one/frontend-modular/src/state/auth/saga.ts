import { put, takeLatest } from 'redux-saga/effects'

import { AUTH, AuthAction, BasicAuth, TokenAuth, UserAuth, MagicLink } from '@/models/auth'
import BackendService from '@/services/BackendService'
import { processErrorResponse } from '@/sagas/backendSaga'
import { authLoginResponse, authRegisterResponse, authValidateSessionResponse, authGuestUserResponse } from '@/controllers/authController'
import { MODAL } from '@/models/modal'
import { DEBUG_MODE } from '@/helpers/debugHelper'
import { call } from 'horseshoes'

function* watchTokenLoginRequest(action: AuthAction) {
  const { token, callback } = action.payload as TokenAuth
  try {
    const response = yield new BackendService({ authorization: token }).auth.login({ token })
    if (response.error || response.errors) {
      yield call(callback, response.error || response.errors, null)
      return
    }
    yield put(
      authLoginResponse({
        loggedIn: true,
        user: response.data,
      })
    )
    yield call(callback, null, response.data)
  } catch (e) {
    yield call(callback, e, null)
  }
}

function* watchAuthLoginRequest(action: AuthAction) {
  let response
  const user = action.payload as BasicAuth
  const token = localStorage.getItem('token')
  if (user.password) {
    response = yield new BackendService({ authorization: token }).auth.login({ user })
  } else {
    const redirectUri = user?.redirectUri || null
    let magic = { user: user } as MagicLink
    if (redirectUri) {
      delete user.redirectUri
      magic = {
        user: user,
        redirectUri: redirectUri,
      }
    }
    response = yield new BackendService({}).auth.magic(magic)
  }

  if (response.ok) yield processErrorResponse(response)

  if (response.data) {
    yield put({ type: MODAL.HIDE })
    yield put(
      authLoginResponse({
        loggedIn: true,
        user: response.data,
      })
    )
  }
}

function* watchAuthRegisterRequest(action: AuthAction) {
  const user = action.payload as BasicAuth
  const response = yield new BackendService({}).auth.register({ user })

  if (response.ok) yield processErrorResponse(response)

  if (response.data)
    yield put(
      authRegisterResponse({
        loggedIn: true,
        user: response.data,
      })
    )
}

function* watchAuthValidateSessionRequest() {
  const response = yield new BackendService({}).auth.validateSession()
  if (DEBUG_MODE) console.log('watchAuthValidateSessionRequest response ', response)

  if (response.error) {
    yield put(
      authValidateSessionResponse({
        loggedIn: false,
        user: {} as UserAuth,
      })
    )
  }

  if (response.ok) yield processErrorResponse(response)

  if (response.data) {
    yield put(
      authValidateSessionResponse({
        loggedIn: true,
        user: response.data,
      })
    )
  }
}

function* watchAuthLogoutRequest() {
  const response = yield new BackendService({}).auth.logout()
  if (DEBUG_MODE) console.log('watchAuthLogoutRequest response ', response)

  yield put(
    authValidateSessionResponse({
      loggedIn: false,
      user: {} as UserAuth,
    })
  )
}

function* watchCreateGuestUser(action) {
  const { payload } = action
  const response = yield new BackendService({}).auth.guestUser(payload)

  yield put(
    authGuestUserResponse({
      isGuestUser: true,
      user: response.data,
    })
  )
}

export default [
  takeLatest(AUTH.LOGIN_REQUEST, watchAuthLoginRequest),
  takeLatest(AUTH.TOKEN_LOGIN_REQUEST, watchTokenLoginRequest),
  takeLatest(AUTH.REGISTER_REQUEST, watchAuthRegisterRequest),
  takeLatest(AUTH.VALIDATE_SESSION_REQUEST, watchAuthValidateSessionRequest),
  takeLatest(AUTH.LOGOUT, watchAuthLogoutRequest),
  takeLatest(AUTH.GUEST_USER, watchCreateGuestUser),
]
