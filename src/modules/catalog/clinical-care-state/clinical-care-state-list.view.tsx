
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table, Tag } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './clinical-care-state.constant'


export function ClinicalCareStateList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.CLINICAL_CARE_STATES, { onError })
		, [ clinicalCareStates, filter ] = useFilter(addKey(data?.clinicalCareStates), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.CLINICAL_CARE_STATE_UPSERTED, { onData: () => refetch() })

	return has('ReadClinicalCareState',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={clinicalCareStates}
				bordered={true}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Color' render={({ color }) => (
					<Tag color={ color }>{ color }</Tag>
				)}/>
				<Column title='Bloqueo de consulta' ellipsis render={({ lock }) => lock ? <b>Sí</b> : 'No'}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={() => has('WriteClinicalCareState',
					<Space>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
