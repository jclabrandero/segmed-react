
import { ClinicCarePrimary, ClinicCareId } from '../../../types'

import { ToolBar, ToolBarMenu } from '../../../components'

import { UpsertClinicCarePrimary } from './clinic-care-primary-upsert'


type ClinicCarePrimaryProps = {
	primary?:		ClinicCarePrimary
	edit:			boolean
} & ClinicCareId

export function ClinicCarePrimaryManage({ clinicCareId, primary, edit }: ClinicCarePrimaryProps) {
	return (
		<>
			{
				edit && <ToolBar><ToolBarMenu>
					<UpsertClinicCarePrimary id={primary?.id || 0} clinicCareId={clinicCareId}/>
				</ToolBarMenu></ToolBar>
			}
			<b>Motivo</b>
			<p>{ primary?.reason || '(Sin información)'}</p>
			<b>Examen físico</b>
			<p>{ primary?.physicalExam || '(Sin información)'}</p>
			<b>Diagnóstico</b>
			<p>{ primary?.diagnosis || '(Sin información)'}</p>
		</>
	)
}
