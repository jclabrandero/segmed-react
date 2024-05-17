

import { ReactNode, useEffect, useState } from 'react'
import { DocumentNode, useLazyQuery } from '@apollo/client'
import { Button,  Modal } from 'antd'
import { EyeTwoTone } from '@ant-design/icons'

import { ErrorDialog, Loader } from '../../components'
import { useError } from '../../hooks'


type InspectDialogProps<TDependencies> = {
	id:			number
	title:		string
	render:		(data: TDependencies) => React.ReactNode
	query:		DocumentNode
	size?:		'small' | 'large'
	icon?:		ReactNode
}

export function InspectDialog<TDependencies>({ id, title, query, render, size, icon }: InspectDialogProps<TDependencies>) {
	const [ open, setOpen ] = useState(false)
	const [ error, onError ] = useError()
	const [ get, { loading, data }] = useLazyQuery(query, { onError, fetchPolicy: 'no-cache' })
	const close = () => setOpen(false)
	useEffect(() => data && setOpen(true), [data])
	const FinalIcon = icon || <EyeTwoTone/>

	return (
		<>
			{
				size && size == 'large'
					? <Button type='primary' shape='round' icon={FinalIcon} onClick={() => get({ variables: { id } })}>
						{title}
					</Button>
					: <Button
						shape='circle'
						type='text'
						size='small'
						className='table-toolbtn'
						icon={FinalIcon}
						onClick={() => get({ variables: { id } })}/>
			}
			<Modal
				title={title}
				open={open}
				centered
				destroyOnClose
				onCancel={close}
				footer={() => (
					<>
						<Button type='default' onClick={close}>Cancelar</Button>
						<Button type='primary' onClick={close}>Aceptar</Button>
					</>
				)}
			>
				{ data && render(data) }
			</Modal>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
