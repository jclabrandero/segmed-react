
import { useEffect, useState } from 'react'
import { DocumentNode, useLazyQuery, useMutation } from '@apollo/client'
import { Button,  Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { ErrorDialog, Loader } from '../../components'
import { useError } from '../../hooks'


type CreateDialogWithoutDependenciesProps<TCreateArgs> = {
	title:			string
	buttonText?:	string
	render:			(submit: (args: TCreateArgs) => void, close: () => void) => React.ReactNode
	mutation:		DocumentNode
}

type CreateDialogWithDependenciesProps<TCreateArgs, TDependencies> = {
	title:			string
	buttonText?:	string
	render:			(submit: (args: TCreateArgs) => void, close: () => void, data: TDependencies, refetch: () => void) => React.ReactNode
	query:			DocumentNode
	mutation:		DocumentNode
	options?:		object
}

function CreateDialogWithoutDependencies<TCreateArgs>(
	{ title, buttonText, mutation, render }: CreateDialogWithoutDependenciesProps<TCreateArgs>) {
	const [ open, setOpen ] = useState(false)
		, [ error, onError ] = useError()
	const close = () => setOpen(false)
	const [ create, { loading: creating } ] = useMutation(mutation, { onCompleted: close, onError })
	const submit = (data: TCreateArgs) => create({ variables: { data }})

	return (
		<>
			<Button type='primary' shape='round' icon={<PlusOutlined/>} onClick={() => setOpen(true)}>
				{buttonText || title}
			</Button>
			<Modal
				className='modal-dialog'
				title={title}
				open={open}
				centered
				destroyOnClose
				onCancel={close}
				footer={() => null}
			>
				{ render(submit, close) }
			</Modal>
			<Loader show={creating}/>
			<ErrorDialog error={error}/>
		</>
	)
}

function CreateDialogWithDependencies<TCreateArgs, TDependencies = object>(
	{ title, buttonText, query, mutation, render, options }: CreateDialogWithDependenciesProps<TCreateArgs, TDependencies>) {
	const [ open, setOpen ] = useState(false)
		, [ error, onError ] = useError()
	const close = () => setOpen(false)
	const [ get, { loading, data, refetch }] = useLazyQuery(query, { onError, fetchPolicy: 'no-cache' })
	const [ create, { loading: creating } ] = useMutation(mutation, { onCompleted: close, onError })
	const submit = (data: TCreateArgs) => create({ variables: { data }})

	useEffect(() => data && setOpen(true), [data])

	return (
		<>
			<Button type='primary' shape='round' icon={<PlusOutlined/>} onClick={() => get(options)}>
				{buttonText || title}
			</Button>
			<Modal
				className='modal-dialog'
				title={title}
				open={open}
				centered
				destroyOnClose
				onCancel={close}
				footer={() => null}
			>
				{ data && render(submit, close, data, () => refetch()) }
			</Modal>
			<Loader show={loading || creating}/>
			<ErrorDialog error={error}/>
		</>
	)
}


type CreateDialogProps<TCreateArgs, TDependencies> = {
	title:			string
	buttonText?:	string
	render:			(submit: (args: TCreateArgs) => void, close: () => void, data: TDependencies, refetch: () => void) => React.ReactNode
	query?:			DocumentNode
	options?:		object
	mutation:		DocumentNode
}

export function CreateDialog<TCreateArgs, TDependencies = object>(props: CreateDialogProps<TCreateArgs, TDependencies>) {
	return props.query
		? (<CreateDialogWithDependencies {...props as CreateDialogWithDependenciesProps<TCreateArgs, TDependencies>}/>)
		: (<CreateDialogWithoutDependencies {...props as CreateDialogWithoutDependenciesProps<TCreateArgs>}/>)
}
