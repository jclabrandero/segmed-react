
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
				<button className="btn" type="button" onClick={ onCancel } style={{ position: 'absolute', top: '50px', right: '200px', zIndex: 1 }}>
					<CloseOutlined/>
				</button>
			</div>
			<div className="wrapper">
				{
					file && file.info.type == 'application/pdf' &&
					<embed src={`data:application/pdf;base64,${file.data}`} type="application/pdf" width="100%" height="600px" />
					//<PdfViewer base64={ file.data }/>
				}
			</div>
		</div>
	) : null
}
