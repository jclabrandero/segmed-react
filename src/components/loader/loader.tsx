
import { useDialog } from '../../hooks'
import './loader.css'


type LoaderProps = {
	show: boolean
}

export function Loader(props: LoaderProps = { show: true }) {
	const [ dialogRef ] = useDialog(props.show)

	return (
		<dialog ref={ dialogRef } className='loader-dialog'>
			<div className='loader'><div></div><div></div><div></div></div>
		</dialog>
	)
}
