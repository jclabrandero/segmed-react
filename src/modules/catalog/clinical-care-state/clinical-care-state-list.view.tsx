
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table, Tag } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './clinical-care-state.constant'


export function ClinicalCareStateList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.CLINICAL_CARE_STATES, { onError })
		, [ clinicalCareStates, filter ] = useFilter(addKey(data?.clinicalCareStates), ['name'])
	const { Column } = Table
	useSubscription(subscription.CLINICAL_CARE_STATE_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={clinicalCareStates}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Color' render={({ color }) => (
					<Tag color={ color }>{ color }</Tag>
				)}/>
				<Column title='Bloqueo' render={({ lock }) => lock ? <b>Sí</b> : 'No'}/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={() => (
					<Space>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
