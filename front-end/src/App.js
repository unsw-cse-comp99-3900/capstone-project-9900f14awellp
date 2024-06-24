import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Welcome from './views/Welcome';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Register from './views/Register';
import Creation from './views/Dashboard_Subs/Creation';
import Draft from './views/Draft';
import InvoiceManagement from './views/Dashboard_Subs/InvoiceManagement';
import Profile from './views/Profile';
import UserManagement from './views/Dashboard_Subs/UserManagement';
import NotFound from './views/NotFound';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Welcome></Welcome>} />
				<Route path="/home" element={<Dashboard></Dashboard>}>
					<Route index element={<Creation />}></Route>
					<Route path="creation" element={<Creation />}></Route>
					<Route path="invoice-manage" element={<InvoiceManagement />}></Route>
					<Route path="user-manage" element={<UserManagement />}></Route>
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
