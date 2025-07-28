import { Button, Form, Input, InputNumber, Select, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { AgreementFormProps, AgreementRateFormProps } from './agreements.types'
import { ProviderAgreement, ProviderTariff } from './costcontrol.types'
import { getAuth } from '../../../utils'
import { UploadOutlined } from '@ant-design/icons'
import { useAntdHelp } from '../../../hooks'
import { useQuery } from '@apollo/client'
import { query } from './agreements.constant'

export function AgreementForm({
	mode,
	data,
	dependencies,
	onSubmit,
	onCancel,
}: AgreementFormProps) {
	const [form] = Form.useForm<ProviderAgreement>()
		, { sessionId, token } = getAuth()
		, { selectFilter } = useAntdHelp()
	const [ fileMd5, setFileMd5 ] = useState<string>()

	useEffect(() => {
		if (data) form.setFieldsValue(data)
	}, [data, form])

	return (
		<>
			<h3>{mode === 'create' ? 'Crear convenio' : 'Editar convenio'}</h3>
			<Form
				form={form}
				layout="vertical"
				onFinish={(values: Partial<ProviderAgreement>) => {
					const { provider, ...rest } = values
					const payload = {
						...rest,
						providerId: provider?.id,
						fileMd5
					}
					onSubmit(payload)
				}}
			>
				<Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name={['provider', 'id']} label="Proveedor" rules={[{ required: true }]}>
					<Select options={dependencies?.providers.map(p => ({ label: p.businessName, value: p.id }))}
						showSearch={true}
						filterOption={selectFilter}/>
				</Form.Item>
				<Form.Item name="validFrom" label="Válido desde" rules={[{ required: true }]}>
					<Input type="date" />
				</Form.Item>
				<Form.Item name="validTo" label="Válido hasta" rules={[{ required: true }]}>
					<Input type="date" />
				</Form.Item>
				{/* <Form.Item name="status" label="Activo" valuePropName="checked">
					<Switch />
				</Form.Item> */}

				<Upload
					name="file"
					listType="picture"
					action={import.meta.env.VITE_FILE_UPLOAD_URI}
					multiple={false}
					accept=".pdf"
					headers={{
						authorization: `${sessionId} ${ token }`
					}}
					onChange={info => {
						if (info.file.status === 'done') {
							const theFile = info.fileList.slice(-1)[0]
							setFileMd5(theFile.response.md5)
						}
					}}
					// onRemove={file => setFiles(files.filter(md5 => file.response.md5 != md5))}
					// onPreview={({ response }) => {
					// 	getFile({ variables: { md5: response.md5 } })
					// }}
					// defaultFileList={interclinical.files.map(({ md5, name, type }) => ({
					// 	uid: md5, name, type,
					// 	status: 'done',
					// 	response: { md5 },
					// 	url: md5
					// }))}
				>
					{ <Button icon={<UploadOutlined/>}>Seleccionar archivo</Button> }
				</Upload>
			
				<Form.Item>
					<Button htmlType="submit" type="primary">Guardar</Button>
					<Button onClick={onCancel} style={{ marginLeft: 8 }}>Cancelar</Button>
				</Form.Item>
			</Form>
		</>
	)
}

export function AgreementRateForm({
	mode,
	agreementId,
	providerId,
	onSubmit,
	onCancel,
	onRefetch
}: AgreementRateFormProps) {
	const [form] = Form.useForm<ProviderTariff>()
	const [specialties, setSpecialties] = useState<
	{ id: number; name: string; subspecialties: { id: number; name: string }[] }[]
	>([])
	const [subspecialties, setSubspecialties] = useState<{ id: number; name: string }[]>([])
	const { data } = useQuery(query.AGREEMENT_PROVIDER_SPECIALTIES, {
		skip: !providerId,
		variables: { id: Number(providerId) },
		fetchPolicy: 'network-only'
	})

	// useEffect(() => {
	// 	if (data?.provider?.medicalGroups) {
	// 		const allSpecialties = data.provider.medicalGroups.flatMap(
	// 			(group: { specialties: { id: number; name: string; subspecialties: { id: number; name: string }[] }[] }) =>
	// 				group.specialties
	// 		)
	// 		setSpecialties(allSpecialties)
	// 	}
	// }, [data])

	useEffect(() => {
		if (data?.providerWithProviderIds?.medicalGroups) {
			const allSpecialties = data.providerWithProviderIds.medicalGroups.flatMap(
				(group: {
					specialties: {
						id: number
						medicalSpecialty: { name: string }
						subspecialties: {
							id: number
							medicalSubspecialty: { name: string }
						}[]
					}[]
				}) =>
					group.specialties.map(s => ({
						id: s.id,
						name: s.medicalSpecialty.name,
						subspecialties: s.subspecialties.map(sub => ({
							id: sub.id,
							name: sub.medicalSubspecialty.name
						})),
					}))
			)
			setSpecialties(allSpecialties)
		}
	}, [data])

	const handleSpecialtyChange = (specialtyId: number) => {
		const specialty = specialties.find(s => s.id === specialtyId)
		setSubspecialties(specialty?.subspecialties || [])
		form.setFieldsValue({ providerMedicalSubspecialtyId: undefined })
	}

	const handleFinish = (values: ProviderTariff) => {
		onSubmit({
			...values,
			agreementId, // <-- Agregar agreementId
		})
		if (onRefetch) onRefetch()
	}

	return (
		<>
			<h3>{mode === 'create' ? 'Crear tarifa' : 'Editar tarifa'}</h3>
			<Form form={form} layout="vertical" onFinish={handleFinish}>
				<Form.Item
					name="providerMedicalSpecialtyId"
					label="Especialidad"
					rules={[{ required: true, message: 'Seleccione una especialidad' }]}
				>
					<Select
						options={specialties.map(s => ({ label: s.name, value: s.id }))}
						onChange={handleSpecialtyChange}
					/>
				</Form.Item>
				{subspecialties.length > 0 && (
					<Form.Item
						name="providerMedicalSubspecialtyId"
						label="Subespecialidad"
						rules={[{ required: false }]}
					>
						<Select
							options={subspecialties.map(s => ({ label: s.name, value: s.id }))}
						/>
					</Form.Item>
				)}
				<Form.Item name="currencyUMA" label="UMA">
					<InputNumber min={1} />
				</Form.Item>
				<Form.Item name="exchangeRate" label="Tipo de cambio">
					<InputNumber min={1} />
				</Form.Item>
				<Form.Item name="priceBs" label="Costo" rules={[{ required: true }]}>
					<InputNumber min={0} />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary">
                        Guardar
					</Button>
					<Button onClick={onCancel} style={{ marginLeft: 8 }}>
                        Cancelar
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}

// export function AgreementRateForm({
// 	mode,
// 	providerId,
// 	onSubmit,
// 	onCancel,
// 	onRefetch
// }: AgreementRateFormProps) {
// 	const [form] = Form.useForm<ProviderTariff>()
// 	const [specialties, setSpecialties] = useState<
// 	{ id: number; name: string; subspecialties: { id: number; name: string }[] }[]
// 	>([])
// 	const [subspecialties, setSubspecialties] = useState<{ id: number; name: string }[]>([])

// 	const { data } = useQuery(query.AGREEMENT_PROVIDER_SPECIALTIES, {
// 		skip: !providerId,
// 		variables: { id: Number(providerId) },
// 		fetchPolicy: 'network-only'
// 	})

// 	useEffect(() => {
// 		console.log('providerId:', providerId)
// 	}, [providerId])


// 	useEffect(() => {
		
// 		if (data?.provider?.medicalGroups) {
// 			const allSpecialties = data.provider.medicalGroups.flatMap((group: { specialties: { id: number; name: string; subspecialties: { id: number; name: string }[] }[] }) => group.specialties)
// 			setSpecialties(allSpecialties)
// 		}
// 	}, [data])

// 	const handleSpecialtyChange = (specialtyId: number) => {
// 		const specialty = specialties.find(s => s.id === specialtyId)
// 		setSubspecialties(specialty?.subspecialties || [])
// 		form.setFieldsValue({ providerMedicalSubspecialtyId: undefined })
// 	}

// 	const handleFinish = (values: ProviderTariff) => {
// 		onSubmit(values)
// 		if (onRefetch) onRefetch()
// 	}

// 	return (
// 		<>
// 			<h3>{mode === 'create' ? 'Crear tarifa' : 'Editar tarifa'}</h3>
// 			<Form form={form} layout="vertical" onFinish={handleFinish}>
// 				<Form.Item
// 					name="providerMedicalSpecialtyId"
// 					label="Especialidad"
// 					rules={[{ required: true, message: 'Seleccione una especialidad' }]}
// 				>
// 					<Select
// 						options={specialties.map(s => ({ label: s.name, value: s.id }))}
// 						onChange={handleSpecialtyChange}
// 					/>
// 				</Form.Item>
// 				{subspecialties.length > 0 && (
// 					<Form.Item
// 						name="providerMedicalSubspecialtyId"
// 						label="Subespecialidad"
// 						rules={[{ required: false }]}
// 					>
// 						<Select
// 							options={subspecialties.map(s => ({ label: s.name, value: s.id }))}
// 						/>
// 					</Form.Item>
// 				)}
// 				<Form.Item name="currencyUMA" label="UMA">
// 					<InputNumber min={1} />
// 				</Form.Item>
// 				<Form.Item name="exchangeRate" label="Tipo de cambio">
// 					<InputNumber min={1} />
// 				</Form.Item>
// 				<Form.Item name="priceBs" label="Costo" rules={[{ required: true }]}>
// 					<InputNumber min={0} />
// 				</Form.Item>
// 				<Form.Item>
// 					<Button htmlType="submit" type="primary">
//             Guardar
// 					</Button>
// 					<Button onClick={onCancel} style={{ marginLeft: 8 }}>
//             Cancelar
// 					</Button>
// 				</Form.Item>
// 			</Form>
// 		</>
// 	)
// }
