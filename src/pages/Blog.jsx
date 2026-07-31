import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Search, Clock, Calendar } from "lucide-react";
import api from "../api/axios";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories] = useState([
    { id: "1", name: "Crowdfunding" },
    { id: "2", name: "Community" },
    { id: "3", name: "Strategy" }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [featuredTab, setFeaturedTab] = useState("Popular");

  const featuredRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        if (response.data.success) {
          setBlogs(response.data.data);
          setDisplayedBlogs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "" || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setDisplayedBlogs(filtered);
  }, [searchTerm, selectedCategory, blogs]);

  useEffect(() => {
    if (featuredRef.current && featuredRef.current.children.length > 0) {
      gsap.fromTo(
        featuredRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [featuredTab]);

  return (
    <div className="bg-white text-black">
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        {/* Featured Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            OUR FEATURED <span className="underline decoration-yellow-400">BLOG</span>
          </h1>
          <div className="flex gap-2">
            {["Popular", "Recent"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFeaturedTab(tab)}
                className={`px-4 py-1 rounded-full text-sm border ${featuredTab === tab
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-gray-600 border-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12" ref={featuredRef}>
          {blogs.slice(0, 3).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <div className="flex items-center gap-2 border px-4 py-2 rounded-full bg-white mb-4">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search Blogs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none w-full bg-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto whitespace-nowrap text-sm">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-1 rounded-full border ${selectedCategory === ""
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-600 border-gray-300"
                }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-1 rounded-full border ${selectedCategory === cat.name
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-gray-600 border-gray-300"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBlogs.length > 0 ? (
            displayedBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No blogs found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const BlogCard = ({ blog }) => (
  <div className="space-y-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100">
    <img
      src={blog.imageUrl || blog.coverImage}
      alt={blog.title}
      className="rounded-lg w-full h-[220px] object-cover"
    />
    <div className="px-1">
      <div className="flex items-center text-xs text-gray-500 gap-4 mb-2">
        <span className="flex items-center gap-1">
          <Clock size={14} /> {blog.readTime || 5} min read
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {new Date(blog.date || blog.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h3 className="text-base font-bold leading-snug mb-3 line-clamp-2">{blog.title}</h3>
      <Link
        to={`/blog/${blog.id}`}
        className="text-sm text-yellow-600 font-semibold hover:underline inline-flex items-center gap-1"
      >
        Read More →
      </Link>
    </div>
  </div>
);
