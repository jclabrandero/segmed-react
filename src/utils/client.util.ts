
import { makeVar } from '@apollo/client'

import { User } from '../types'


export const userState = makeVar<User>(getDefaultUser())
export const authState = makeVar(getAuth())


export function getAuth() {
	return {
		sessionId: Number(localStorage.getItem('sessionId')),
		token: localStorage.getItem('authorization')
	}
}

export function setAuth(data: { sessionId: number, token: string }) {
	localStorage.setItem('sessionId', String(data.sessionId))
	localStorage.setItem('authorization', data.token)
	authState(data)
}

export function getDefaultUser(): User {
	return {
		id: 0,
		userName: 'guest',
		displayName: '',
		email: '',
		groups: [],
		status: 1,
		permissions: [],
		isAuthorized: false
	}
}
