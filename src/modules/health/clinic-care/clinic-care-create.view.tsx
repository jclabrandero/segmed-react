
// import { useNavigate } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { Button, DatePicker, Form, Select, Space } from 'antd'
import dayjs from 'dayjs'

import { CreateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { Insured, ClinicalCareState, User } from '../../../types'
import { userState } from '../../../utils'

import { mutation, query } from './clinic-care.constant'


interface IClinicCareCreateArgs {
	startDate:			Date
	insuredId:			number
	stateId:			number
	medicalOfficeId:	number
}

interface IClinicCareDependencies {
	user:		User
	insureds:	Array<Insured>
	states:		Array<ClinicalCareState>
}

type ClinicCareFormProps = {
	data:		IClinicCareDependencies
	onSubmit:	(data: IClinicCareCreateArgs) => void
	onCancel:	() => void
	onRefetch:	() => void
}

interface IClinicCareFormItems {
	startDate:			{ $d: Date }
	insuredId:			number
	stateId:			number
	medicalOfficeId:	number
}

function ClinicCareForm({ data, onSubmit, onCancel }: ClinicCareFormProps) {
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { map, toLV } = useAntdHelp()
	const onFinish = (data: IClinicCareFormItems) => {
			const { startDate, ...remaining } = data
			onSubmit({ ...remaining, startDate: startDate.$d })
		}
		, filter = (inputValue: string, option: { label: string } | undefined) => option?.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
		, medicalOffices = map(data.user?.clerk?.medicalOffices, toLV)

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish}
			initialValues={{
				startDate: dayjs(),
				medicalOfficeId: medicalOffices.length == 1 ? medicalOffices[0].value : undefined,
				stateId: data.states[0]?.id
			}}>
			<Item
				name='insuredId'
				label='Nombre o numero de ficha del beneficiario'
				rules={[{ required: true, message: 'Escriba nombre del beneficiario' }]}>
				<Select
					options={map(data.insureds, ({ id, person }) => ({ label: `${person.firstName} ${person.lastName}`, value: id }))}
					filterOption={filter}
					showSearch={true}/>
			</Item>
			<Item
				name='startDate'
				label='Fecha de inicio de la consulta'
				rules={[{ required: true, message: 'Seleccione fecha de inicio de la consulta' }]}>
				<DatePicker />
			</Item>
			<Item
				name='medicalOfficeId'
				label='Consultorio'
				rules={[{ required: true, message: 'Seleccione consultorio' }]}>
				<Select options={medicalOffices}/>
			</Item>
			<Item
				name='stateId'
				label='Estado de la consulta'
				rules={[{ required: true, message: 'Seleccione estado de la consulta' }]}>
				<Select options={map(data.states, toLV)}/>
			</Item>
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

export function CreateClinicCare() {
	const user = useReactiveVar(userState)
	
	return (
		<CreateDialog<IClinicCareCreateArgs, IClinicCareDependencies>
			title='Nueva consulta'
			query={query.DEPENDENCIES}
			mutation={mutation.CREATE_CLINIC_CARE}
			options={{ variables: { userName: user.userName } }}
			render={(submit, close, data, refetch) => <ClinicCareForm data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}
