
import { useQuery, useSubscription } from '@apollo/client'
import { Button, Input, Space, Table, Tag, Tooltip } from 'antd'
import { MedicineBoxFilled } from '@ant-design/icons'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useDate, useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { Insured } from '../../../types'
import { NotAllowed } from '../../basic'

import { query, subscription } from './insured.constant'
import { CreateInsured, DeleteInsured, UpdateInsured } from './insured-upsert.view'


export function InsuredList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, { format } = useDate()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.INSUREDS, { onError })
		, [ insureds, filter ] = useFilter(addKey<Insured>(data?.insureds), ['code'], [({ person }) => `${person.firstName} ${person.lastName}`])
	const { Column } = Table

	useSubscription(subscription.INSURED_UPSERTED, { onData: () => refetch() })

	return has('R_NSRD',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={ filter }/>
				</ToolBarMenu>

				<ToolBarMenu>
					{ has('W_NSRD', <CreateInsured/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={insureds}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
				expandable={{
					expandedRowRender: insured =>
						<>
							<h5>Dependientes</h5>
							{
								insured.dependents.map(dep => (
									<div key={`holder${insured.code}-insured${dep.code}`}>
										{dep.code}
									</div>
								))
							}
						</>,
					rowExpandable: insured => insured.dependents.length > 0
				}}
			>
				<Column title='Código' dataIndex='code' ellipsis/>
				<Column title='Ficha' dataIndex='iin' ellipsis/>
				<Column title='Nombre beneficiario' ellipsis render={({ person }) => (
					<span>{person.firstName} {person.lastName}</span>
				)}/>
				<Column title='Tipo' ellipsis render={({ insuredType }) => (
					<span>{ insuredType.name }</span>
				)}/>
				<Column title='Sindical' ellipsis render={({ tradeUnion }) => (
					<span>{ tradeUnion ? 'Sí' : 'No' }</span>
				)}/>
				<Column title='Fecha de alta' ellipsis render={({ inletDate }) => (
					<span>{format(inletDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Fecha de baja' ellipsis render={({ outletDate }) => (
					<span>{format(outletDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Dependientes' render={({ dependents }) => (
					(dependents.length > 0) &&
					<Tag>{ dependents.length } dependientes</Tag>
				)}/>
				<Column title='Código titular' render={({ holderInsured }) => (
					holderInsured &&
					<Tag>{ holderInsured.code }</Tag>
				)}/>
				<Column title='Pertinencia' ellipsis render={({ belonging }) => (
					<span>{ belonging.name }</span>
				)}/>
				<Column title='Dirección' ellipsis dataIndex='address'/>
				<Column title='Teléfono' ellipsis dataIndex='phone'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' fixed='right' render={({ id }) => has('W_NSRD',
					<Space>
						<Tooltip title='Generar consulta médica'>
							<Button shape='circle' type='text' size='small' icon={ <MedicineBoxFilled style={{ color: '#2F8923' }}/> }/>
						</Tooltip>
						<UpdateInsured id={id}/>
						<DeleteInsured id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
