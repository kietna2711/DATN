export const dynamic = 'force-dynamic'; //Bắt buộc SSR, tránh lỗi khi dùng params.slug trong dynamic routes
import './postsDetail.css';
import InstagramSection from '../../../components/InstagramSection';
import SidebarBaiVietMoi from './SidebarBaiVietMoi';
// import CommentForm from './CommentForm';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

function adjustImageSrc(html: string): string {
  return html.replace(
    /<img\s+[^>]*src="(?!http)([^"]+)"[^>]*>/g,
    (match, src) => {
      const fullSrc = `http://localhost:3000${src.startsWith('/') ? '' : '/'}${src}`;
      return match.replace(src, fullSrc);
    }
  );
}

async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`http://localhost:3000/api/posts/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getRecentPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:3000/api/posts', { cache: 'no-store' });
  const data = await res.json();
  return data.items
    .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
}

const PostDetailPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug; // Lấy slug từ params
  const post = await getPost(slug);
  const recentPosts = await getRecentPosts();

  if (!post) {
    return <div className="container"><p style={{ color: 'red' }}>Không tìm thấy bài viết</p></div>;
  }

  return (
    <>
      <div className="container">
        <SidebarBaiVietMoi recentPosts={recentPosts} />

        <div className="main-content">
          <h1>{post.title}</h1>
          <div className="meta">
            <span className="date">
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: adjustImageSrc(post.content) }}
          />

          <div className="share-comment-container">
            <div className="share-section">
              <span>Chia sẻ</span>
              <div className="social-icons">
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" /></a>
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" /></a>
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" alt="Pinterest" /></a>
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" /></a>
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" /></a>
              </div>

              <div className="custom-buttons">
                <button>Dịch Vụ Nổi Bật Chỉ Có Tại Mimi Bear</button>
                <button>Video Nhà Gấu</button>
              </div>
            </div>
            {/* <CommentForm /> */}
          </div>
        </div>
      </div>

      <InstagramSection />
    </>
  );
};

export default PostDetailPage;
