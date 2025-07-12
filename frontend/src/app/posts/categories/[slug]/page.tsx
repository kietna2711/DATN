'use client';
import { use, useEffect, useState } from 'react';
import './categorypage.css';
import InstagramSection from '../../../components/InstagramSection'; 

interface Post {
  _id: string;
  title: string;
  slug: string;
  shortDesc: string;
  img?: string;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // ✅ unwrap Promise

  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/by-category-slug/${slug}`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch posts');

        const data = await res.json();
        setPosts(data.items);
        setCategoryTitle(data.categoryTitle || '');
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      }
    };

    fetchPostsByCategory();
  }, [slug]);

  return (
    <>
      <div className="services-container">
        <h2 className="services-title">
          Bài viết: {categoryTitle || decodeURIComponent(slug)}
        </h2>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div className="services-grid">
          {posts.map((post) => (
            <div key={post._id} className="service-card">
              <img
                className="service-img"
                src={`http://localhost:3000/images/${post.img || 'default.jpg'}`}
                alt={post.title}
              />
              <a href={`/posts/detail/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div className="service-desc">{post.shortDesc}</div>
              </a>
              <div className="service-link-wrap">
                <hr />
                <a className="service-link" href={`/posts/detail/${post.slug}`}>
                  Xem thêm
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*PHẦN INSTAGRAM*/}
      <InstagramSection />
    </>
  );
}
