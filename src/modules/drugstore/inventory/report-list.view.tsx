import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { PrinterFilled } from '@ant-design/icons'

import { Button, Space, Table } from 'antd'
import { FileBase64 } from '../../../types'
import { Loader, ModalFileViewer } from '../../../components'

import { mutation } from './inventory.constant'

export function PrintReport1({ reportId, pharmacyId }: { reportId: number, pharmacyId: number }) {
	const [ previewFile, setPreviewFile ] = useState<FileBase64 | null>(null)
	const onLoadFile = ({ file }: { file: FileBase64 }) => setPreviewFile(file)
		, [ print, { loading } ] = useMutation(mutation.PRINT_REPORT, { onCompleted: onLoadFile })

	console.log(reportId)

	return (
		<>
			<Button
				shape='round'
				type='primary'
				icon={<PrinterFilled/>}
				onClick={() => print({ variables: { data: { reportId, pharmacyId } } })}/>

			<ModalFileViewer open={previewFile != null} file={previewFile} onCancel={() => setPreviewFile(null)}/>
			<Loader show={loading}/>
		</>
	)
}

export function ReportList({ pharmacyId }: { pharmacyId: number }) {
	const { Column } = Table
	const data = [
		{ id: 1, key: 1, name: 'Reporte de cierre mensual medicamentos' },
		{ id: 2, key: 2, name: 'Reporte de cierre mensual insumos' }
	]

	return (
		<Table
			size='middle'
			dataSource={data}
			bordered={ true }
			pagination={{ pageSize: 15 }}
			scroll={{ x: true }}
		>
			<Column title='Id' dataIndex='id'/>
			<Column title='Nombre del reporte' dataIndex='name' ellipsis/>
			<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
				<Space>
					<PrintReport1 pharmacyId={pharmacyId} reportId={id}/>
				</Space>
			)}/>
		</Table>
	)
}
