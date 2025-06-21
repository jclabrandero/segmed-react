import { useQuery } from '@apollo/client'
import { Table, Tag, Input} from 'antd'
import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useDate, useFilter } from '../../../hooks'
import { ProviderAgreement, ProviderTariff } from '../../../types/costcontrol.types'
import { query } from './agreements.constant'

const { Column } = Table

function AgreementTariffList({ agreement }: { agreement: ProviderAgreement }) {
	const { addKey } = useAntdHelp()
	const tariffs = addKey<ProviderTariff>(agreement.rates)

	return (
		<Table
			size='small'
			dataSource={tariffs}
			bordered
			pagination={{ hideOnSinglePage: true }}
		>
			<Column title='ID' dataIndex='id' />
			<Column title='Especialidad Médica' ellipsis render={({ medicalSpecialty }) => medicalSpecialty?.name} />
			<Column title='Subespecialidad Médica' ellipsis render={({ medicalSubspecialty }) => medicalSubspecialty?.name} />
			<Column title='UMA' dataIndex='currencyUMA' />
			<Column title='TC' dataIndex='exchangerate' />
			<Column title='Costo Bs' dataIndex='cost' />
			<Column title='Estado' render={({ status }) => {
				const e = agreementStatusLabel(status)
				return <Tag color={e.color}>{e.label}</Tag>
			}} />
		</Table>
	)
}

function agreementStatusLabel(status: number) {
	switch (status) {
		case 1: return { label: 'Activo', color: 'green' }
		case 0: return { label: 'Inactivo', color: 'red' }
		default: return { label: 'Desconocido', color: 'gray' }
	}
}

export default function AgreementsList() {
	const { addKey } = useAntdHelp()
	const { format } = useDate()
	const [error, onError] = useError()
	const { loading, data } = useQuery(query.PROVIDER_AGREEMENTS, { onError })
	const [agreements, filter] = useFilter(addKey<ProviderAgreement>(data?.providerAgreements), ['name'])

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<h4>Lista de Convenios y tarifas</h4>
				</ToolBarMenu>
			</ToolBar>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter} />
				</ToolBarMenu>
			</ToolBar>
			<Table
				size='middle'
				dataSource={agreements}
				bordered
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
				expandable={{
					expandedRowRender: (agreement) => <AgreementTariffList agreement={agreement} />,
					rowExpandable: () => true
				}}
			>
				<Column title='ID' dataIndex='id' />
				<Column title='Convenio' dataIndex='name' ellipsis />
				<Column title='Proveedor' ellipsis render={({ provider }) => provider?.name} />
				<Column title='Fecha Inicio' ellipsis render={({ validFrom }) => format(validFrom, 'dd/MM/yyyy')} />
				<Column title='Fecha Conclusión' ellipsis render={({ validTo }) => validTo ? format(validTo, 'dd/MM/yyyy') : ''} />
				<Column title='Estado' render={({ status }) => {
					const e = agreementStatusLabel(status)
					return <Tag color={e.color}>{e.label}</Tag>
				}} />
				<Column title='Acciones' width='6rem' fixed='right'/>
			</Table>
			<ErrorDialog error={error} />
		</>
	)
}