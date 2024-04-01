
import { FormInstance } from 'antd'

import { tableStatus } from './table-fields'


export function useAntdHelp() {
	return {
		addKey: <T = object>(dataset?: Array<T & { id: number }>) => {
			return dataset
				? dataset.map(c => ({ ...c, key: String(c.id) })) as Array<T>
				: [] as Array<T>
		},
		tableStatus,
		touched: (form: FormInstance) => form.getFieldsValue({ filter: (meta) => meta.touched }),
	}
}
