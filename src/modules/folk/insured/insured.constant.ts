
import { gql } from '@apollo/client'


export const query = {
	INSUREDS: gql`
		query insureds {
			insureds {
				id code iin inletDate outletDate tradeUnion address phone status
				person { id firstName lastName }
				insuredType { id name }
				holderInsured { id code }
				dependents { id code }
				belonging { id name }
			}
		}
	`,
	INSURED: gql`
		query insured($id: Int!) {
			insured(id: $id) {
				id code iin inletDate outletDate tradeUnion address phone status
				person { id firstName lastName }
				insuredType { id name }
				holderInsured { id code }
				dependents { id code }
				belonging { id name }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			people: activePersons {
				id firstName lastName
			}
			holders: activeHolderInsureds {
				id code
				person { id firstName lastName }
			}
			insuredTypes: activeInsuredTypes {
				id name withDependents
			}
			belongings: activeBelongings {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			insured(id: $id) {
				id code iin inletDate outletDate tradeUnion address phone status
				person { id firstName lastName }
				insuredType { id name withDependents }
				holderInsured { id code }
				dependents { id code }
				belonging { id name }
			}
			people: activePersons {
				id firstName lastName
			}
			holders: activeHolderInsureds {
				id code
				person { id firstName lastName }
			}
			insuredTypes: activeInsuredTypes {
				id name withDependents
			}
			belongings: activeBelongings {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_INSURED: gql`
		mutation create($data: IInsuredCreateArgs!) {
			insured: createInsured(data: $data) {
				id
			}
		}
	`,
	UPDATE_INSURED: gql`
		mutation update($id: Int!, $data: IInsuredUpdateArgs!) {
			insured: updateInsured(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_INSURED: gql`
		mutation delete($id: Int!) {
			insured: deleteInsured(id: $id) {
				id
			}
		}
	`,
	UPGRADE_INSURED: gql`
		mutation upgrade($id: Int!) {
			insured: upgradeInsured(id: $id) {
				id
			}
		}
	`,
	DOWNGRADE_INSURED: gql`
		mutation downgrade($id: Int!) {
			insured: downgradeInsured(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	INSURED_UPSERTED: gql`
		subscription upserted {
			insuredUpserted {
				id
			}
		}
	`
}
