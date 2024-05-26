
import { ClinicCarePrimary, ClinicCareId } from '../../../types'

import { ToolBar, ToolBarMenu } from '../../../components'
import { useAuth } from '../../../hooks'

import { UpsertClinicCarePrimary } from './clinic-care-primary-upsert'


type ClinicCarePrimaryProps = {
	primary?:		ClinicCarePrimary
	edit:			boolean
} & ClinicCareId

export function ClinicCarePrimaryManage({ clinicCareId, primary, edit }: ClinicCarePrimaryProps) {
	const { has } = useAuth()

	return (
		<>
			{
				edit && has('WriteClinicCare', <ToolBar><ToolBarMenu>
					<UpsertClinicCarePrimary id={primary?.id || 0} clinicCareId={clinicCareId}/>
				</ToolBarMenu></ToolBar>)
			}
			<p><strong>Motivo, descripción de la sintomatología</strong></p>
			<pre>{ primary?.reason || '(Sin información)'}</pre>
			<p><strong>Examen físico</strong></p>
			<pre>{ primary?.physicalExam || '(Sin información)'}</pre>
			<p><strong>Diagnóstico</strong></p>
			<pre>{ primary?.diagnosis || '(Sin información)'}</pre>
		</>
	)
}
