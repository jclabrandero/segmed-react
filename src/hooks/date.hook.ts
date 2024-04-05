
import { format } from 'date-fns'


export function useDate() {
	return {
		format: (value: number, formatString = 'dd/MM/yyyy HH:mm:ss') => {
			if (!value) return ''
			return format(value, formatString)
		}
	}
}
