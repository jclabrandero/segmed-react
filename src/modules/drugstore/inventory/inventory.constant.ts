
import { gql } from '@apollo/client'


export const query = {
	INVENTORIES: gql`
		query inventories($pharmacyId: Int!) {
			inventories(pharmacyId: $pharmacyId) {
				id stock min status
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
				id remark arrivalDate status
			}
		}
	`,
	ARRIVAL_ITEMS: gql`
		query arrivalItems($arrivalId: Int!) {
			arrivalItems(arrivalId: $arrivalId) {
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
}

export const mutation = {
	CREATE_ARRIVAL: gql`
		mutation create($data: IArrivalCreateArgs!) {
			createArrival(data: $data) {
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
}

export const subscription = {
	ARRIVAL_UPSERTED: gql`
		subscription upserted {
			arrivalUpserted {
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
}
