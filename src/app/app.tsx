
import { useReactiveVar, useQuery } from '@apollo/client'
import { ConfigProvider, ThemeConfig } from 'antd'
import locale from 'antd/locale/es_ES'

import { User } from '../types'
import { Loader } from '../components'
import { authState, userState, getDefaultUser } from '../utils'

import { Guest } from '../workspaces/guest'
import { Authorized } from '../workspaces/authorized'
import { query } from '../modules/authorization/user/user.constant'

import './app.css'


function useApp() {
	const user = useReactiveVar(userState)
		, auth = useReactiveVar(authState)

	const onError = () => userState(getDefaultUser())
		, onCompleted = ({ currentUser }: { currentUser: User }) => {
			userState(currentUser)
		}

	const { loading } = useQuery(query.CURRENT_USER, { onError, onCompleted, variables: { sessionId: auth.sessionId } })

	const theme: ThemeConfig = {
		token: {
			colorPrimary: '#1a5fba'
		}
	}

	return { loading, user, theme }
}

export function App() {
	const { theme, user, loading } = useApp()

	if (loading) return (<Loader/>)

	if (user.isAuthorized) return (
		<ConfigProvider theme={theme} locale={locale}>
			<Authorized/>
		</ConfigProvider>
	)

	return (
		<ConfigProvider theme={theme}>
			<Guest/>
		</ConfigProvider>
	)
}
