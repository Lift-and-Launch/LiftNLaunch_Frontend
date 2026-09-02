// src/routes/AppRoutes.tsx (or src/AppRoutes.tsx - whichever path you're using)
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useAuth } from "./context/AuthContext";
import { isSuperAdmin } from "./utils/roles";
import ActivateFunnelBuilder from "./pages/ActivateFunnelBuilder";

// Lazy load pages for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Services = React.lazy(() => import("./pages/Services"));
const Campaigns = React.lazy(() => import("./pages/Campaigns"));
const CampaignDetails = React.lazy(() => import("./pages/CampaignDetails"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogDetails = React.lazy(() => import("./pages/BlogDetails"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Process = React.lazy(() => import("./pages/Process"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const ActivateFunnel = React.lazy(
  () => import("./pages/ActivateFunnelBuilder"),
);
const FunnelTool = React.lazy(() => import("./pages/FunnelTool"));

// New Lift & Launch SaaS Overhaul Pages
const CampaignTypeSelection = React.lazy(
  () => import("./pages/CampaignTypeSelection"),
);
const CreateCampaign = React.lazy(() => import("./pages/CreateCampaign"));
const BusinessRegistration = React.lazy(
  () => import("./pages/BusinessRegistration"),
);
const CampaignConfiguration = React.lazy(
  () => import("./pages/CampaignConfiguration"),
);
const CampaignBuilder = React.lazy(() => import("./pages/CampaignBuilder"));
const ReviewSubmitCampaign = React.lazy(() => import("./pages/ReviewSubmitCampaign"));
const CampaignReady = React.lazy(() => import("./pages/CampaignReady"));
const PublishCampaign = React.lazy(() => import("./pages/PublishCampaign"));
const CampaignPublishedSuccess = React.lazy(() => import("./pages/CampaignPublishedSuccess"));
const LiveWebsite = React.lazy(() => import("./pages/LiveWebsite"));
const StripeCallback = React.lazy(() => import("./pages/StripeCallback"));
const PromoteCampaign = React.lazy(() => import("./pages/PromoteCampaign"));
const Profile = React.lazy(() => import("./pages/Profile"));

// Website Builder Page
const WebsiteBuilder = React.lazy(() => import("./pages/WebsiteBuilder"));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" />;
  return children;
};

const PriceGatedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" />;
  if (!user.isSubscribed) return <Navigate to="/pricing" />;
  if (user.adminApprovalStatus !== 'approved') return <Navigate to="/dashboard" />;
  return children;
};

const ApprovedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" />;
  if (user.isSubscribed && user.adminApprovalStatus !== 'approved') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" />;
  if (isSuperAdmin(user.role) && !user.adminOtpVerified) {
    return <Navigate to="/admin/verify-otp" replace />;
  }
  if (!isSuperAdmin(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const AdminDashboardView = React.lazy(
  () => import("./components/AdminDashboardView"),
);
const AdminOtpVerify = React.lazy(() => import("./pages/AdminOtpVerify"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader"></div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/services"
          element={
            <MainLayout>
              <Services />
            </MainLayout>
          }
        />
        <Route
          path="/campaigns"
          element={
            <MainLayout>
              <Campaigns />
            </MainLayout>
          }
        />
        <Route
          path="/campaigns/:id"
          element={
            <MainLayout>
              <CampaignDetails />
            </MainLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <MainLayout>
              <Blog />
            </MainLayout>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <MainLayout>
              <BlogDetails />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <MainLayout>
              <FAQ />
            </MainLayout>
          }
        />
        <Route
          path="/process"
          element={
            <MainLayout>
              <Process />
            </MainLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <MainLayout>
              <Pricing />
            </MainLayout>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activate-funnel"
          element={
            <MainLayout>
              <ActivateFunnelBuilder />
            </MainLayout>
          }
        />

        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stripe-callback"
          element={
            <ProtectedRoute>
              <StripeCallback />
            </ProtectedRoute>
          }
        />

        {/* Website Builder Route */}
        <Route
          path="/dashboard/website-builder"
          element={
            // <PriceGatedRoute>
            <WebsiteBuilder />
            // </PriceGatedRoute>
          }
        />
        {/* <Route
          path="/dashboard/website-builder"
          element={
            <WebsiteBuilder />
          }
        /> */}

        {/* New SaaS Flow Routes */}
        <Route
          path="/dashboard/campaign/create"
          element={
            <ApprovedRoute>
              <MainLayout>
                <CreateCampaign />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/select-type"
          element={
            <ApprovedRoute>
              <MainLayout>
                <CampaignTypeSelection />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/register-business"
          element={
            <ApprovedRoute>
              <MainLayout>
                <BusinessRegistration />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/configure"
          element={
            <ApprovedRoute>
              <MainLayout>
                <CampaignConfiguration />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/review"
          element={
            <ApprovedRoute>
              <MainLayout>
                <ReviewSubmitCampaign />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/ready"
          element={
            <ApprovedRoute>
              <MainLayout>
                <CampaignReady />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/builder"
          element={
            <PriceGatedRoute>
              <MainLayout>
                <WebsiteBuilder />
              </MainLayout>
            </PriceGatedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/publish"
          element={
            <ApprovedRoute>
              <MainLayout>
                <PublishCampaign />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/published-success"
          element={
            <ApprovedRoute>
              <MainLayout>
                <CampaignPublishedSuccess />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/campaign/:id/promote"
          element={
            <ApprovedRoute>
              <MainLayout>
                <PromoteCampaign />
              </MainLayout>
            </ApprovedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/live/:campaignId"
          element={<LiveWebsite />}
        />
        <Route
          path="/live/:campaignId/:version"
          element={<LiveWebsite />}
        />

        {/* Older Funnel Entry Line (Maintained for backward compat during dev) */}
        <Route
          path="/dashboard/funnel"
          element={
            <PriceGatedRoute>
              <MainLayout>
                <FunnelTool />
              </MainLayout>
            </PriceGatedRoute>
          }
        />

        {/* Admin OTP (pending token — must sit above /admin/*) */}
        <Route path="/admin/verify-otp" element={<AdminOtpVerify />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboardView />
            </AdminRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
