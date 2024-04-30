
import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions, PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'

import './pdf-viewer.css'


type PdfViewerProps = {
	base64:	string
}

function usePdfViewer(props: PdfViewerProps) {
	const mainRef = useRef<HTMLDivElement>(null)
		, [ proxy, setProxy ] = useState<PDFDocumentProxy | null>(null)

	const base64ToArrayBuffer = (base64: string) => {
			const binaryString = atob(base64)
				, bytes = new Uint8Array(binaryString.length)
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i)
			}
			return bytes.buffer
		}
		, load = async (task: PDFDocumentLoadingTask) => {
			const pdf = await task.promise
			setProxy(pdf)
		}
		, getScale = async (pdfProxy: PDFDocumentProxy) => {
			const page = await pdfProxy.getPage(1)
			let scale = 1.5
			let viewport = page.getViewport({ scale })

			while (viewport.width > window.innerWidth) {
				scale -= 0.1
				viewport = page.getViewport({ scale })
			}

			return scale
		}
		, renderPage = async (pdfProxy: PDFDocumentProxy, canvas: HTMLCanvasElement, pageIndex: number, scale: number) => {
			const page = await pdfProxy.getPage(pageIndex)
			const outputScale = window.devicePixelRatio || 1

			const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
			const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined
			const viewport = page.getViewport({ scale })

			canvas.width = Math.floor(viewport.width * outputScale)
			canvas.height = Math.floor(viewport.height * outputScale)
			canvas.style.width = Math.floor(viewport.width) + 'px'
			canvas.style.height = Math.floor(viewport.height) + 'px'

			page.render({ canvasContext, transform, viewport })
		}
		, render = async (pdfProxy: PDFDocumentProxy, children: NodeListOf<ChildNode>) => {
			const scale = await getScale(pdfProxy)

			children.forEach((canvas, i: number) => {
				renderPage(pdfProxy, canvas as HTMLCanvasElement, i + 1, scale )
			})
		}

	useEffect(() => {
		GlobalWorkerOptions.workerSrc = import.meta.env.VITE_PDFJS_WORKER_SRC
		load(getDocument(base64ToArrayBuffer(props.base64)))
	}, [props.base64])

	useEffect(() => {
		if (mainRef.current && proxy) {
			render(proxy, mainRef.current.childNodes)
		}
	})

	return { mainRef, proxy }
}


export function PdfViewer(props: PdfViewerProps) {
	const { mainRef, proxy } = usePdfViewer(props)

	return (
		<div className='pdf-viewer' ref={ mainRef }>
			{
				proxy && [ ...Array(proxy._pdfInfo.numPages) ].map((_, i) => (
					<canvas key={i}></canvas>
				))
			}
		</div>
	)
}
