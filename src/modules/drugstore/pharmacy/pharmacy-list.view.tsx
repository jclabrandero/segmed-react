
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'
import { Pharmacy } from '../../../types'

import { CreatePharmacy, UpdatePharmacy } from './pharmacy-upsert.view'
import { query, subscription } from './pharmacy.constant'


export function PharmacyList() {
	const { addKey, tableStatus } = useAntdHelp()
	const [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.PHARMACIES, { onError })
		, [ pharmacies, filter ] = useFilter(addKey<Pharmacy>(data?.pharmacies), ['name'])
	const { Column } = Table

	useSubscription(subscription.PHARMACY_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreatePharmacy/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={pharmacies}
				bordered={ true }
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Pertinencia' ellipsis render={({ belonging }) => (
					<span>{ belonging.name }</span>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						<UpdatePharmacy id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={ error } />
		</>
	)
}
