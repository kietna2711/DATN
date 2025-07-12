import './postsDetail.css';
import InstagramSection from '../../../components/InstagramSection';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

// ✅ Hàm xử lý đường dẫn ảnh để thêm domain đầy đủ
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
  const res = await fetch(`http://localhost:3000/api/posts/slug/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function getRecentPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  });
  const data = await res.json();
  const sorted = data.items.sort(
    (a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted.slice(0, 5);
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const recentPosts = await getRecentPosts();

  if (!post) {
    return (
      <div className="container">
        <p style={{ color: 'red' }}>Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        {/* Sidebar bên trái */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">BÀI VIẾT MỚI</div>
          </div>
          <ul className="sidebar-menu">
            {recentPosts.map((item) => (
              <li key={item._id} className="menu-item">
                <a href={`/posts/detail/${item.slug}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Nội dung chính */}
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

          {/* Phần chia sẻ & bình luận */}
          <div className="share-comment-container">
            {/* Social Share */}
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
                <button>Dịch Vụ Nổi Bật Chỉ Có Tại Bemori</button>
                <button>Video Nhà Gấu</button>
              </div>
            </div>

            {/* Comment Form */}
            <div className="comment-section">
              <h3>Để lại một bình luận</h3>
              <p className="note">
                Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu
                <span className="required">*</span>
              </p>

              <form className="comment-form">
                <label htmlFor="comment">Bình luận <span className="required">*</span></label>
                <textarea id="comment" rows={6}></textarea>

                <label htmlFor="name">Tên <span className="required">*</span></label>
                <input type="text" id="name" />

                <label htmlFor="email">Email <span className="required">*</span></label>
                <input type="email" id="email" />

                <label htmlFor="website">Trang web</label>
                <input type="url" id="website" />

                <div className="checkbox">
                  <input type="checkbox" id="save-info" />
                  <label htmlFor="save-info">
                    Lưu tên của tôi, email, và trang web trong trình duyệt này cho lần bình luận kế tiếp của tôi.
                  </label>
                </div>

                <button type="submit" className="submit-btn">Gửi bình luận</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Instagram */}
      <InstagramSection />
    </>
  );
}
