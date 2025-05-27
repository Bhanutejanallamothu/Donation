
    import React from 'react';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import HomePage from '@/pages/HomePage';
    import CreateCampaignPage from '@/pages/CreateCampaignPage';
    import CampaignsListPage from '@/pages/CampaignsListPage';
    import CampaignDetailsPage from '@/pages/CampaignDetailsPage';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    import NotFoundPage from '@/pages/NotFoundPage';
    import { Toaster } from '@/components/ui/toaster';
    import { CampaignProvider } from '@/context/CampaignContext';
    import { AuthProvider } from '@/context/AuthContext';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import MyDonationsPage from '@/pages/MyDonationsPage';

    function App() {
      return (
        <AuthProvider>
          <CampaignProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route 
                    path="/create-campaign" 
                    element={
                      <ProtectedRoute>
                        <CreateCampaignPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/campaigns" element={<CampaignsListPage />} />
                  <Route 
                    path="/campaign/:id" 
                    element={
                       <CampaignDetailsPage />
                    } 
                  />
                  <Route 
                    path="/my-donations" 
                    element={
                      <ProtectedRoute>
                        <MyDonationsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
              <Toaster />
            </Router>
          </CampaignProvider>
        </AuthProvider>
      );
    }

    export default App;
  