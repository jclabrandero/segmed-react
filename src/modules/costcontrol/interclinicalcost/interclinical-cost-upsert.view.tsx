import { Button, Form, Input, InputNumber, Space, DatePicker, Select } from 'antd'
import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { mutation, query } from './interclinical.constant'
import dayjs from 'dayjs'
import { InterclinicalCost, InterclinicalCostItem } from '../../../types/interclinical.types'

interface IInterclinicalCostCreateArgs {
	invoiceNumber: number	
	invoiceDate: Date
	providerId: number
	total: number
}

interface IInterclinicalCostDependencies {
	providers: Array<Provider>
	interclinicalCost?: InterclinicalCost
}

type InterclinicalCostFormProps = {
	mode: 'create' | 'update'
	data: IInterclinicalCostDependencies
	onSubmit: (data: IInterclinicalCostCreateArgs) => void
	onCancel: () => void
}

interface IInterclinicalCostItemCreateArgs {
	interclinicalId: number
	quantity: number
	sesionDate?: Date
	description: string
	priceTariff: number
	price: number
}

interface IInterclinicalCostItemDependencies {
	interclinicalCostItem?: InterclinicalCostItem
	interclinicalId?: number
}

type InterclinicalCostItemFormProps = {
	mode: 'create' | 'update'
	data: IInterclinicalCostItemDependencies
	onSubmit: (data: IInterclinicalCostItemCreateArgs) => void
	onCancel: () => void
}

function InterclinicalCostForm({ data, onSubmit, onCancel }: InterclinicalCostFormProps) {
	const { interclinicalCost } = data
	const {selectFilter } = useAntdHelp()
	const [form] = Form.useForm()

	const onFinish = () => {
		const payload = form.getFieldsValue()
		onSubmit(payload)
		console.log('Submitted data:', payload)
	}

	const formatInitialValues = (cost?: InterclinicalCost) => {
		if (!cost) return undefined
		const { provider, invoiceDate, ...rest } = cost
		return {
			...rest,
			providerId: provider?.id,
			invoiceDate: invoiceDate ? dayjs(invoiceDate) : undefined
		}
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={formatInitialValues(interclinicalCost)}>
			<Form.Item name="providerId" label="Proveedor" rules={[{ required: true }]}>
				<Select options={data.providers.map(p => ({ label: p.businessName, value: p.id }))}
					showSearch={true}
					filterOption={selectFilter}/>
			</Form.Item>
			<Form.Item name='invoiceNumber' label='Número de factura' rules={[{ required: true, message: 'Escriba el número de factura' }]}>
				<InputNumber />
			</Form.Item>
			<Form.Item name='invoiceDate' label='Fecha de factura' rules={[{ required: true, message: 'Seleccione la fecha' }]}>
				<DatePicker format='DD/MM/YYYY' />
			</Form.Item>
			<Form.Item name='invoiceTotalRefPrice' label='Total factura' rules={[{ required: true, message: 'Escriba el total' }]}>
				<InputNumber />
			</Form.Item>
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

function InterclinicalCostItemForm({ mode, data, onSubmit, onCancel }: InterclinicalCostItemFormProps) {
	const { interclinicalCostItem, interclinicalId } = data
	const [form] = Form.useForm()
	const { touched } = useAntdHelp()

	const onFinish = () => {
		const payload = touched(form)
		if (mode === 'create') onSubmit({ interclinicalId, ...payload })
		if (mode === 'update') onSubmit(payload)
	}

	const format = (item?: InterclinicalCostItem) => {
		if (!item) return undefined
		const { sesionDate, ...rest } = item
		return {
			...rest,
			sesionDate: sesionDate ? dayjs(sesionDate) : undefined
		}
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(interclinicalCostItem)}>
			<Form.Item name='description' label='Descripción' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item name='quantity' label='Cantidad' rules={[{ required: true }]}>
				<InputNumber min={1} />
			</Form.Item>
			<Form.Item name='sesionDate' label='Fecha de sesión'>
				<DatePicker format='DD/MM/YYYY' />
			</Form.Item>
			<Form.Item name='priceTariff' label='Precio tarifario' rules={[{ required: true }]}>
				<InputNumber min={0} step={0.01} />
			</Form.Item>
			<Form.Item name='price' label='Precio' rules={[{ required: true }]}>
				<InputNumber min={0} step={0.01} />
			</Form.Item>
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}


export function CreateInterclinicalCost() {
	return (
		<CreateDialog<IInterclinicalCostCreateArgs, IInterclinicalCostDependencies>
			title='Nueva factura de interconsulta'
			query={query.CREATE_INTERCLINICAL_DEPENDENCIES}
			//options={{ variables: { interclinicalId } }}
			options={{ variables: { query: {} } }}
			mutation={mutation.CREATE_INTERCLINICAL_COST}
			render={(submit, close, data) => (
				<InterclinicalCostForm data={{ ...data }} onSubmit={submit} onCancel={close} />)
			//render={(submit, close, data) => <InterclinicalCostForm mode='create' data={{ ...data }} onSubmit={submit} onCancel={close}/>
			}
		/>
	)
}

export function UpdateInterclinicalCost({ id }: UpdateProps) {
	return (
		<UpdateDialog<IInterclinicalCostCreateArgs, IInterclinicalCostDependencies>
			id={id}
			title='Editar costo interconsulta'
			query={query.UPDATE_INTERCLINICAL_COST_DEPENDENCIES}
			mutation={mutation.UPDATE_INTERCLINICAL_COST}
			render={(submit, close, data) => (
				<InterclinicalCostForm mode='update' data={data} onSubmit={submit} onCancel={close} />
			)}
		/>
	)
}

export function DeleteInterclinicalCost({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ interclinicalCost: InterclinicalCost }>
			id={id}
			title='Eliminar costo interconsulta'
			query={query.INTERCLINICAL_COST}
			mutation={mutation.DELETE_INTERCLINICAL_COST}
			render={({ interclinicalCost }) => `Factura: ${interclinicalCost.invoiceNumber}`}
		/>
	)
}

export function CreateInterclinicalCostItem({ interclinicalId }: { interclinicalId: number }) {
	return (
		<CreateDialog<IInterclinicalCostItemCreateArgs, IInterclinicalCostItemDependencies>
			title='Nuevo costo de interconsulta'
			mutation={mutation.CREATE_INTERCLINICAL_COST_ITEM}
			render={(submit, close) => (
				<InterclinicalCostItemForm mode='create' data={{ interclinicalId }} onSubmit={submit} onCancel={close} />
			)}
		/>
	)
}

export function UpdateInterclinicalCostItem({ id }: { id: number }) {
	return (
		<UpdateDialog<IInterclinicalCostItemCreateArgs, IInterclinicalCostItemDependencies>
			id={id}
			title='Editar costo de interconsulta'
			query={query.INTERCLINICAL_COST_ITEM}
			mutation={mutation.UPDATE_INTERCLINICAL_COST_ITEM}
			render={(submit, close, data) => (
				<InterclinicalCostItemForm mode='update' data={data} onSubmit={submit} onCancel={close} />
			)}
		/>
	)
}

export function DeleteInterclinicalCostItem({ id }: { id: number }) {
	return (
		<DeleteDialog<{ interclinicalCostItem: InterclinicalCostItem }>
			id={id}
			title='Eliminar costo de interconsulta'
			query={query.INTERCLINICAL_COST_ITEM}
			mutation={mutation.DELETE_INTERCLINICAL_COST_ITEM}
			render={({ interclinicalCostItem }) => `item: ${interclinicalCostItem.description}`}
		/>
	)
}