
import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Button, Form, FormInstance, Input, Select, Spin, Space, TreeSelect, Upload } from 'antd'
import { CheckOutlined, PrinterFilled, FolderOpenFilled, UploadOutlined } from '@ant-design/icons'

import { CreateDialog, DeleteDialog, Loader, ModalFileViewer, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { Belonging, FileBase64, Interclinical, MedicalGroup, Provider, ClinicCareId, UpdateProps } from '../../../types'
import { getAuth } from '../../../utils'

import { query, mutation } from './inter-clinical.constant'


const encodeTree = (medicalGroup: MedicalGroup | undefined) => {
	return medicalGroup ? medicalGroup.specialties.map(em => ({
		title: em.name, value: JSON.stringify([em.id]),
		children: em.subspecialties.map(sm => ({
			title: sm.name, value: JSON.stringify([em.id, sm.id])
		}))
	})) : []
}
const decodeTree = (dataset: Array<string>) => {
	let specialties: Array<{
		medicalSpecialtyId: number
		subspecialties: Array<number>
	}> = []
	for (const iterator of dataset) {
		const path: Array<number> = JSON.parse(iterator)
		const exists = specialties.find(e => e.medicalSpecialtyId == path[0])
		if (exists) {
			path[1] && exists.subspecialties.push(path[1])
		} else {
			specialties = [ ...specialties, {
				medicalSpecialtyId: path[0], subspecialties: path[1] ? [path[1]] : []
			}]
		}
	}
	return specialties
}

type InterclinicalSpecialtiesProps = {
	providerId:		number
	medicalGroupId:	number
	onCancel:		() => void
}

function InterclinicalSpecialties({ providerId, medicalGroupId, onCancel }: InterclinicalSpecialtiesProps) {
	const { loading, data } = useQuery(query.PROVIDER, { variables: { id: providerId }, fetchPolicy: 'network-only' })
	const provider: Provider = data?.provider
	const medicalGroup = provider?.medicalGroups.find(um => um.id == medicalGroupId)
	const tree = encodeTree(medicalGroup)

	return loading ? <Spin/> : (
		<>
			<Form.Item name='specialties'
				label='Detalle de especialidades y sub-especialidades'
				rules={[{ required: true, message: 'Seleccione especialidades o sub-especialidades' }]}>
				<TreeSelect treeCheckable={true} treeData={tree}/>
			</Form.Item>
			<Form.Item name='remark'
				label='Observaciones'
				rules={[{ required: true, message: 'Escriba las observaciones' }]}>
				<Input.TextArea/>
			</Form.Item>

			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</>
	)
}

type InterclinicalProviderProps = {
	form:			FormInstance
	belongingId:	number
	medicalGroupId:	number
	onCancel: () => void
}

function InterclinicalProvider({ form, belongingId, medicalGroupId, onCancel }: InterclinicalProviderProps) {
	const [ providerId, setProviderId ] = useState(0)
		, { loading, data } = useQuery(query.PROVIDERS, { variables: { query: { belongingId, medicalGroupId } }, fetchPolicy: 'network-only' })
		, { map, toLV } = useAntdHelp()
	const filter = (inputValue: string, option: { label: string } | undefined) => option?.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
	const onSetProviderId = (value: number) => {
		setProviderId(value)
		form.resetFields(['specialties'])
	}
	useEffect(() => {
		setProviderId(0)
		form.resetFields(['providerId', 'specialties'])
	}, [form, belongingId, medicalGroupId])

	return loading ? <Spin/> : (
		<>
			<Form.Item name='providerId' label='Proveedor'>
				<Select options={map(data.providers, toLV)}
					filterOption={filter}
					showSearch={true}
					onSelect={onSetProviderId}
					autoClearSearchValue={true}
				/>
			</Form.Item>
			{ (providerId != 0) && <InterclinicalSpecialties providerId={providerId} medicalGroupId={medicalGroupId} onCancel={onCancel}/> }
		</>
	)
}

interface IInterclinicalCreateArgs {
	clinicCareId:	number
	medicalGroupId:	number
	providerId:		number
	specialties:	Array<{
		medicalSpecialtyId:	number
		subspecialties:		Array<number>
	}>
	remark:			string
}

interface IInterclinicalDependencies {
	belongings:		Array<Belonging>
	medicalGroups:	Array<MedicalGroup>
}

type InterclinicalFormProps = {
	data: IInterclinicalDependencies & ClinicCareId
	onSubmit: (data: IInterclinicalCreateArgs) => void
	onCancel: () => void
}

function InterclinicalForm({ data, onSubmit, onCancel }: InterclinicalFormProps) {
	const { Item } = Form
		, [ form ] = Form.useForm()
		, { map, toLV, touched } = useAntdHelp()
		, [ belongingId, setBelongingId ] = useState(0)
		, [ medicalGroupId, setMedicalGroupId ] = useState(0)
	const onFinish = () => {
		const { specialties, ...remaining } = touched(form)
		onSubmit({ ...remaining, clinicCareId: data.clinicCareId, specialties: decodeTree(specialties) })
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish}>
			<Item label='Pertinencia' style={{ width: '60%' }}>
				<Select
					options={map(data.belongings, toLV)}
					onChange={value => setBelongingId(value)}/>
			</Item>
			<Item name='medicalGroupId' label='Unidad Medica' style={{ width: '60%' }}>
				<Select
					options={map(data.medicalGroups, toLV)}
					onChange={value => setMedicalGroupId(value)}/>
			</Item>
			{
				(belongingId != 0) && (medicalGroupId != 0) &&
				<InterclinicalProvider form={form} belongingId={belongingId} medicalGroupId={medicalGroupId} onCancel={onCancel}/>
			}
		</Form>
	)
}

export function CreateInterclinical({ clinicCareId }: ClinicCareId) {
	return (
		<CreateDialog<IInterclinicalCreateArgs, IInterclinicalDependencies>
			title='Agregar interconsulta'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_INTERCLINICAL}
			render={(submit, close, data) => <InterclinicalForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}


interface IInterclinicalUpdateArgs {
	clinicCareId:	number
	remark?:		string
	approvedState?:	number
	files?:			Array<string>
}

type InterclinicalUpdateFormProps = {
	data: {
		interclinical: Interclinical
		clinicCareId: number
	}
	onSubmit: (data: IInterclinicalUpdateArgs) => void
	onCancel: () => void
}

function InterclinicalUpdateForm({ data, onSubmit, onCancel }: InterclinicalUpdateFormProps) {
	const { Item } = Form
		, [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit({ ...touched(form), clinicCareId: data.clinicCareId })

	return (
		<Form form={form} layout='vertical'
			initialValues={{
				remark: data.interclinical?.remark
			}}
			onFinish={onFinish}
		>
			<Item name='remark' label='Observaciones' rules={[{ required: true, message: 'Escriba las observaciones' }]}>
				<Input.TextArea />
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

export function UpdateInterclinical({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<UpdateDialog<IInterclinicalUpdateArgs, { interclinical: Interclinical }>
			id={id}
			title='Editar interconsulta'
			query={query.INTERCLINICAL}
			mutation={mutation.UPDATE_INTERCLINICAL}
			render={(submit, close, data) => <InterclinicalUpdateForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteInterclinical({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<DeleteDialog<{ interclinical: Interclinical }>
			id={id}
			title='Eliminar interconsulta'
			render={({ interclinical }) => `la interconsulta: ${interclinical.id}`}
			query={query.INTERCLINICAL}
			mutation={mutation.DELETE_INTERCLINICAL}
			removeData={{ clinicCareId }}
		/>
	)
}

export function ConfirmInterclinical({ id, clinicCareId, approvedState }: UpdateProps & ClinicCareId & { approvedState: number }) {
	return (
		<UpdateDialog<IInterclinicalUpdateArgs, { interclinical: Interclinical }>
			id={id}
			title='Confirmar interconsulta'
			query={query.INTERCLINICAL}
			mutation={mutation.UPDATE_INTERCLINICAL}
			icon={<CheckOutlined/>}
			render={(submit, close) => (
				<Form layout='vertical' onFinish={() => submit({ clinicCareId, approvedState })}>
					<p>Está seguro de confirmar la interconsulta "{ id }"?</p>
					<div className='modal-dialog-footer'>
						<Space>
							<Button type='default' onClick={close}>Cancelar</Button>
							<Button type='primary' htmlType='submit'>Aceptar</Button>
						</Space>
					</div>
				</Form>
			)}
		/>
	)
}

function UploadFileInterclinicalForm({ data: { clinicCareId, interclinical }, onSubmit, onCancel, disabled }: InterclinicalUpdateFormProps & { disabled: boolean }) {
	const [ files, setFiles ] = useState<Array<string>>(interclinical.files.map(({ md5 }) => md5))
		, [ previewFile, setPreviewFile ] = useState<FileBase64 | null>(null)
		, { sessionId, token } = getAuth()

	const onLoadFile = ({ downloadFile }: { downloadFile: FileBase64 }) => setPreviewFile(downloadFile)
	const [ getFile, { loading }] = useLazyQuery(query.INTERCLINICAL_FILE, { onCompleted: onLoadFile, fetchPolicy: 'no-cache' })

	return (
		<Form layout='vertical' onFinish={() => onSubmit({ clinicCareId, files })}>
			<Upload
				name="file"
				listType="picture"
				action={import.meta.env.VITE_FILE_UPLOAD_URI}
				headers={{
					authorization: `${sessionId} ${ token }`
				}}
				onChange={info => {
					if (info.file.status === 'done') {
						setFiles(info.fileList.map(file => file.response.md5))
					}
				}}
				onRemove={file => setFiles(files.filter(md5 => file.response.md5 != md5))}
				onPreview={({ response }) => {
					getFile({ variables: { md5: response.md5 } })
				}}
				disabled={disabled}
				defaultFileList={interclinical.files.map(({ md5, name, type }) => ({
					uid: md5, name, type,
					status: 'done',
					response: { md5 },
					url: md5
				}))}
			>
				{ !disabled && <Button icon={<UploadOutlined/>}>Seleccionar archivo</Button> }
			</Upload>
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>

			<ModalFileViewer open={previewFile != null} file={previewFile} onCancel={() => setPreviewFile(null)}/>
			<Loader show={loading}/>
		</Form>
	)
}

export function UploadFileInterclinical({ id, clinicCareId, disabled = false }: UpdateProps & ClinicCareId & { disabled?: boolean }) {
	return (
		<UpdateDialog<IInterclinicalUpdateArgs, { interclinical: Interclinical }>
			id={id}
			title='Archivos de la interconsulta'
			query={query.INTERCLINICAL}
			mutation={mutation.UPDATE_INTERCLINICAL}
			icon={<FolderOpenFilled/>}
			render={(submit, close, data) => <UploadFileInterclinicalForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close} disabled={disabled}/>}
		/>
	)
}

export function PrintInterclinical({ id }: { id: number }) {
	const [ previewFile, setPreviewFile ] = useState<FileBase64 | null>(null)
	const onLoadFile = ({ file }: { file: FileBase64 }) => setPreviewFile(file)
		, [ print, { loading } ] = useMutation(mutation.PRINT_INTERCLINICAL, { onCompleted: onLoadFile })

	return (
		<>
			<Button
				shape='circle'
				type='text'
				size='small'
				className='table-toolbtn'
				icon={<PrinterFilled/>}
				onClick={() => print({ variables: { id } })}/>

			<ModalFileViewer open={previewFile != null} file={previewFile} onCancel={() => setPreviewFile(null)}/>
			<Loader show={loading}/>
		</>
	)
}
