
import { useState } from 'react'


export function useFilter<TData extends object>(
	dataset: Array<TData>,
	fields: Array<string>,
	resolvers: Array<(record: TData) => TData[keyof TData] | string | number> = []
): [ Array<TData>, (query: string) => void ] {

	const [ filterText, setFilterText ] = useState('')
	const filter = (query: string) => setFilterText(query.toLowerCase())

	if (dataset.length === 0) return [dataset, filter]

	const newDataset: TData[] = dataset.filter((record: TData) => {
		const evaluator = (value: TData[keyof TData] | string | number | undefined) => {
			if (typeof value === 'string') return value.toLowerCase().includes(filterText)
			if (typeof value === 'number') return value.toString().includes(filterText)
			return false
		}
		const getValue = <T>(key: string, obj: T): string | number | undefined => {
			return key.split('.').reduce<string | number | undefined>((acc, part) => {
				if (acc && typeof acc === 'object' && part in acc) {
					return (acc as Record<string, unknown>)[part] as string | number | undefined
				}
				return undefined
			}, obj as unknown as string | number | undefined)
		}
		return fields.some(field => evaluator(getValue(field, record))) || resolvers.some(func => evaluator(func(record)))
	})
	return [newDataset, filter]
}