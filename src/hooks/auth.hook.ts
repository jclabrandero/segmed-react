
import { ReactNode } from 'react'
import { useReactiveVar } from '@apollo/client'

import { authState, userState } from '../utils'


export function useAuth() {
	const user = useReactiveVar(userState)
		, auth = useReactiveVar(authState)

	const has = <T = ReactNode>(permission: string, component: T, unauthorized: T | null = null) => {
		if (user.permissions.includes(permission)) {
			return component
		}

		return unauthorized
	}

	return { auth, user, has }
}
