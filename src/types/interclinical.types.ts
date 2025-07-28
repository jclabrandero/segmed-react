import { Provider } from '.'

export type InterclinicalCost = {
	id: number
	invoiceDate: Date
	
	status:	number
	closed: boolean

	provider:	Provider
}

export type InterclinicalCostItem = {
	id: number
	interclinicalId: number
	sesionDate?: Date

	status: number
}
