import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  FileText,
  NotebookPen,
  LogOut,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Power,
  Trash2,
  Edit2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  Check,
  X,
  PlusCircle,
  CheckCircle2,
  Globe
} from "lucide-react";
import api from "../api/axios";

// ── Friendly Error Message Translator ───────────────────────
const translateFriendlyError = (err) => {
  if (!err) return "";
  const msg = err.response?.data?.message || err.message || "";
  
  if (msg.includes("duplicate key") || msg.includes("E11000") || msg.includes("already in use") || msg.includes("already exists")) {
    return "This email address is already registered to another account. Please use a different email.";
  }
  if (msg.includes("unauthorized") || msg.includes("forbidden") || msg.includes("privilege") || msg.includes("denied")) {
    return "Security access denied. You need Super Admin permissions to perform this action.";
  }
  if (msg.includes("Network Error") || msg.includes("connect") || msg.includes("ENOTFOUND")) {
    return "Could not connect to the database. Please check your internet connection and try again.";
  }
  if (msg.includes("validation failed") || msg.includes("required")) {
    return "Please verify your input fields. Some required information is missing or entered incorrectly.";
  }
  return "We ran into an unexpected issue saving your changes. Please try again.";
};

// ── Stat Card Component ─────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, onClick }) => (
  <div
    className="bg-white rounded-3xl border border-gray-100 p-8 cursor-pointer hover:shadow-xl hover:border-yellow-400/30 transition-all duration-300 active:scale-95 group flex items-center justify-between"
    onClick={onClick}
  >
    <div className="space-y-2">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-yellow-600 transition-colors">{title}</h3>
      <p className="text-4xl font-black text-gray-900 tracking-tight leading-none">{value}</p>
    </div>
    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-500 transition-all duration-300">
      <Icon size={24} />
    </div>
  </div>
);

// ── Overview Tab Page ───────────────────────────────────────
const OverviewPage = ({ stats, setActivePage }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Users"
        value={stats?.totalUsers ?? "-"}
        icon={Users}
        onClick={() => setActivePage("users")}
      />
      <StatCard
        title="Total Campaigns"
        value={stats?.totalCampaigns ?? "-"}
        icon={FileText}
        onClick={() => setActivePage("campaigns")}
      />
      <StatCard
        title="Pending Approvals"
        value={stats?.pendingCampaigns ?? "-"}
        icon={AlertCircle}
        onClick={() => setActivePage("campaigns")}
      />
      <StatCard
        title="Live Campaigns"
        value={stats?.activeCampaigns ?? "-"}
        icon={CheckCircle2}
        onClick={() => setActivePage("campaigns")}
      />
    </div>

    {/* Quick Tools */}
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
       <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Administrative Quick Shortcuts</h3>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <button
           onClick={() => setActivePage("users")}
           className="p-6 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-2xl font-black text-xs uppercase tracking-widest text-indigo-700 transition-all cursor-pointer text-left space-y-2"
         >
           <Users size={20} />
           <div className="block pt-2">Audit User Base</div>
         </button>
         <button
           onClick={() => setActivePage("campaigns")}
           className="p-6 bg-yellow-50/50 hover:bg-yellow-50 border border-yellow-100/50 rounded-2xl font-black text-xs uppercase tracking-widest text-yellow-800 transition-all cursor-pointer text-left space-y-2"
         >
           <FileText size={20} />
           <div className="block pt-2">Review Campaigns</div>
         </button>
       </div>
    </div>
  </div>
);

export default function AdminDashboardView() {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = currentUser?.role === "superadmin";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePage, setActivePage] = useState("overview");

  // User list states
  const [users, setUsers] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Campaign list states
  const [campaigns, setCampaigns] = useState([]);
  const [campaignTotal, setCampaignTotal] = useState(0);
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("");

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals / Details states
  const [editingUser, setEditingUser] = useState(null);
  const [inspectingCampaign, setInspectingCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(null); // holds campaignId
  const [showRejectionModal, setShowRejectionModal] = useState(null); // holds campaignId

  // User Verification rejection Modal state
  const [showUserRejectModal, setShowUserRejectModal] = useState(null); // holds userId
  const [userRejectReason, setUserRejectReason] = useState("");

  // Campaign Inspect Extended States
  const [inspectingAds, setInspectingAds] = useState(null);
  const [loadingInspectingAds, setLoadingInspectingAds] = useState(false);

  useEffect(() => {
    if (inspectingCampaign) {
      const fetchCampaignAds = async () => {
        setLoadingInspectingAds(true);
        setInspectingAds(null);
        try {
          const [googleRes, metaRes] = await Promise.allSettled([
            api.get(`/ads/google/metrics/${inspectingCampaign._id}`),
            api.get(`/ads/meta/metrics/${inspectingCampaign._id}`)
          ]);

          let googleAd = null;
          let metaAd = null;

          if (googleRes.status === "fulfilled" && googleRes.value.data.success && googleRes.value.data.data) {
            googleAd = googleRes.value.data.data;
          }
          if (metaRes.status === "fulfilled" && metaRes.value.data.success && metaRes.value.data.data) {
            metaAd = metaRes.value.data.data;
          }

          setInspectingAds({ googleAd, metaAd });
        } catch (err) {
          console.error("Failed to load campaign ads", err);
        } finally {
          setLoadingInspectingAds(false);
        }
      };
      fetchCampaignAds();
    }
  }, [inspectingCampaign]);

  const fetchStats = async () => {
    try {
      const statsRes = await api.get("/admin/stats");
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        params: {
          search: userSearch,
          status: userStatusFilter,
          page: userPage,
          limit: 15
        }
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setUserTotal(res.data.pagination.total);
      }
    } catch (err) {
      console.error(err);
      setError(translateFriendlyError(err));
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/admin/campaigns", {
        params: {
          search: campaignSearch,
          status: campaignStatusFilter,
          page: campaignPage,
          limit: 15
        }
      });
      if (res.data.success) {
        setCampaigns(res.data.data);
        setCampaignTotal(res.data.pagination.total);
      }
    } catch (err) {
      console.error(err);
      setError(translateFriendlyError(err));
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blog");
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(translateFriendlyError(err));
    }
  };

  const fetchAuditLogs = async () => {
    if (!isSuperAdmin) return;
    try {
      const res = await api.get("/admin/audit-logs");
      if (res.data.success) {
        setAuditLogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      await fetchStats();
      if (activePage === "overview") {
        // Stats only
      } else if (activePage === "users") {
        await fetchUsers();
      } else if (activePage === "campaigns") {
        await fetchCampaigns();
      } else if (activePage === "blogs") {
        await fetchBlogs();
      } else if (activePage === "audit-logs") {
        await fetchAuditLogs();
      }
      setLoading(false);
    };
    loadInitialData();
  }, [activePage, userPage, userSearch, userStatusFilter, campaignPage, campaignSearch, campaignStatusFilter]);

  // ── User Verification ───────────────────────────────────────
  const handleVerifyUser = async (id, statusVal, reason = "") => {
    if (!isSuperAdmin) return;
    setError("");
    setSuccess("");
    try {
      const res = await api.put(`/admin/users/${id}/verify`, { status: statusVal, reason });
      if (res.data.success) {
        setSuccess(`User status was successfully updated to ${statusVal}.`);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const triggerRejectUser = async () => {
    if (!userRejectReason) {
      setError("Please specify a reason for rejecting the user's verification.");
      return;
    }
    await handleVerifyUser(showUserRejectModal, "rejected", userRejectReason);
    setShowUserRejectModal(null);
    setUserRejectReason("");
  };

  const handleToggleDeactivate = async (id, currentStatus) => {
    if (!isSuperAdmin) return;
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    if (!window.confirm(`Are you sure you want to change this user status to ${nextStatus}?`)) return;

    setError("");
    setSuccess("");
    try {
      const res = await api.patch(`/admin/users/${id}/deactivate`, { status: nextStatus });
      if (res.data.success) {
        setSuccess("User account status updated successfully.");
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const handleUserDelete = async (id, email) => {
    if (!isSuperAdmin) return;
    if (!window.confirm(`WARNING: Permanently delete account "${email}"? This deletes all associated campaigns and cannot be undone.`)) return;

    setError("");
    setSuccess("");
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        setSuccess("User deleted successfully.");
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setError("");
    setSuccess("");
    try {
      const res = await api.put(`/admin/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status
      });
      if (res.data.success) {
        setSuccess("User profile details updated successfully.");
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  // ── Campaign Moderation ─────────────────────────────────────
  const triggerApprove = async () => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`/admin/campaigns/${showApprovalModal}/approve`, { note: approvalNote });
      setSuccess("Campaign approved and published successfully.");
      setShowApprovalModal(null);
      setApprovalNote("");
      fetchCampaigns();
      fetchStats();
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const triggerReject = async () => {
    if (!rejectionReason) {
      setError("Please specify a reason for rejecting the campaign.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      await api.patch(`/admin/campaigns/${showRejectionModal}/reject`, { reason: rejectionReason });
      setSuccess("Campaign marked as denied.");
      setShowRejectionModal(null);
      setRejectionReason("");
      fetchCampaigns();
      fetchStats();
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const handleCampaignToggleStatus = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`/admin/campaigns/${id}/deactivate`);
      setSuccess("Campaign visibility toggled successfully.");
      fetchCampaigns();
      fetchStats();
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const handleCampaignEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.put(`/admin/campaigns/${editingCampaign._id}`, editingCampaign);
      if (res.data.success) {
        setSuccess("Campaign configuration settings updated.");
        setEditingCampaign(null);
        fetchCampaigns();
      }
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const handleCampaignDelete = async (id) => {
    if (!isSuperAdmin) return;
    if (!window.confirm("Permanently delete this campaign? This action cannot be undone.")) return;

    setError("");
    setSuccess("");
    try {
      await api.delete(`/admin/campaigns/${id}`);
      setSuccess("Campaign removed from system.");
      fetchCampaigns();
      fetchStats();
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  // ── Blog CMS Handlers ───────────────────────────────────────
  const openNewBlogModal = () => {
    setEditingBlog("new");
    setBlogTitle("");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogCategory("Marketing");
    setBlogAuthor("Lift & Launch Team");
    setBlogReadTime("3 min read");
    setBlogImage("https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800");
  };

  const openEditBlogModal = (blog) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title || "");
    setBlogExcerpt(blog.excerpt || "");
    setBlogContent(blog.content || "");
    setBlogCategory(blog.category || "Marketing");
    setBlogAuthor(blog.author || "Lift & Launch Team");
    setBlogReadTime(blog.readTime || "3 min read");
    setBlogImage(blog.image || "");
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const payload = {
      title: blogTitle,
      excerpt: blogExcerpt,
      content: blogContent,
      category: blogCategory,
      author: blogAuthor,
      readTime: blogReadTime,
      image: blogImage,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    try {
      if (editingBlog === "new") {
        await api.post("/blog", payload);
        setSuccess("New blog post created successfully.");
      } else {
        await api.put(`/blog/${editingBlog._id}`, payload);
        setSuccess("Blog post updated successfully.");
      }
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const handleBlogDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this blog post?")) return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/blog/${id}`);
      setSuccess("Blog post deleted successfully.");
      fetchBlogs();
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  // ── User Selection ──────────────────────────────────────────
  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllUsers = () => {
    const activeUsers = displayableUsers;
    if (selectedUserIds.length === activeUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(activeUsers.map((u) => u._id));
    }
  };

  const handleBulkDeactivate = async (statusVal) => {
    if (!isSuperAdmin) return;
    if (selectedUserIds.length === 0) return;
    if (!window.confirm(`Update status of ${selectedUserIds.length} users to ${statusVal}?`)) return;

    setError("");
    setSuccess("");
    try {
      const res = await api.post("/admin/users/bulk-deactivate", {
        userIds: selectedUserIds,
        status: statusVal
      });
      if (res.data.success) {
        setSuccess("Selected user statuses updated.");
        setSelectedUserIds([]);
        fetchUsers();
      }
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  const handleBulkDelete = async () => {
    if (!isSuperAdmin) return;
    if (selectedUserIds.length === 0) return;
    if (!window.confirm(`WARNING: Permanently delete ${selectedUserIds.length} users and all their associated campaigns?`)) return;

    setError("");
    setSuccess("");
    try {
      const res = await api.post("/admin/users/bulk-delete", {
        userIds: selectedUserIds
      });
      if (res.data.success) {
        setSuccess("Selected users deleted.");
        setSelectedUserIds([]);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      setError(translateFriendlyError(err));
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="text-xs font-black uppercase tracking-widest text-gray-500">Loading Console Framework...</span>
      </div>
    );
  }

  // Filter out any superadmin user roles from the UI table display
  const displayableUsers = users.filter((u) => u.role !== "superadmin");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar navigation */}
      <aside className="w-80 bg-gray-955 text-white flex flex-col bg-gray-900 border-r border-gray-800 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-12 px-2 select-none">
          <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-black shadow-lg shadow-yellow-400/20 text-lg">
            ⚡
          </div>
          <div>
            <span className="font-black text-lg tracking-tight block text-white">SuperConsole</span>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block -mt-1">Lift & Launch Governance</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              activePage === "overview"
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setActivePage("overview")}
          >
            <BarChart3 size={16} /> Overview
          </button>
          
          <button
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              activePage === "users"
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setActivePage("users")}
          >
            <Users size={16} /> User Directory
          </button>
          
          <button
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              activePage === "campaigns"
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setActivePage("campaigns")}
          >
            <FileText size={16} /> Campaigns Board
          </button>
          
          {isSuperAdmin && (
            <button
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activePage === "audit-logs"
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActivePage("audit-logs")}
            >
              <Layers size={16} /> Audit Logs
            </button>
          )}
        </nav>

        <div className="pt-6 border-t border-gray-800 mt-auto">
          <div className="px-2 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-xs uppercase">
                {currentUser?.name?.substring(0, 2)}
             </div>
             <div className="truncate">
                <span className="block text-[11px] font-black truncate">{currentUser?.name}</span>
                <span className="block text-[9px] text-yellow-400 font-bold uppercase tracking-widest">Super Admin</span>
             </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-900/35 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            <LogOut size={14} /> Exit System
          </button>
        </div>
      </aside>

      {/* Main panel layout */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
        
        {/* Top greeting bar */}
        <header className="flex justify-between items-center pb-8 border-b border-gray-200/80 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
              Governance Console
            </h1>
            <p className="text-gray-400 font-bold text-sm">
              Lift & Launch Platform Operations Control Centre
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-wider">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" /> System Online
          </div>
        </header>

        {/* Global Alert Notification bars */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl font-bold border border-red-100 flex items-center gap-2 text-sm">
            <AlertCircle size={18} className="text-red-500" /> {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl font-bold border border-green-100 flex items-center gap-2 text-sm">
            <CheckCircle2 size={18} className="text-green-600" /> {success}
          </div>
        )}

        {/* ── Tabs Content Rendering ───────────────────────────────── */}

        {activePage === "overview" && (
          <OverviewPage stats={stats} setActivePage={setActivePage} />
        )}

        {/* ── User Directory tab ── */}
        {activePage === "users" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                    placeholder="Search name/email..."
                    className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:border-yellow-500 focus:outline-none w-64"
                  />
                </div>
                
                <select
                  value={userStatusFilter}
                  onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer"
                >
                  <option value="">All Account Statuses</option>
                  <option value="active">Active Accounts</option>
                  <option value="inactive">Inactive Accounts</option>
                </select>
              </div>

              {/* Bulk actions */}
              {isSuperAdmin && selectedUserIds.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkDeactivate("inactive")}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Deactivate ({selectedUserIds.length})
                  </button>
                  <button
                    onClick={() => handleBulkDeactivate("active")}
                    className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Activate ({selectedUserIds.length})
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-650 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Delete ({selectedUserIds.length})
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-150/60">
                  <thead className="bg-gray-50 font-black text-gray-400 text-[10px] uppercase tracking-widest">
                    <tr>
                      {isSuperAdmin && (
                        <th className="px-6 py-5 text-left w-10">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.length === displayableUsers.length && displayableUsers.length > 0}
                            onChange={toggleSelectAllUsers}
                            className="rounded text-yellow-500 focus:ring-yellow-500 cursor-pointer w-4 h-4"
                          />
                        </th>
                      )}
                      <th className="px-6 py-5 text-left">Customer Name</th>
                      <th className="px-6 py-5 text-left">Email Address</th>
                      <th className="px-6 py-5 text-left">Role</th>
                      <th className="px-6 py-5 text-left">Status</th>
                      <th className="px-6 py-5 text-left">Approval</th>
                      <th className="px-6 py-5 text-left">Registered On</th>
                      {isSuperAdmin && <th className="px-6 py-5 text-center">Administrative Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-bold text-gray-600 text-xs">
                    {displayableUsers.length === 0 ? (
                      <tr>
                        <td colSpan={isSuperAdmin ? 8 : 6} className="px-6 py-16 text-center text-gray-400">
                          No registered users found matching the filter parameters.
                        </td>
                      </tr>
                    ) : (
                      displayableUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          {isSuperAdmin && (
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedUserIds.includes(u._id)}
                                onChange={() => toggleSelectUser(u._id)}
                                className="rounded text-yellow-500 focus:ring-yellow-500 cursor-pointer w-4 h-4"
                              />
                            </td>
                          )}
                          <td className="px-6 py-4 text-gray-905 font-black">{u.name}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              u.status === "active" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {u.subscription?.isSubscribed ? (
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                u.adminApprovalStatus === "approved"
                                  ? "bg-green-50 text-green-600 border border-green-100"
                                  : u.adminApprovalStatus === "rejected"
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : "bg-yellow-50 text-yellow-600 border border-yellow-100 animate-pulse"
                              }`}>
                                {u.adminApprovalStatus || "pending review"}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400">Free Tier</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          {isSuperAdmin && (
                            <td className="px-6 py-4 flex items-center justify-center gap-2">
                              {u.subscription?.isSubscribed && u.adminApprovalStatus !== "approved" && (
                                <button
                                  onClick={() => handleVerifyUser(u._id, "approved")}
                                  className="p-2 text-green-600 hover:bg-green-55 rounded-lg transition-all cursor-pointer"
                                  title="Approve User Account"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              
                              {u.subscription?.isSubscribed && u.adminApprovalStatus !== "rejected" && (
                                <button
                                  onClick={() => setShowUserRejectModal(u._id)}
                                  className="p-2 text-red-650 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                  title="Reject User Account"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}

                              <button
                                onClick={() => setEditingUser(u)}
                                className="p-2 text-gray-400 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                                title="Edit User Details"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleToggleDeactivate(u._id, u.status)}
                                className={`p-2 rounded-lg transition-all cursor-pointer ${
                                  u.status === "active" ? "text-gray-400 hover:text-red-500 hover:bg-red-50" : "text-gray-400 hover:text-green-500 hover:bg-green-50"
                                }`}
                                title={u.status === "active" ? "Deactivate User" : "Activate User"}
                              >
                                <Power size={16} />
                              </button>
                              <button
                                onClick={() => handleUserDelete(u._id, u.email)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-55 rounded-lg transition-all cursor-pointer"
                                title="Delete User Account"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {userTotal > 15 && (
                <div className="flex justify-between items-center px-8 py-5 bg-gray-50 border-t border-gray-100 font-bold text-[10px] uppercase text-gray-400 tracking-wider">
                  <span>Total Users: {userTotal}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                      disabled={userPage === 1}
                      className="p-1.5 border border-gray-200 rounded hover:bg-white disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span>Page {userPage}</span>
                    <button
                      onClick={() => setUserPage((p) => (p * 15 < userTotal ? p + 1 : p))}
                      disabled={userPage * 15 >= userTotal}
                      className="p-1.5 border border-gray-200 rounded hover:bg-white disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Campaigns Board Tab ── */}
        {activePage === "campaigns" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={campaignSearch}
                    onChange={(e) => { setCampaignSearch(e.target.value); setCampaignPage(1); }}
                    placeholder="Search campaign title..."
                    className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:border-yellow-500 focus:outline-none w-64"
                  />
                </div>
                
                <select
                  value={campaignStatusFilter}
                  onChange={(e) => { setCampaignStatusFilter(e.target.value); setCampaignPage(1); }}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer"
                >
                  <option value="">All Campaign Statuses</option>
                  <option value="pending">Pending Moderation</option>
                  <option value="active">Active (Live)</option>
                  <option value="draft">Drafts</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Denied / Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-150/60">
                  <thead className="bg-gray-50 font-black text-gray-400 text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-5 text-left">Campaign Title</th>
                      <th className="px-6 py-5 text-left">Creator</th>
                      <th className="px-6 py-5 text-left">Goal (USD)</th>
                      <th className="px-6 py-5 text-left">Status</th>
                      <th className="px-6 py-5 text-left">Created Date</th>
                      <th className="px-6 py-5 text-center">Moderation Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-bold text-gray-600 text-xs">
                    {campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                          No campaigns found matching current search configurations.
                        </td>
                      </tr>
                    ) : (
                      campaigns.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-gray-905 font-black">{c.campaignName}</td>
                          <td className="px-6 py-4">{c.user?.name || "Deleted User"}</td>
                          <td className="px-6 py-4">${c.campaignConfig?.basics?.goal?.toLocaleString() || "0"}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              c.status === "active" ? "bg-green-50 text-green-600 border border-green-100" : c.status === "pending" ? "bg-yellow-50 text-yellow-600 border border-yellow-100 animate-pulse" : c.status === "cancelled" ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-105 text-gray-500"
                            }`}>
                              {c.status === "cancelled" ? "denied" : c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="px-6 py-4 flex items-center justify-center gap-2">
                            <button
                              onClick={() => setInspectingCampaign(c)}
                              className="p-2 text-gray-400 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            <button
                              onClick={() => setEditingCampaign(c)}
                              className="p-2 text-gray-400 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                              title="Edit Parameters"
                            >
                              <Edit2 size={16} />
                            </button>

                            {c.status === "pending" && (
                              <>
                                <button
                                  onClick={() => setShowApprovalModal(c._id)}
                                  className="p-2 text-green-600 hover:bg-green-55 rounded-lg transition-all cursor-pointer"
                                  title="Approve & Publish Campaign"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => setShowRejectionModal(c._id)}
                                  className="p-2 text-red-550 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                  title="Deny Campaign"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}

                            {c.status === "active" && (
                              <button
                                onClick={() => handleCampaignToggleStatus(c._id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-55 rounded-lg transition-all cursor-pointer"
                                title="Pause Campaign"
                              >
                                <Power size={16} />
                              </button>
                            )}

                            {isSuperAdmin && (
                              <button
                                onClick={() => handleCampaignDelete(c._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Delete Campaign"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {campaignTotal > 15 && (
                <div className="flex justify-between items-center px-8 py-5 bg-gray-50 border-t border-gray-100 font-bold text-[10px] uppercase text-gray-400 tracking-wider">
                  <span>Total Campaigns: {campaignTotal}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCampaignPage((p) => Math.max(p - 1, 1))}
                      disabled={campaignPage === 1}
                      className="p-1.5 border border-gray-200 rounded hover:bg-white disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span>Page {campaignPage}</span>
                    <button
                      onClick={() => setCampaignPage((p) => (p * 15 < campaignTotal ? p + 1 : p))}
                      disabled={campaignPage * 15 >= campaignTotal}
                      className="p-1.5 border border-gray-200 rounded hover:bg-white disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── System Audit Logs ── */}
        {activePage === "audit-logs" && isSuperAdmin && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <Layers className="text-indigo-600" size={22} /> Chronological Audit Trails
            </h2>
            
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-150/60">
                  <thead className="bg-gray-50 font-black text-gray-400 text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-5 text-left">Timestamp</th>
                      <th className="px-6 py-5 text-left">Actor Identity</th>
                      <th className="px-6 py-5 text-left">Action Trigger</th>
                      <th className="px-6 py-5 text-left">Database Model</th>
                      <th className="px-6 py-5 text-left">Detailed Summary</th>
                      <th className="px-6 py-5 text-left">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-bold text-gray-500 text-xs font-mono">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-gray-400 font-sans">
                          No audit trails logged in the system.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-sans text-gray-900 font-bold">
                            {log.adminId?.name} <span className="text-gray-400">({log.adminId?.email})</span>
                          </td>
                          <td className="px-6 py-4 text-indigo-600 font-bold font-sans uppercase text-[10px]">{log.actionType}</td>
                          <td className="px-6 py-4 font-sans uppercase text-[9px] text-gray-400 font-black">{log.targetModel}</td>
                          <td className="px-6 py-4 font-sans text-gray-700 max-w-xs truncate" title={log.description}>
                            {log.description}
                          </td>
                          <td className="px-6 py-4 text-[10px] text-gray-400">{log.ipAddress || "Unknown"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── MODALS & DETAILS OVERLAYS ────────────────────────── */}

      {/* User edit details modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors cursor-pointer"
              type="button"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Edit Profile & Privileges</h3>
            
            <form onSubmit={handleEditUserSubmit} className="space-y-4 font-bold text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-widest block font-black">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-widest block font-black">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-widest block font-black">System Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none cursor-pointer text-sm"
                >
                  <option value="user">User</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-widest block font-black">Account Status</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none cursor-pointer text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-yellow-400 text-black hover:bg-yellow-500 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer shadow-lg shadow-yellow-400/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Details Inspection modal */}
      {inspectingCampaign && (() => {
        const liveUrl = `${window.location.origin}/live/${inspectingCampaign._id}`;
        const liveUrlA = `${window.location.origin}/live/${inspectingCampaign._id}/a`;
        const liveUrlB = `${window.location.origin}/live/${inspectingCampaign._id}/b`;
        
        return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-2xl w-full shadow-2xl space-y-6 my-4 sm:my-8 max-h-[90vh] overflow-y-auto animate-scale-up relative">
              <button
                onClick={() => setInspectingCampaign(null)}
                className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex justify-between items-start pr-8">
                <div>
                  <span className="text-[9px] font-black uppercase text-yellow-600 tracking-widest block mb-1">Campaign Governance Details</span>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{inspectingCampaign.campaignName}</h3>
                </div>
                <span className="text-[10px] font-black uppercase px-3 py-1 bg-yellow-50 text-yellow-750 border border-yellow-100 rounded-full shrink-0">
                  {inspectingCampaign.campaignType}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-gray-600">
                
                {/* Creator & Business Identity */}
                <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-900 mb-2">Creator & Profile</h4>
                  
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Owner / User Account</span>
                    <span className="text-gray-900 font-black">{inspectingCampaign.user?.name || "Unknown Creator"}</span>
                    <span className="text-gray-400 block font-normal text-[10px]">{inspectingCampaign.user?.email || "No email"}</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Business Identity</span>
                    <span className="text-gray-900 font-black">{inspectingCampaign.businessInfo?.businessName || "No Business Registered"}</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Phone & Address</span>
                    <span className="text-gray-800 font-bold block">{inspectingCampaign.businessInfo?.phone || "No phone"}</span>
                    <span className="text-gray-500 font-medium block">
                      {inspectingCampaign.businessInfo?.address || ""}, {inspectingCampaign.businessInfo?.city || ""}, {inspectingCampaign.businessInfo?.state || ""} {inspectingCampaign.businessInfo?.zipCode || ""}
                    </span>
                  </div>
                </div>

                {/* Campaign Basics config */}
                <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-900 mb-2">Campaign Configuration</h4>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Target Budget Goal</span>
                    <span className="text-yellow-600 font-black text-sm">
                      ${inspectingCampaign.campaignConfig?.basics?.goal?.toLocaleString() || inspectingCampaign.businessInfo?.goal?.toLocaleString() || "0"} USD
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Duration & Start Date</span>
                    <span className="text-gray-900 font-black">
                      {inspectingCampaign.campaignConfig?.basics?.duration || 30} Days (Starts: {inspectingCampaign.campaignConfig?.basics?.startDate ? new Date(inspectingCampaign.campaignConfig.basics.startDate).toLocaleDateString() : "Pending approval"})
                    </span>
                  </div>

                  {inspectingCampaign.campaignConfig?.basics?.guidingStrategy && (
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Guiding Strategy</span>
                      <span className="text-yellow-600 font-black">{inspectingCampaign.campaignConfig.basics.guidingStrategy}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Payout (Stripe) Status</span>
                    {inspectingCampaign.user?.stripeAccountId ? (
                      <span className="text-green-600 font-black flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connected ({inspectingCampaign.user.stripeAccountId})
                      </span>
                    ) : (
                      <span className="text-rose-600 font-black flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Stripe Account Not Connected
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Business Description */}
              <div className="space-y-2 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-xs font-bold">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Campaign / Business Description</span>
                <p className="font-medium text-xs leading-relaxed text-gray-500">
                  {inspectingCampaign.businessInfo?.description || "No description provided."}
                </p>
              </div>

              {/* Web pages & landing URLs */}
              <div className="space-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-xs font-bold">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-900">Live Web Page Links</h4>
                  {inspectingCampaign.abTestingEnabled && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-yellow-400 text-black rounded">A/B Testing Active</span>
                  )}
                </div>

                <div className="space-y-2">
                  {inspectingCampaign.status === "active" ? (
                    inspectingCampaign.abTestingEnabled ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a
                          href={liveUrlA}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl block font-black text-gray-800 text-center hover:border-yellow-400 transition-colors"
                        >
                          View Split Test Page A ↗
                        </a>
                        <a
                          href={liveUrlB}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl block font-black text-gray-800 text-center hover:border-yellow-400 transition-colors"
                        >
                          View Split Test Page B ↗
                        </a>
                      </div>
                    ) : (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl block font-black text-gray-800 text-center hover:border-yellow-400 transition-colors"
                      >
                        Visit Campaign Live Landing Page ↗
                      </a>
                    )
                  ) : (
                    <span className="text-gray-400 block italic">Web page links will activate once campaign status is set to active.</span>
                  )}
                </div>
              </div>

              {/* Connected Advertising metrics */}
              <div className="space-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-xs font-bold">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-900">Associated Ad Platforms & Campaigns</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Google Ads */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Google Search Ad</span>
                    {inspectingCampaign.user?.googleAdAccountId ? (
                      <div className="space-y-1">
                        <span className="text-gray-900 font-black block">Connected Account ID: {inspectingCampaign.user.googleAdAccountId}</span>
                        {loadingInspectingAds ? (
                          <span className="text-gray-400 font-medium block animate-pulse">Retrieving Google statistics...</span>
                        ) : inspectingAds?.googleAd ? (
                          <div className="pt-1.5 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
                            <span className="font-black text-green-600 block uppercase">Status: {inspectingAds.googleAd.status}</span>
                            <span className="block font-bold">Daily Budget: ${inspectingAds.googleAd.dailyBudget}/day</span>
                            <div className="grid grid-cols-3 gap-1 pt-1 font-black text-[9px] uppercase">
                              <div>Clicks: <span className="text-gray-800">{inspectingAds.googleAd.clicks}</span></div>
                              <div>Imps: <span className="text-gray-800">{inspectingAds.googleAd.impressions}</span></div>
                              <div>Spend: <span className="text-gray-850">${inspectingAds.googleAd.spend}</span></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-medium block italic text-[10px]">No active ad group associated with this campaign.</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 font-bold block italic">Google Ads Integration Not Linked</span>
                    )}
                  </div>

                  {/* Meta Ads */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Meta News Feed Ad</span>
                    {inspectingCampaign.user?.metaAdAccountId ? (
                      <div className="space-y-1">
                        <span className="text-gray-900 font-black block">Connected Account ID: {inspectingCampaign.user.metaAdAccountId}</span>
                        {loadingInspectingAds ? (
                          <span className="text-gray-400 font-medium block animate-pulse">Retrieving Meta statistics...</span>
                        ) : inspectingAds?.metaAd ? (
                          <div className="pt-1.5 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
                            <span className="font-black text-green-600 block uppercase">Status: {inspectingAds.metaAd.status}</span>
                            <span className="block font-bold">Daily Budget: ${inspectingAds.metaAd.dailyBudget}/day</span>
                            <div className="grid grid-cols-3 gap-1 pt-1 font-black text-[9px] uppercase">
                              <div>Clicks: <span className="text-gray-800">{inspectingAds.metaAd.clicks}</span></div>
                              <div>Imps: <span className="text-gray-800">{inspectingAds.metaAd.impressions}</span></div>
                              <div>Spend: <span className="text-gray-850">${inspectingAds.metaAd.spend}</span></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-medium block italic text-[10px]">No active feed post ad associated with this campaign.</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 font-bold block italic">Meta Ads Integration Not Linked</span>
                    )}
                  </div>

                </div>
              </div>

              {/* Status and Notes */}
              <div className="space-y-2 text-xs font-bold text-gray-600">
                {inspectingCampaign.approvalNote && (
                  <div className="p-4 bg-green-50 text-green-700 border border-green-100 rounded-2xl">
                    <span className="font-black uppercase tracking-widest text-[9px] block mb-1">Moderator Approval Note</span>
                    {inspectingCampaign.approvalNote}
                  </div>
                )}

                {inspectingCampaign.rejectionReason && (
                  <div className="p-4 bg-red-50 text-red-655 border border-red-100 rounded-2xl">
                    <span className="font-black uppercase tracking-widest text-[9px] block mb-1">Moderator Rejection Reason</span>
                    {inspectingCampaign.rejectionReason}
                  </div>
                )}
              </div>

              <button
                onClick={() => setInspectingCampaign(null)}
                className="w-full py-4 bg-gray-955 text-white hover:bg-black rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        );
      })()}

      {/* Campaign editing modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up relative">
            <button
              onClick={() => setEditingCampaign(null)}
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors cursor-pointer"
              type="button"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Edit Campaign Parameters</h3>
            
            <form onSubmit={handleCampaignEditSubmit} className="space-y-4 font-bold text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-widest block font-black">Campaign Name</label>
                <input
                  type="text"
                  value={editingCampaign.campaignName}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, campaignName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-yellow-400 text-black hover:bg-yellow-500 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer shadow-lg shadow-yellow-400/10"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up relative">
            <button
              onClick={() => { setShowApprovalModal(null); setApprovalNote(""); }}
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Approve Campaign</h3>
            <p className="text-gray-400 font-bold text-xs leading-relaxed">
              Optional: Enter a moderation comment/approval note that will be stored on this campaign.
            </p>
            
            <div className="space-y-4 font-bold text-sm">
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Enter approval note (e.g. Campaign verified and launched successfully)..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-xs"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowApprovalModal(null); setApprovalNote(""); }}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerApprove}
                  className="flex-1 py-4 bg-green-600 text-white hover:bg-green-700 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer shadow-lg shadow-green-600/10"
                >
                  Approve & Launch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign rejection modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up relative">
            <button
              onClick={() => { setShowRejectionModal(null); setRejectionReason(""); }}
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-gray-900 tracking-tight text-red-655">Deny Campaign</h3>
            <p className="text-gray-400 font-bold text-xs leading-relaxed">
              Required: Specify the reason for denying this campaign. The reason will be stored and shown to the owner.
            </p>
            
            <div className="space-y-4 font-bold text-sm">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Specify rejection reason (e.g. Tagline violates policy or contains typo)..."
                rows={3}
                className="w-full px-4 py-3 border border-red-200 rounded-xl focus:border-red-500 focus:outline-none text-xs"
                required
              />

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowRejectionModal(null); setRejectionReason(""); }}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerReject}
                  className="flex-1 py-4 bg-red-600 text-white hover:bg-red-750 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer shadow-lg shadow-red-600/10"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User verification rejection modal */}
      {showUserRejectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up relative">
            <button
              onClick={() => { setShowUserRejectModal(null); setUserRejectReason(""); }}
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-gray-900 tracking-tight text-red-650">Reject Account Verification</h3>
            <p className="text-gray-400 font-bold text-xs leading-relaxed">
              Required: Specify the reason for rejecting this user's verification. This message will be emailed to their registered address.
            </p>
            
            <div className="space-y-4 font-bold text-sm">
              <textarea
                value={userRejectReason}
                onChange={(e) => setUserRejectReason(e.target.value)}
                placeholder="Enter rejection reason (e.g. Business details cannot be verified)..."
                rows={3}
                className="w-full px-4 py-3 border border-red-200 rounded-xl focus:border-red-550 focus:outline-none text-xs"
                required
              />

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowUserRejectModal(null); setUserRejectReason(""); }}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerRejectUser}
                  className="flex-1 py-4 bg-red-600 text-white hover:bg-red-750 rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer shadow-lg shadow-red-600/10"
                >
                  Reject & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}