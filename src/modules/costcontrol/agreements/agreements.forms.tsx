import { Button, Form, Input, InputNumber, Select, Switch, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { AgreementFormProps, AgreementRateFormProps } from './agreements.types'
import { ProviderAgreement, ProviderTariff } from './costcontrol.types'
import { getAuth } from '../../../utils'
import { UploadOutlined } from '@ant-design/icons'

export function AgreementForm({
	mode,
	data,
	dependencies,
	onSubmit,
	onCancel,
}: AgreementFormProps) {
	const [form] = Form.useForm<ProviderAgreement>()
		, { sessionId, token } = getAuth()

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
					<Select options={dependencies?.providers.map(p => ({ label: p.businessName, value: p.id }))} />
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
	data,
	dependencies,
	onSubmit,
	onCancel,
	onRefetch,
}: AgreementRateFormProps) {
	const [form] = Form.useForm<ProviderTariff>()

	useEffect(() => {
		if (data) form.setFieldsValue(data)
	}, [data, form])

	const handleFinish = (values: Partial<ProviderTariff>) => {
		onSubmit(values)
		if (onRefetch) onRefetch()
	}

	return (
		<>
			<h3>{mode === 'create' ? 'Crear tarifa' : 'Editar tarifa'}</h3>
			<Form form={form} layout="vertical" onFinish={handleFinish}>
				<Form.Item name="medicalSpecialtyId" label="Especialidad" rules={[{ required: true }]}>
					<Select options={dependencies.medicalSpecialties.map(s => ({ label: s.name, value: s.id }))} />
				</Form.Item>
				<Form.Item name="medicalSubspecialtyId" label="Subespecialidad">
					<Select options={dependencies.medicalSubspecialties.map(s => ({ label: s.name, value: s.id }))} />
				</Form.Item>
				<Form.Item name="currencyUMA" label="UMA" valuePropName="checked">
					<Switch />
				</Form.Item>
				<Form.Item name="exchangerate" label="Tipo de cambio">
					<InputNumber min={0} />
				</Form.Item>
				<Form.Item name="cost" label="Costo" rules={[{ required: true }]}>
					<InputNumber min={0} />
				</Form.Item>
				<Form.Item name="status" label="Activo" valuePropName="checked">
					<Switch />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary">Guardar</Button>
					<Button onClick={onCancel} style={{ marginLeft: 8 }}>Cancelar</Button>
				</Form.Item>
			</Form>
		</>
	)
}
