
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, concat, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

import { getAuth } from './utils'
import { App } from './app/app'


function main() {
	const authLink = setContext((_, { headers }) => {
		const { sessionId, token } = getAuth()

		return {
			headers: {
				...headers,
				authorization: `${sessionId} ${ token }`,
			}
		}
	})

	const client = new ApolloClient({
		link: split(
			({ query }) => {
				const def = getMainDefinition(query)
				return def.kind === 'OperationDefinition' && def.operation === 'subscription'
			},
			new GraphQLWsLink(createClient({
				url: import.meta.env.VITE_GRAPHQL_WS_URL
			})),
			concat(authLink, new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URI }))
		),
		cache: new InMemoryCache()
	})

	return {
		client
	}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<ApolloProvider client={main().client}>
			<App/>
		</ApolloProvider>
	</BrowserRouter>
)
