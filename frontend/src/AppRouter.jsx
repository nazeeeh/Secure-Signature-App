import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './views/Dashboard';
import KeyList from './components/keys/KeyList';
import KeyDetail from './components/keys/KeyDetail';
import GenerateKey from './components/keys/GenerateKey';
import SignatureList from './components/signatures/SignatureList';
import SignatureDetail from './components/signatures/SignatureDetail';
import SignDocument from './components/signatures/SignDocument';
import VerifySignature from './components/signatures/VerifySignature';
import MfaSetup from './components/auth/MfaSetup';
import NotFound from './views/NotFound';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Layout from './components/layout/Layout';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/keys" element={<KeyList />} />
          <Route path="/keys/generate" element={<GenerateKey />} />
          <Route path="/keys/:id" element={<KeyDetail />} />
          <Route path="/signatures" element={<SignatureList />} />
          <Route path="/signatures/sign" element={<SignDocument />} />
          <Route path="/signatures/verify" element={<VerifySignature />} />
          <Route path="/signatures/:id" element={<SignatureDetail />} />
          <Route path="/mfa-setup" element={<MfaSetup />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;