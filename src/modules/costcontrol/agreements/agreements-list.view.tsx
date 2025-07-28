import { Table, Input, Space } from 'antd'
import { ToolBar, ToolBarMenu } from '../../../components'
import { useQuery, useSubscription } from '@apollo/client'
import { query, subscription } from './agreements.constant'
import { ProviderAgreement, ProviderTariff } from './costcontrol.types'
import {
	CreateAgreement,
	UpdateAgreement,
	DeleteAgreement,
	CreateAgreementRate,
	UpdateAgreementRate,
	DowngradeAgreement,
	UpgradeAgreement
} from './agreements-upsert.view'
import { useAntdHelp, useFilter, useAuth} from '../../../hooks'
import { tableStatus } from '../../../hooks/table-fields'

const { Column } = Table

export default function AgreementList() {
	const { data, loading, refetch } = useQuery<{ agreements: ProviderAgreement[] }>(
		query.PROVIDER_AGREEMENTS
	)
	const { addKey } = useAntdHelp()
	const { has } = useAuth()
	const [agreements, filter] = useFilter(addKey<ProviderAgreement>(data?.agreements), ['name'])

	function refetchTariffs(): void {
		throw new Error('Function not implemented.')
	}

	useSubscription(subscription.AGREEMENT_UPSERTED, { onData: () => refetch() })

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
							<CreateAgreementRate agreementId={agreement.id} providerId={agreement.provider.id} onRefetch={refetchTariffs}/>
						</>
					),
				}}
			>
				<Column title="Nombre" dataIndex="name" />
				<Column title="Proveedor" dataIndex={['provider', 'businessName']} />
				<Column title="Estado" render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id, status, withStock }) => (
					<Space>
						{
							has('WriteAgreement', <>
								{ !withStock && (status === 1) && <DowngradeAgreement id={id}/> }
								{ (status === 0) && <UpgradeAgreement id={id}/> }
								<UpdateAgreement id={id}/>
								<DeleteAgreement id={id}/>
							</>)
						}
					</Space>
				)}/>
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
	
	const { data} = useQuery<{ tariffItems: ProviderTariff[] }>(
		query.TARIFF_ITEMS,
		{ variables: { agreementId: agreement.id } }
	)

	const rates = data?.tariffItems ?? []

	return (
		<Table rowKey="id" dataSource={rates} pagination={false} size="small">
			<Column title="Especialidad" dataIndex={['providerMedicalSpecialty', 'medicalSpecialty', 'name']} />
			<Column title="Subespecialidad" 
				render={(_, record: ProviderTariff) =>record.providerMedicalSubspecialty?.medicalSubspecialty?.name ?? '-'}/>
			<Column title="UMA" dataIndex="currencyUMA" />
			<Column title="Tipo de cambio" dataIndex="exchangeRate" />
			<Column title="Costo Bs" dataIndex="priceBs" />
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
