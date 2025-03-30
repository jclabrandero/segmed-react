
import { gql } from '@apollo/client'


export const query = {
	INVENTORIES: gql`
		query inventories($pharmacyId: Int!) {
			inventories(pharmacyId: $pharmacyId) {
				id stock price min status
				medication {
					id code name concentration
					unit {
						id name
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`,
	ARRIVALS: gql`
		query arrivals($pharmacyId: Int!) {
			arrivals(pharmacyId: $pharmacyId) {
				id remark arrivalDate invoiceNumber invoiceAuthorizationCode invoiceControlCode invoiceTotalRefPrice
				total approvalState closed status
				provider { businessName nit }
			}
		}
	`,
	ARRIVAL: gql`
		query arrival($id: Int!) {
			arrival(id: $id) {
				id remark arrivalDate invoiceNumber invoiceAuthorizationCode invoiceControlCode invoiceTotalRefPrice
				total approvalState status
				provider { businessName nit }
			}
		}
	`,
	ARRIVAL_ITEMS: gql`
		query arrivalItems($arrivalId: Int!) {
			arrivalItems(arrivalId: $arrivalId) {
				id quantity price total
				batch {
					id code expireAt
					medication {
						id code name concentration
						unit {
							id name
							__typename @skip(if: true)
						}
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`,
	ARRIVAL_ITEM: gql`
		query arrivalItem($id: Int!) {
			arrivalItem(id: $id) {
				id quantity price
				batch {
					id code expireAt
					medication {
						id code name concentration
						unit {
							id name
							__typename @skip(if: true)
						}
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`,
	CREATE_ARRIVAL_DEPENDENCIES: gql`
		query providers($query: IProviderFilterArgs!) {
			providers: activeProviders(query: $query) {
				id businessName nit
			}
		}
	`,
	UPDATE_ARRIVAL_DEPENDENCIES: gql`
		query dependencies($id: Int!, $query: IProviderFilterArgs!) {
			providers: activeProviders(query: $query) {
				id businessName nit
			}
			arrival(id: $id) {
				id remark arrivalDate invoiceNumber invoiceAuthorizationCode invoiceControlCode invoiceTotalRefPrice
				provider { id }
			}
		}
	`,
	CREATE_ARRIVAL_ITEM_DEPENDENCIES: gql`
		query dependencies {
			batches {
				id code expireAt status
				medication {
					id code name concentration
					unit {
						id name
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`,
	UPDATE_ARRIVAL_ITEM_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			batches {
				id code expireAt status
				medication {
					id code name concentration
					unit {
						id name
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
			arrivalItem(id: $id) {
				id quantity price
				batch {
					id code
					medication {
						id code name concentration
						unit {
							id name
							__typename @skip(if: true)
						}
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`,
	BATCHES_STOCK: gql`
		query batchesStocks($data: IBatchStockArgs!) {
			batchesStocks(data: $data) {
				batch { id code expireAt }
				stock
			}
		}
	`,
	DEPARTURES: gql`
		query departures($pharmacyId: Int!) {
			departures(pharmacyId: $pharmacyId) {
				id remark departureDate status
				clinicCare {
					id startDate endDate
					insured {
						id code iin
						person { firstName lastName }
					}
				}
			}
		}
	`,
	DEPARTURE_ITEMS: gql`
		query departureItems($departureId: Int!) {
			departureItems(departureId: $departureId) {
				id quantity price
				batch {
					id code expireAt
					medication {
						id code name concentration
						unit {
							id name
							__typename @skip(if: true)
						}
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`,
	CREATE_DEPARTURE_DEPENDENCIES: gql`
		query dependencies($pharmacyId: Int!) {
			clinicCares: clinicCaresWithoutDeparturePrescriptions(pharmacyId: $pharmacyId) {
				id startDate endDate
				insured {
					id code iin
					person { firstName lastName }
				}
			}
		}
	`,
	CREATE_DEPARTURE_ITEM_DEPENDENCIES: gql`
		query dependencies($clinicCareId: Int!, $pharmacyId: Int!) {
			prescriptions: prescriptionsFromPharmacyWithoutDeparture(clinicCareId: $clinicCareId, pharmacyId: $pharmacyId) {
				id quantity indications departuredQuantity
				medication {
					id code name concentration
					unit {
						id name
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`
}

export const mutation = {
	CREATE_ARRIVAL: gql`
		mutation create($data: IArrivalCreateArgs!) {
			createArrival(data: $data) {
				id
			}
		}
	`,
	APPROVE_ARRIVAL: gql`
		mutation approveArrival($id: Int!) {
			approveArrival(id: $id) {
				id
			}
		}
	`,
	CLOSE_ARRIVAL: gql`
		mutation closeArrival($id: Int!) {
			closeArrival(id: $id) {
				id
			}
		}
	`,
	UPDATE_ARRIVAL: gql`
		mutation update($id: Int!, $data: IArrivalUpdateArgs!) {
			updateArrival(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_ARRIVAL: gql`
		mutation delete($id: Int!) {
			deleteArrival(id: $id) {
				id
			}
		}
	`,
	CREATE_ARRIVAL_ITEM: gql`
		mutation create($data: IArrivalItemCreateArgs!) {
			createArrivalItem(data: $data) {
				id
			}
		}
	`,
	UPDATE_ARRIVAL_ITEM: gql`
		mutation update($id: Int!, $data: IArrivalItemUpdateArgs!) {
			updateArrivalItem(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_ARRIVAL_ITEM: gql`
		mutation delete($id: Int!) {
			deleteArrivalItem(id: $id) {
				id
			}
		}
	`,
	CREATE_DEPARTURE: gql`
		mutation create($data: IDepartureCreateArgs!) {
			createDeparture(data: $data) {
				id
			}
		}
	`,
	CREATE_DEPARTURE_ITEM: gql`
		mutation create($data: IDepartureItemCreateArgs!) {
			createDepartureItem(data: $data) {
				id
			}
		}
	`,
	PRINT_REPORT: gql`
		mutation print($data: IInventoryPrintReportArgs!) {
			file: printReport(data: $data) {
				data
				info { type }
			}
		}
	`
}

export const subscription = {
	ARRIVAL_UPSERTED: gql`
		subscription upserted {
			arrivalUpserted {
				id
			}
		}
	`,
	ARRIIVAL_ITEM_UPSERTED: gql`
		subscription upserted {
			arrivalItemUpserted {
				id
			}
		}
	`,
	DEPARTURE_UPSERTED: gql`
		subscription upserted {
			departureUpserted {
				id
			}
		}
	`,
	DEPARTURE_ITEM_UPSERTED: gql`
		subscription upserted {
			departureItemUpserted {
				id
			}
		}
	`
}
