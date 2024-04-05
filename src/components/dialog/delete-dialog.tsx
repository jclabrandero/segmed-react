
import { useEffect, useState } from 'react'
import { DocumentNode, useLazyQuery, useMutation } from '@apollo/client'
import { Button, Modal } from 'antd'
import { DeleteFilled } from '@ant-design/icons'

import { ErrorDialog, Loader } from '../'
import { useError } from '../../hooks'


type DeleteDialogProps<TDeleteArgs> = {
	id:			number
	title:		string
	render:		(record: TDeleteArgs) => React.ReactNode
	query:		DocumentNode
	mutation:	DocumentNode
}

export function DeleteDialog<T>({ id, title, render, query, mutation }: DeleteDialogProps<T>) {
	const [ open, setOpen ] = useState(false)
		, [ error, onError ] = useError()
	const close = () => setOpen(false)
	const [ get, { loading, data }] = useLazyQuery(query, { onError, fetchPolicy: 'no-cache' })
		, [ remove, { loading: deleting } ] = useMutation(mutation, { onCompleted: close, onError })

	useEffect(() => data && setOpen(true), [data])

	return (
		<>
			<Button
				shape='circle'
				type='text'
				size='small'
				className='table-toolbtn-danger'
				icon={<DeleteFilled/>}
				onClick={() => get({ variables: { id } })}/>
			<Modal
				title={title}
				open={open}
				centered
				destroyOnClose
				onCancel={close}
				footer={() => (
					<>
						<Button type='default' onClick={close}>Cancelar</Button>
						<Button type='primary' danger onClick={() => remove({ variables: { id }})}>Eliminar</Button>
					</>
				)}
			>
				<p>Confirme para eliminar {data && render(data)}</p>
			</Modal>
			<Loader show={loading || deleting}/>
			<ErrorDialog error={error}/>
		</>
	)
}
