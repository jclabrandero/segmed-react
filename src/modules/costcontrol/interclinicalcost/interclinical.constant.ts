import { gql } from '@apollo/client'

export const query = {

	CREATE_INTERCLINICAL_DEPENDENCIES: gql`
		query dependencies {
			providers {
				id
				businessName
			}
		}
	`,

	INTERCLINICAL_LIST: gql`
		query interclinicalCosts {
			interclinicalCosts {
				id
				invoiceNumber
				invoiceDate
				invoiceTotalRefPrice
				status
				provider { id businessName nit}
			}
		}
	`,

	INTERCLINICAL_COST_ITEMS: gql`
    query interclinicalCostItems($interclinicalId: Int!) {
      interclinicalCostItems(interclinicalId: $interclinicalId) {
        id quantity sesionDate description priceTariff price status
      }
    }
  `,
	INTERCLINICAL_COST_ITEM: gql`
    query interclinicalCostItem($id: Int!) {
      interclinicalCostItem(id: $id) {
        id quantity sesionDate description priceTariff price status
      }
    }
  `
}
export const mutation = {
	CREATE_INTERCLINICAL_COST: gql`
    mutation create($data: IInterclinicalCostCreateArgs!) {
      createInterclinicalCost(data: $data) {
        id
      }
    }
  `,

	CREATE_INTERCLINICAL_COST_ITEM: gql`
    mutation create($data: IInterclinicalCostItemCreateArgs!) {
      createInterclinicalCostItem(data: $data) {
        id
      }
    }
  `,
	UPDATE_INTERCLINICAL_COST_ITEM: gql`
    mutation update($id: Int!, $data: IInterclinicalCostItemUpdateArgs!) {
      updateInterclinicalCostItem(id: $id, data: $data) {
        id
      }
    }
  `,
	DELETE_INTERCLINICAL_COST_ITEM: gql`
    mutation delete($id: Int!) {
      deleteInterclinicalCostItem(id: $id) {
        id
      }
    }
  `
}

export const subscription = {
	INTERCLINICAL_COST_ITEM_UPSERTED: gql`
    subscription upserted {
      interclinicalCostItemUpserted {
        id
      }
    }
  `
}