import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Welcome from './views/Welcome';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Register from './views/Register';
import Create from './views/Dashboard_Subs/Create';
import Sending from './views/Dashboard_Subs/sending';
import InvoiceManagement from './views/Dashboard_Subs/InvoiceManagement';
import Draft from './views/Draft';
import Profile from './views/Profile';
import Validation from './views/Dashboard_Subs/Validation';
import NotFound from './views/NotFound';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Welcome></Welcome>} />
				<Route path="/home" element={<Dashboard></Dashboard>}>
					{/* <Route index element={<Create />}></Route> */}
				<Route path="create" element={<Create />}></Route>
				<Route path="manage" element={<InvoiceManagement />}></Route>
				<Route path="validate" element={<Validation />}></Route>
				<Route path="send" element={<Sending />}></Route>
				</Route>
				<Route path="/login" element={<Login></Login>} />
				<Route path="/register" element={<Register></Register>} />
				<Route path="/draft" element={<Draft></Draft>} />
				<Route path="/profile" element={<Profile></Profile>} />
				<Route path="/404" element={<NotFound></NotFound>} />
				<Route path="*" element={<Navigate to="/404" />} />
			</Routes>
		</BrowserRouter>
	);
}
