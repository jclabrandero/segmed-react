
import { Tag } from 'antd'

enum Status {
	Removed = -1,
	Idle = 0,
	Active = 1,
	Pending = 2
}


export function formatStatus(val: number) {
	switch(val) {
		case Status.Removed: return { label: 'Eliminado', color: 'red' }
		case Status.Idle: return { label: 'Inactivo', color: 'orange' }
		case Status.Active: return { label: 'Activo', color: 'green' }
		case Status.Pending: return { label: 'Pediente', color: 'gray' }
		default: return { label: 'Desconocido', color: 'purple' }
	}
}

export function tableStatus(record: { status: number }) {
	const e = formatStatus(record.status)
	return (<Tag color={ e.color }>{ e.label }</Tag>)
}
