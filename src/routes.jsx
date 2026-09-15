// src/routes/AppRoutes.tsx (or src/AppRoutes.tsx - whichever path you're using)
import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useAuth } from "./context/AuthContext";
import ActivateFunnelBuilder from "./pages/ActivateFunnelBuilder";
import { isCoachRole, isSuperAdmin } from "./utils/roles";
import {
  canAccessPremiumFeatures,
  hasActiveSubscription,
  premiumAccessRedirect,
} from "./utils/subscription";

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
const CoachCases = React.lazy(() => import("./pages/coach/CoachCases"));
const CoachCaseLayout = React.lazy(() => import("./pages/coach/CoachCaseLayout"));
const CoachCaseHome = React.lazy(() => import("./pages/coach/CoachCaseHome"));
const CoachIntake = React.lazy(() => import("./pages/coach/CoachIntake"));
const CoachDiagnosis = React.lazy(() => import("./pages/coach/CoachDiagnosis"));
const CoachPlan = React.lazy(() => import("./pages/coach/CoachPlan"));
const CoachChat = React.lazy(() => import("./pages/coach/CoachChat"));
const CoachDomains = React.lazy(() => import("./pages/coach/CoachDomains"));
const CoachArtifact = React.lazy(() => import("./pages/coach/CoachArtifact"));
const CoachWorkspace = React.lazy(() => import("./pages/coach/CoachWorkspace"));
const CoachCaseload = React.lazy(() => import("./pages/coach/CoachCaseload"));

// Website Builder Page
const WebsiteBuilder = React.lazy(() => import("./pages/WebsiteBuilder"));

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="loader" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <RouteLoader />;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

/** Paid + approved (or coach/superadmin). Blocks direct URL access to premium/AI tools. */
const PremiumRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <RouteLoader />;
  if (!user) return <Navigate to="/signin" replace />;

  const redirect = premiumAccessRedirect(user);
  if (redirect === "/pricing") {
    return (
      <Navigate
        to="/pricing"
        replace
        state={{ from: location.pathname, reason: "premium" }}
      />
    );
  }
  if (redirect) return <Navigate to={redirect} replace />;
  if (!canAccessPremiumFeatures(user)) {
    return <Navigate to="/pricing" replace />;
  }
  return children;
};

/** @deprecated Prefer PremiumRoute — kept for existing campaign builder paths. */
const PriceGatedRoute = ({ children }) => (
  <PremiumRoute>{children}</PremiumRoute>
);

const ApprovedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <RouteLoader />;
  if (!user) return <Navigate to="/signin" replace />;
  if (isCoachRole(user.role) || isSuperAdmin(user.role)) return children;
  if (!hasActiveSubscription(user)) {
    return <Navigate to="/pricing" replace />;
  }
  if (user.adminApprovalStatus !== "approved") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <RouteLoader />;
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminDashboardView = React.lazy(
  () => import("./components/AdminDashboardView"),
);

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

        {/* Website Builder Route — premium only */}
        <Route
          path="/dashboard/website-builder"
          element={
            <PremiumRoute>
              <WebsiteBuilder />
            </PremiumRoute>
          }
        />

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
          path="/dashboard/coach"
          element={
            <PremiumRoute>
              <MainLayout>
                <CoachCases />
              </MainLayout>
            </PremiumRoute>
          }
        />
        <Route
          path="/dashboard/coach/caseload"
          element={
            <PremiumRoute>
              <MainLayout>
                <CoachCaseload />
              </MainLayout>
            </PremiumRoute>
          }
        />
        <Route
          path="/dashboard/coach/cases/:caseId"
          element={
            <PremiumRoute>
              <MainLayout>
                <CoachCaseLayout />
              </MainLayout>
            </PremiumRoute>
          }
        >
          <Route index element={<CoachCaseHome />} />
          <Route path="intake" element={<CoachIntake />} />
          <Route path="diagnosis" element={<CoachDiagnosis />} />
          <Route path="plan" element={<CoachPlan />} />
          <Route path="chat" element={<CoachChat />} />
          <Route path="domains" element={<CoachDomains />} />
          <Route path="workspace" element={<CoachWorkspace />} />
          <Route path="artifacts/:artifactId" element={<CoachArtifact />} />
        </Route>

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
