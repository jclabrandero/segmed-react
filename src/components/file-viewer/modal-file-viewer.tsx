
import { CloseOutlined } from '@ant-design/icons'

import { PdfViewer } from '..'
import { FileBase64 } from '../../types'

import './modal-file-viewer.css'


type FileViewerProps = {
	file: FileBase64 | null
	onCancel?: () => void
}

type ModalFileViewerProps = FileViewerProps & {
	open: boolean
}

export function ModalFileViewer({ open, file, onCancel }: ModalFileViewerProps) {

	return open ? (
		<div className="modal-file-viewer">
			<div className="tools">
				<button className="btn" type="button" onClick={ onCancel }>
					<CloseOutlined/>
				</button>
			</div>
			<div className="wrapper">
				{
					file && file.info.type == 'application/pdf' &&
					<PdfViewer base64={ file.data }/>
				}
			</div>
		</div>
	) : null
}
