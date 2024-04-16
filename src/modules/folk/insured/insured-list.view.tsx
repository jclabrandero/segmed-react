
import { useQuery, useSubscription } from '@apollo/client'
import { Button, Input, Space, Table, Tag, Tooltip } from 'antd'
import { MedicineBoxFilled } from '@ant-design/icons'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useDate, useError, useAntdHelp, useFilter } from '../../../hooks'
import { Insured } from '../../../types'

import { query, subscription } from './insured.constant'
import { CreateInsured, DeleteInsured, UpdateInsured } from './insured-upsert.view'


export function InsuredList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { format } = useDate()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.INSUREDS, { onError })
		, [ insureds, filter ] = useFilter(addKey<Insured>(data?.insureds), ['code'], [({ person }) => `${person.firstName} ${person.lastName}`])
	const { Column } = Table

	useSubscription(subscription.INSURED_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={ filter }/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateInsured/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={insureds}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
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
				<Column title='Código' dataIndex='code' className='table-cell-nowrap'/>
				<Column title='Ficha' dataIndex='iin'/>
				<Column title='Nombre beneficiario' className='table-cell-nowrap' render={({ person }) => (
					<span>{person.firstName} {person.lastName}</span>
				)}/>
				<Column title='Tipo' render={({ insuredType }) => (
					<span>{ insuredType.name }</span>
				)}/>
				<Column title='Sindical' render={({ tradeUnion }) => (
					<span>{ tradeUnion ? 'Sí' : 'No' }</span>
				)}/>
				<Column title='Fecha de alta' render={({ inletDate }) => (
					<span>{format(inletDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Fecha de baja' render={({ outletDate }) => (
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
				<Column title='Pertinencia' className='table-cell-nowrap' render={({ belonging }) => (
					<span>{ belonging.name }</span>
				)}/>
				<Column title='Dirección' dataIndex='address' className='table-cell-nowrap'/>
				<Column title='Teléfono' dataIndex='phone' className='table-cell-nowrap'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' fixed='right' render={({ id }) => (
					<Space>
						<Tooltip title='Generar consulta médica'>
							<Button shape='circle' type='text' size='small' icon={ <MedicineBoxFilled style={{ color: '#2F8923' }}/> }/>
						</Tooltip>
						<UpdateInsured id={id}/>
						<DeleteInsured id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
