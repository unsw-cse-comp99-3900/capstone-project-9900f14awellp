import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Register from './views/Register';
import Creation from './views/Creation';
import Draft from './views/Draft';
import InvoiceManagement from './views/InvoiceManagement';
import Profile from './views/Profile';
import UserManagement from './views/UserManagement';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard></Dashboard>} />
				<Route path="/login" element={<Login></Login>} />
				<Route path="/register" element={<Register></Register>} />
				<Route path="/creation" element={<Creation></Creation>} />
				<Route path="/draft" element={<Draft></Draft>} />
				<Route
					path="/invoice-management"
					element={<InvoiceManagement></InvoiceManagement>}
				/>
				<Route path="/profile" element={<Profile></Profile>} />
				<Route
					path="/user-management"
					element={<UserManagement></UserManagement>}
				/>
			</Routes>
		</BrowserRouter>
	);
}
