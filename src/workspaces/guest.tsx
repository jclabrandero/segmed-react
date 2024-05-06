
import { Routes, Route } from 'react-router-dom'

import { NavBar, NavBrand, NavLink , NavMenu } from '../components'

import { Home, NotFound } from '../modules/basic'
import { SignIn } from '../modules/authorization'


export function Guest() {
	return (
		<div className='workspace'>
			<header>
				<NavBar>
					<NavMenu>
						<NavBrand>
							<h4 className='segmed-brand'>Seguro Médico - SEGMED</h4>
						</NavBrand>
					</NavMenu>
					<NavMenu>
						<NavLink to='iniciar' text='Iniciar sesión'/>
					</NavMenu>
				</NavBar>
			</header>
			<main>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/iniciar" element={<SignIn/>}/>
					<Route path="*" element={<NotFound/>}/>
				</Routes>
			</main>
		</div>
	)
}
