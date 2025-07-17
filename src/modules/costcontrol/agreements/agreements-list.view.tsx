import { Table, Input, Space } from 'antd'
import { ToolBar, ToolBarMenu } from '../../../components'
import { useQuery } from '@apollo/client'
import { query } from './agreements.constant'
import { ProviderAgreement, ProviderTariff } from './costcontrol.types'
import {
	CreateAgreement,
	UpdateAgreement,
	DeleteAgreement,
	CreateAgreementRate,
	UpdateAgreementRate
} from './agreements-upsert.view'
import { useAntdHelp, useFilter } from '../../../hooks'

const { Column } = Table

export default function AgreementList() {
	const { data, loading, refetch } = useQuery<{ providerAgreements: ProviderAgreement[] }>(
		query.PROVIDER_AGREEMENTS
	)
	const { addKey } = useAntdHelp()
	const [agreements, filter] = useFilter(addKey<ProviderAgreement>(data?.providerAgreements), ['name'])

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter} />
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateAgreement />
				</ToolBarMenu>
			</ToolBar>

			<Table
				rowKey="id"
				dataSource={agreements}
				loading={loading}
				pagination={false}
				expandable={{
					expandedRowRender: (agreement: ProviderAgreement) => (
						<>
							<AgreementTariffList agreement={agreement} onRefetch={refetch} />
							<CreateAgreementRate agreementId={agreement.id} onRefetch={refetch} />
						</>
					),
				}}
			>
				<Column title="Nombre" dataIndex="name" />
				<Column title="Proveedor" dataIndex={['provider', 'name']} />
				<Column title="Estado" dataIndex="status" />
				<Column
					title="Acciones"
					render={({ id }: { id: number }) => (
						<Space>
							<UpdateAgreement id={id} />
							<DeleteAgreement id={id} />
						</Space>
					)}
				/>
			</Table>
		</>
	)
}

function AgreementTariffList({
	agreement,
	onRefetch,
}: {
	agreement: ProviderAgreement
	onRefetch: () => void
}) {
	const rates: ProviderTariff[] = agreement.rates ?? []

	return (
		<Table rowKey="id" dataSource={rates} pagination={false} size="small">
			<Column title="Especialidad" dataIndex={['medicalSpecialty', 'name']} />
			<Column title="Subespecialidad" dataIndex={['medicalSubspecialty', 'name']} />
			<Column title="Costo" dataIndex="cost" />
			<Column title="Moneda" dataIndex="currencyUMA" />
			<Column title="Tasa de cambio" dataIndex="exchangerate" />
			<Column title="Estado" dataIndex="status" />
			<Column
				title="Acciones"
				render={({ id }: { id: number }) => (
					<Space>
						<UpdateAgreementRate id={id} onRefetch={onRefetch} />
						
					</Space>
				)}
			/>
		</Table>
	)
}
