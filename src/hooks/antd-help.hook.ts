
import { FormInstance } from 'antd'

import { tableStatus } from './table-fields'
import { MedicalGroup } from '../types'


export function useAntdHelp() {
	return {
		addKey: <T = object>(dataset?: Array<T & { id: number }>) => {
			return dataset
				? dataset.map(c => ({ ...c, key: String(c.id) })) as Array<T>
				: [] as Array<T>
		},
		tableStatus,
		touched: (form: FormInstance) => form.getFieldsValue({ filter: (meta) => meta.touched }),
		toLV: (e: { id: number, name: string }) => ({ label: e.name, value: e.id}),
		map: <T = { id: number, name: string }, TReturn = { label: string, value: number }>(dataset: Array<T> | undefined, fn: (e: T) => TReturn) => dataset ? dataset.map(fn) : [],

		encodeMedicalGroups: (medicalGroups: Array<MedicalGroup>) =>
			medicalGroups.map(mg => ({
				title: mg.name,
				value: JSON.stringify([mg.id]),
				children: mg.specialties.map(sp => ({
					title: sp.name,
					value: JSON.stringify([mg.id, sp.id]),
					children: sp.subspecialties.map(sbsp => ({
						title: sbsp.name,
						value: JSON.stringify([mg.id, sp.id, sbsp.id])
					}))
				}))
			})),
		decodeMedicalGroups: (dataset: Array<string>) => {
			let medicalGroups: Array<{
				medicalGroupId: number
				specialties: Array<{
					medicalSpecialtyId: number
					subspecialties: Array<number>
				}>
			}> = []

			for (const iterator of dataset) {
				const path: Array<number> = JSON.parse(iterator)
				const existsGroup = medicalGroups.find(mg => mg.medicalGroupId == path[0])
				if (existsGroup) {
					if (path[1]) {
						const existsSpecialty = existsGroup.specialties.find(em => em.medicalSpecialtyId == path[1])
						if (existsSpecialty) {
							path[2] && existsSpecialty.subspecialties.push(path[2])
						}
						else {
							existsGroup.specialties.push({
								medicalSpecialtyId: path[1],
								subspecialties: path[2] ? [path[2]] : []
							})
						}
					}
				} else {
					medicalGroups = [ ...medicalGroups, {
						medicalGroupId: path[0],
						specialties: path[1] ? [{
							medicalSpecialtyId: path[1],
							subspecialties: path[2] ? [path[2]] : []
						}] : []
					}]
				}
			}

			return medicalGroups
		},
		formatMedicalGroups: (medicalGroups: Array<MedicalGroup>, refGroups: Array<MedicalGroup>) => {
			const result = []
			for (const mg of medicalGroups) {
				if (mg.specialties.length) {
					for (const sp of mg.specialties) {
						if (sp.subspecialties.length) {
							for (const sbsp of sp.subspecialties) {
								result.push(JSON.stringify([mg.id, sp.id, sbsp.id]))
							}
						} else {
							const ref = refGroups.find(refg => refg.id == mg.id)?.specialties.find(refsp => refsp.id == sp.id)
							if (ref?.subspecialties.length == 0)
								result.push(JSON.stringify([mg.id, sp.id]))
						}
					}
				} else {
					const ref = refGroups.find(refg => refg.id == mg.id)
					if (ref?.specialties.length == 0)
						result.push(JSON.stringify([mg.id]))
				}
			}
			return result
		}
	}
}
