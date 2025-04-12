
import { useReactiveVar, useQuery, useSubscription } from '@apollo/client'
import { ConfigProvider, ThemeConfig } from 'antd'
import locale from 'antd/locale/es_ES'

import { User } from '../types'
import { Loader } from '../components'
import { authState, userState, getDefaultUser } from '../utils'

import { Guest } from '../workspaces/guest'
import { Authorized } from '../workspaces/authorized'
import { query } from '../modules/authorization/user/user.constant'

import { subscription as groupSubscription } from '../modules/authorization/group/group.constant'

import './app.css'


function useApp() {
	const user = useReactiveVar(userState)
		, auth = useReactiveVar(authState)

	const onError = () => userState(getDefaultUser())
		, onCompleted = ({ currentUser }: { currentUser: User }) => {
			userState(currentUser)
		}

	const { loading, refetch } = useQuery(query.CURRENT_USER, {
		onError, onCompleted, variables: { sessionId: auth.sessionId }, notifyOnNetworkStatusChange: true
	})

	const theme: ThemeConfig = {
		token: {
			colorPrimary: '#1a5fba'
		}
	}

	useSubscription(groupSubscription.GROUP_UPDATED, { onData: ({ data: { data } }) => {
		if (user.groups.find(({ id }) => id === data.group.id))
			refetch()
	}})

	return { loading, user, theme }
}

export function App() {
	const { theme, user, loading } = useApp()

	if (loading) return (<Loader show={true}/>)

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
