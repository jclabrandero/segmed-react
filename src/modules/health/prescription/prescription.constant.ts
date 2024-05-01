
import { gql } from '@apollo/client'


export const query = {
	PRESCRIPTION: gql`
		query prescription($id: Int!) {
			prescription(id: $id) {
				id quantity indications
				pharmacy {
					id name
					__typename @skip(if: true)
				}
				medication {
					id name
					__typename @skip(if: true)
				}
			}
		}
	`,
	PRESCRIPTION_EXTERN: gql`
		query prescriptionExtern($id: Int!) {
			prescriptionExtern(id: $id) {
				id quantity indications
				medication {
					id name
					__typename @skip(if: true)
				}
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			pharmacies: activePharmacies {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			prescription(id: $id) {
				id quantity indications
				pharmacy {
					id name
					__typename @skip(if: true)
				}
				medication {
					id name
					__typename @skip(if: true)
				}
			}
			pharmacies: activePharmacies {
				id name
			}
		}
	`,
	CREATE_EXTERN_DEPENDENCIES: gql`
		query dependencies {
			medications: medicationsLiname {
				id code name concentration
				unit {
					id name
					__typename @skip(if: true)
				}
				__typename @skip(if: true)
			}
		}
	`,
	UPDATE_EXTERN_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			prescriptionExtern(id: $id) {
				id quantity indications
				medication {
					id name
					__typename @skip(if: true)
				}
			}
			medications: medicationsLiname {
				id code name concentration
				unit {
					id name
					__typename @skip(if: true)
				}
				__typename @skip(if: true)
			}
		}
	`,
	PHARMACY_STOCK: gql`
		query dependencies($pharmacyId: Int!) {
			pharmacyStock(pharmacyId: $pharmacyId) {
				total
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
	CREATE_PRESCRIPTION: gql`
		mutation create($data: IPrescriptionCreateArgs!) {
			createPrescription(data: $data) {
				id
			}
		}
	`,
	UPDATE_PRESCRIPTION: gql`
		mutation update($id: Int!, $data: IPrescriptionUpdateArgs!) {
			updatePrescription(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_PRESCRIPTION: gql`
		mutation delete($id: Int!, $data: IPrescriptionUpdateArgs!) {
			deletePrescription(id: $id, data: $data) {
				id
			}
		}
	`,
	CREATE_PRESCRIPTION_EXTERN: gql`
		mutation create($data: IPrescriptionExternCreateArgs!) {
			createPrescriptionExtern(data: $data) {
				id
			}
		}
	`,
	UPDATE_PRESCRIPTION_EXTERN: gql`
		mutation update($id: Int!, $data: IPrescriptionUpdateArgs!) {
			updatePrescriptionExtern(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_PRESCRIPTION_EXTERN: gql`
		mutation delete($id: Int!, $data: IPrescriptionUpdateArgs!) {
			deletePrescriptionExtern(id: $id, data: $data) {
				id
			}
		}
	`,
	PRINT_PRESCRIPTION: gql`
		mutation print($data: IPrescriptionPrintArgs!) {
			file: printPrescription(data: $data) {
				data
				info { type }
			}
		}
	`
}
