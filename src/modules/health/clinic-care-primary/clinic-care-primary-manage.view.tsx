
import { ClinicCarePrimary, ClinicCareId } from '../../../types'

import { UpsertClinicCarePrimary } from './clinic-care-primary-upsert'


type ClinicCarePrimaryProps = {
	primary?:		ClinicCarePrimary
	edit:			boolean
} & ClinicCareId

export function ClinicCarePrimaryManage({ clinicCareId, primary, edit }: ClinicCarePrimaryProps) {
	return (
		<>
			{ !edit && <UpsertClinicCarePrimary id={primary?.id || 0} clinicCareId={clinicCareId}/> }

			<h5>Motivo</h5>
			<p>{ primary?.reason || '(Sin información)'}</p>
			<h5>Examen físico</h5>
			<p>{ primary?.physicalExam || '(Sin información)'}</p>
			<h5>Diagnóstico</h5>
			<p>{ primary?.diagnosis || '(Sin información)'}</p>
		</>
	)
}
