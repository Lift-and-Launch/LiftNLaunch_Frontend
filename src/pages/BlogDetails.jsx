import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const [blogRes, allBlogsRes] = await Promise.all([
          api.get(`/blogs/${id}`),
          api.get('/blogs')
        ]);
        
        if (blogRes.data.success) {
          setBlog(blogRes.data.data);
        }
        
        if (allBlogsRes.data.success) {
          const related = allBlogsRes.data.data
            .filter(b => b._id !== id && b.id !== id)
            .slice(0, 3);
          setRelatedBlogs(related);
        }
      } catch (error) {
        console.error("Error fetching blog details", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogDetails();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  return (
    <div className="bg-white text-black">
      <section className="max-w-screen-md mx-auto px-4 py-16">
        {/* COVER IMAGE */}
        <img
          src={blog.imageUrl || blog.coverImage}
          alt={blog.title}
          className="rounded-xl w-full h-auto object-cover mb-8"
        />

        {/* CATEGORY */}
        <div className="text-xs text-yellow-600 font-bold mb-4 uppercase tracking-widest">
          {blog.category || "General"}
        </div>

        {/* METADATA */}
        <div className="flex items-center text-xs text-gray-500 gap-6 mb-6">
          <span className="flex items-center gap-1.5"><Clock size={16} /> {blog.readTime || 5} min read</span>
          <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(blog.date || blog.createdAt).toLocaleDateString()}</span>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 leading-tight text-gray-900">{blog.title}</h1>

        {/* CONTENT */}
        <div
          className="prose prose-yellow max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </section>

      {/* RELATED BLOGS */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-4 pb-24">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Related Blogs</h2>
            <div className="flex gap-3">
              <button className="bg-yellow-400 hover:bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-sm">
                <ChevronLeft size={20} />
              </button>
              <button className="bg-yellow-400 hover:bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-sm">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedBlogs.map((b) => (
              <div key={b.id} className="group space-y-4">
                <div className="overflow-hidden rounded-xl h-[230px]">
                  <img
                    src={b.imageUrl || b.coverImage}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center text-xs text-gray-500 gap-4">
                  <span className="flex items-center gap-1"><Clock size={14} /> {b.readTime || 5} min read</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(b.date || b.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold leading-snug group-hover:text-yellow-600 transition-colors">{b.title}</h3>
                <Link to={`/blog/${b.id}`} className="text-sm text-yellow-600 font-bold flex items-center gap-1">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
