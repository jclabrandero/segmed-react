
import { useEffect, useState, ReactNode } from 'react'
import { DocumentNode, useLazyQuery, useMutation } from '@apollo/client'
import { Button, Modal } from 'antd'
import { DeleteFilled } from '@ant-design/icons'

import { ErrorDialog, Loader } from '../'
import { useError } from '../../hooks'


type DeleteDialogProps<TDeleteArgs> = {
	id:			number
	title:		string
	icon?:			ReactNode
	render?:		(record: TDeleteArgs) => React.ReactNode
	renderExt?: (record: TDeleteArgs) => React.ReactNode
	query:		DocumentNode
	mutation:	DocumentNode
	removeData?:		object
	confirmButtonText?: string
}

export function DeleteDialog<T>({ id, title, icon, render, renderExt, query, mutation, removeData, confirmButtonText }: DeleteDialogProps<T>) {
	const [ open, setOpen ] = useState(false)
		, [ error, onError ] = useError()
	const close = () => setOpen(false)
	const [ get, { loading, data }] = useLazyQuery(query, { onError, fetchPolicy: 'no-cache' })
		, [ remove, { loading: deleting } ] = useMutation(mutation, { onCompleted: close, onError })
	const FinalIcon = icon || <DeleteFilled/>

	useEffect(() => data && setOpen(true), [data])

	return (
		<>
			<Button
				shape='circle'
				type='text'
				size='small'
				className='table-toolbtn-danger'
				icon={FinalIcon}
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
						<Button type='primary' danger onClick={() => removeData ? remove({ variables: { id, data: removeData }}) : remove({ variables: { id }})}>
							{ confirmButtonText || 'Eliminar' }
						</Button>
					</>
				)}
			>
				{
					render && <p>Confirme para eliminar {data && render(data)}</p>
				}
				{
					renderExt && <p>{data && renderExt(data)}</p>
				}
			</Modal>
			<Loader show={loading || deleting}/>
			<ErrorDialog error={error}/>
		</>
	)
}
