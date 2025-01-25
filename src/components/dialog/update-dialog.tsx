
import { ReactNode, useEffect, useState } from 'react'
import { DocumentNode, useLazyQuery, useMutation } from '@apollo/client'
import { Button,  Modal } from 'antd'
import { EditFilled } from '@ant-design/icons'

import { ErrorDialog, Loader } from '../../components'
import { useError } from '../../hooks'


type UpdateDialogProps<TUpdateArgs, TDependencies> = {
	id:			number
	title:		string
	render:		(submit: (args: TUpdateArgs) => void, close: () => void, data: TDependencies, refetch: () => void) => React.ReactNode
	query:		DocumentNode
	mutation:	DocumentNode
	size?:		'small' | 'large'
	icon?:		ReactNode
	options?:	object
}

export function UpdateDialog<TUpdateArgs, TDependencies>({ id, title, query, mutation, render, size, icon, options }: UpdateDialogProps<TUpdateArgs, TDependencies>) {
	const [ open, setOpen ] = useState(false)
		, [ error, onError ] = useError()
	const close = () => setOpen(false)
	const [ get, { loading, data, refetch }] = useLazyQuery(query, { onError, fetchPolicy: 'no-cache' })
	const [ update, { loading: updateting } ] = useMutation(mutation, { onCompleted: close, onError })
	const submit = (data: TUpdateArgs) => update({ variables: { id, data }})
	const FinalIcon = icon || <EditFilled/>

	useEffect(() => data && setOpen(true), [data])

	return (
		<>
			{
				size && size == 'large'
					? <Button type='primary' shape='round' icon={FinalIcon} onClick={() => get({ variables: { id, ...options } })}>
						{title}
					</Button>
					: <Button
						shape='circle'
						type='text'
						size='small'
						className='table-toolbtn'
						icon={FinalIcon}
						onClick={() => get({ variables: { id, ...options } })}/>
			}
			<Modal
				className='modal-dialog'
				title={title}
				open={open}
				centered
				destroyOnClose
				onCancel={close}
			>
				{ data && render(submit, close, data, () => refetch()) }
			</Modal>

			<Loader show={loading || updateting}/>
			<ErrorDialog error={error}/>
		</>
	)
}
