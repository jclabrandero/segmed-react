
import { gql } from '@apollo/client'


export const query = {
	CLINIC_CARES: gql`
		query clinicCares {
			clinicCares {
				id startDate endDate
				primary { reason }
				insured {
					code iin
					person { firstName lastName }
					insuredType { name }
				}
				state { name color }
				medicalOffice { name }
			}
		}
	`,
	CLINIC_CARE: gql`
		query clinicCare($id: Int!) {
			clinicCare(id: $id) {
				id startDate endDate
				primary { id reason physicalExam diagnosis }
				insured {
					id code iin
					person { firstName lastName }
					insuredType { name }
				}
				state { name color lock }
				medicalOffice { name }
				interclinicals {
					id remark driftDate approvedState
					medicalGroup {
						id name
						__typename @skip(if: true)
						specialties {
							id name
							subspecialties {
								id name
								__typename @skip(if: true)
							}
							__typename @skip(if: true)
						}
					}
					provider { id businessName }
					files { md5 }
				}
				prescriptions {
					id quantity indications
					medication {
						id code name concentration
						unit {
							id name
							__typename @skip(if: true)
						}
						__typename @skip(if: true)
					}
					pharmacy {
						id name
						__typename @skip(if: true)
					}
				}
				prescriptionExterns {
					id quantity indications
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
		}
	`,
	DEPENDENCIES: gql`
		query dependencies($userName: String!) {
			user: userByUserName(userName: $userName) {
				clerk {
					medicalOffices { id name }
				}
			}
			states: activeClinicalCareState {
				id name color
			}
			insureds: activeInsureds {
				id code iin person { firstName lastName }
			}
		}
	`,
	CLINIC_CARE_STATE_DEPENDENCIES: gql`
		query clinicCareState($id: Int!) {
			state: clinicCareState(id: $id) {
				id name
			}
			states: activeClinicalCareState {
				id name color lock
			}
		}
	`
}

export const mutation = {
	CREATE_CLINIC_CARE: gql`
		mutation create($data: IClinicCareCreateArgs!) {
			clinicCare: createClinicCare(data: $data) {
				id
			}
		}
	`,
	UPDATE_CLINIC_CARE_STATE: gql`
		mutation create($id: Int!, $data: IClinicCareStateUpdateArgs!) {
			clinicCare: updateClinicCareState(id: $id, data: $data) {
				id
			}
		}
	`
}

export const subscription = {
	CLINIC_CARE_UPSERTED: gql`
		subscription upserted {
			clinicCareUpserted {
				id
			}
		}
	`
}
