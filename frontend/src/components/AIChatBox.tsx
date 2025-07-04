import React, { useState, useEffect } from "react";
import { Card, Button, Avatar, Input, Spin } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";

const BEST_SELLERS = [
  "Gấu bông MiMiBear",
  "Gấu bông Teddy",
  "Gấu bông Bông Bông",
];

const SUPPORT_TEXTS = [
  "Xin chào Anh/Chị! Em là trợ lý AI của MiMiBear, rất vui được hỗ trợ Anh/Chị trong việc tìm kiếm sản phẩm phù hợp nhất. ",
  "Em rất sẵn lòng hỗ trợ Anh/Chị 😊"
];

const PINK = "#ffe6f3";
const PINK_DARK = "#ffb6d5";
const WHITE = "#fff";

export default function AIChatBox() {
  const [textIdx, setTextIdx] = useState(0);
  const [anim, setAnim] = useState(false);
  const [showSupport, setShowSupport] = useState(true);
  const [hover, setHover] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  type Message = {
    role: string;
    content: string;
    image?: string;
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: SUPPORT_TEXTS[0] },
    { role: "bot", content: SUPPORT_TEXTS[1] }
  ]);
  const [loading, setLoading] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState<string[]>(BEST_SELLERS);
  const [showSuggestions, setShowSuggestions] = useState(true); // Thêm state để kiểm soát hiển thị gợi ý
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSupport) return;
    const timer = setInterval(() => {
      setAnim(true);
      setTimeout(() => {
        setTextIdx(idx => (idx + 1) % SUPPORT_TEXTS.length);
        setAnim(false);
      }, 350);
    }, 2200);
    return () => clearInterval(timer);
  }, [showSupport]);

  useEffect(() => {
    if (showChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showChat]);

  useEffect(() => {
    if (!showSupport) return;
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => {
        // Giả sử data là mảng sản phẩm, mỗi sản phẩm có thuộc tính 'name'
        if (Array.isArray(data) && data.length > 0) {
          setProductSuggestions(data.slice(0, 3).map((item: any) => item.name));
        }
      })
      .catch(() => setProductSuggestions(BEST_SELLERS));
  }, [showSupport]);

  const sendMessage = async (msg?: string) => {
    const userMsg = (msg || input).trim();
    if (!userMsg) return;
    setMessages(msgs => [...msgs, { role: "user", content: userMsg }]);
    setInput("");
    setShowSuggestions(false); // Ẩn gợi ý khi gửi tin nhắn
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(msgs => [
        ...msgs,
        { role: "bot", content: data.reply || "Xin lỗi, em chưa hiểu ý Anh/Chị." }
      ]);
    } catch {
      setMessages(msgs => [
        ...msgs,
        { role: "bot", content: "Có lỗi kết nối tới máy chủ. Vui lòng thử lại sau!" }
      ]);
    }
    setLoading(false);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          // Tạo URL tạm để hiển thị ảnh
          const imageUrl = URL.createObjectURL(file);
          setMessages(msgs => [
            ...msgs,
            { role: "user", content: "Đã gửi ảnh", image: imageUrl }
          ]);
          const formData = new FormData();
          formData.append("image", file);
          setLoading(true);
          try {
            const res = await fetch("http://localhost:3001/api/predict-image", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.product) {
              let productMessage = `${data.product.name}\nGiá: ${data.product.price?.toLocaleString()} đ\n${data.product.description || ""}`;
              setMessages(msgs => [
                ...msgs,
                {
                  role: "bot",
                  content: productMessage,
                  image: data.product.image_url
                    ? `http://localhost:3000/images/${data.product.image_url}`
                    : undefined
                }
              ]);
            } else {
              setMessages(msgs => [
                ...msgs,
                { role: "bot", content: "Không tìm thấy sản phẩm tương tự." }
              ]);
            }
          } catch {
            setMessages(msgs => [
              ...msgs,
              { role: "bot", content: "Có lỗi khi nhận diện ảnh." }
            ]);
          }
          setLoading(false);
        }
        e.preventDefault();
        break;
      }
    }
  };

  // Giao diện chatbox lớn
  if (showChat) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          zIndex: 1000,
          width: 400,
          height: 600,
          background: WHITE,
          borderRadius: "18px 0 0 0",
          boxShadow: "0 4px 24px #eeb6d2",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div style={{
          background: PINK_DARK,
          borderRadius: "18px 0 0 0",
          padding: "16px 20px 12px 20px",
          display: "flex",
          alignItems: "center",
          color: "#fff",
          position: "relative"
        }}>
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            size={36}
            style={{ marginRight: 12, background: "#fff" }}
          />
          <span style={{ fontWeight: 600, fontSize: 20 }}>
            MiMiBear
          </span>
          <Button
            type="text"
            icon={<CloseOutlined />}
            style={{
              position: "absolute",
              right: 12,
              top: 10,
              color: "#fff",
              fontSize: 22
            }}
            onClick={() => setShowChat(false)}
          />
        </div>
        {/* Nội dung chat */}
        <div style={{
          flex: 1,
          padding: "24px 0 0 0",
          overflowY: "auto",
          background: WHITE
        }}>
          <div
            style={{
              margin: "0 24px 16px 24px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  background: msg.role === "bot" ? PINK : WHITE,
                  borderRadius: 14,
                  padding: "12px 16px",
                  marginBottom: 10,
                  fontSize: 16,
                  color: "#d63384",
                  position: "relative",
                  maxWidth: "80%",
                  alignSelf: msg.role === "bot" ? "flex-start" : "flex-end",
                  border: msg.role === "user" ? `1.5px solid ${PINK_DARK}` : "none",
                  boxShadow: msg.role === "user" ? "0 1px 4px #fce4ec" : "none",
                  fontWeight: msg.role === "user" ? 600 : 400,
                  textAlign: "left"
                }}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="user upload"
                    style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, marginBottom: 6 }}
                  />
                )}
                {msg.content}
              </div>
            ))}
            {/* Chỉ hiện gợi ý nếu showSuggestions = true */}
            {showSuggestions && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 10,
                  margin: "0 0 12px 0"
                }}
              >
                {productSuggestions.map((s, i) => (
                  <Button
                    key={i}
                    style={{
                      borderRadius: 22,
                      border: `1.5px solid ${PINK_DARK}`,
                      fontWeight: 500,
                      fontSize: 16,
                      background: WHITE,
                      color: "#d63384",
                      boxShadow: "0 2px 8px #fce4ec",
                      marginBottom: 4,
                      width: 200,
                      maxWidth: 200, // Giới hạn chiều rộng tối đa
                      wordBreak: "break-word",
                      textAlign: "center",
                      whiteSpace: "nowrap", // Không xuống dòng
                      overflow: "hidden",   // Ẩn phần vượt quá
                      textOverflow: "ellipsis", // Hiện dấu ...
                      display: "block"
                    }}
                    size="large"
                    onClick={() => sendMessage(s)}
                    disabled={loading}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        {/* Input chat */}
        <div style={{
          padding: "16px 16px 8px 16px",
          borderTop: `1px solid ${PINK}`,
          background: WHITE
        }}>
          <div onPaste={handlePaste}>
            <Input
              placeholder="Nhập tin nhắn..."
              size="large"
              value={input}
              onChange={e => setInput(e.target.value)}
              onPressEnter={() => sendMessage()}
              style={{ borderRadius: 10, border: `1.5px solid ${PINK_DARK}` }}
              suffix={
                <Button
                  type="text"
                  icon={
                    <svg width="28" height="28" fill="#d63384" viewBox="0 0 24 24">
                      <path d="M2.01 21l20.99-9-20.99-9-.01 7 15 2-15 2z"></path>
                    </svg>
                  }
                  onClick={() => sendMessage()}
                  style={{
                    background: "none",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                    margin: 0
                  }}
                />
              }
            />
          </div>
          <div style={{ fontSize: 12, color: "#d63384", marginTop: 4, textAlign: "center" }}>
            Thông tin chỉ mang tính tham khảo, được tư vấn bởi Trí Tuệ Nhân Tạo
          </div>
        </div>
        {loading && (
          <div style={{
            padding: "12px 0",
            textAlign: "center",
            background: WHITE,
            borderTop: `1px solid ${PINK}`,
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14
          }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: PINK_DARK }} spin />} />
          </div>
        )}
      </div>
    );
  }

  // Giao diện mini + icon AI
  return (
    <div
      style={{
        position: "fixed",
        bottom: 18,
        right: 18,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
      }}
    >
      {showSupport && (
        <>
          <Card
            bordered={false}
            style={{
              minWidth: 220,
              maxWidth: 250,
              borderRadius: 14,
              boxShadow: "0 2px 10px #f8bbd0",
              marginBottom: 6,
              padding: 0,
              overflow: "hidden",
              position: "relative",
              background: WHITE
            }}
            styles={{
              body: { padding: "10px 14px 8px 14px", background: WHITE }
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
              <Avatar
                src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                size={26}
                style={{ marginRight: 8, background: PINK_DARK }}
              />
              <span style={{ fontWeight: 600, fontSize: 15, color: "#d63384" }}>
                MiMiBear
              </span>
              {hover && (
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  size="small"
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    color: "#d63384"
                  }}
                  onClick={() => setShowSupport(false)}
                />
              )}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#d63384",
                lineHeight: 1.5,
                minHeight: 40,
                transition: "opacity 0.35s, transform 0.35s",
                opacity: anim ? 0 : 1,
                transform: anim ? "translateY(16px)" : "translateY(0)",
                willChange: "opacity, transform"
              }}
              key={textIdx}
            >
              {SUPPORT_TEXTS[textIdx]}
            </div>
          </Card>
          {/* Các nút sản phẩm gợi ý */}
          <div style={{ width: 180, display: "flex", flexDirection: "column", gap: 8 }}>
            {productSuggestions.map((s, i) => (
              <Button
                key={i}
                style={{
                  borderRadius: 18,
                  border: `1.2px solid ${PINK_DARK}`,
                  fontWeight: 500,
                  fontSize: 14,
                  background: WHITE,
                  color: "#d63384",
                  boxShadow: "0 1px 4px #fce4ec",
                  width: 180,
                  padding: 0,
                  textAlign: "center"
                }}
                block
                size="middle"
                onClick={() => {
                  setShowChat(true);
                  setTimeout(() => sendMessage(s), 300);
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={s}
                >
                  {s}
                </span>
              </Button>
            ))}
          </div>
        </>
      )}
      {/* Icon tròn nổi ở góc */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{
          width: 52,
          height: 52,
          marginTop: 12,
          background: PINK_DARK,
          border: "none",
          boxShadow: "0 2px 8px #f8bbd0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
        onClick={() => setShowChat(true)}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
          alt="AI"
          width={34}
          height={34}
          style={{ borderRadius: "50%" }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 4,
            right: 6,
            background: WHITE,
            color: "#d63384",
            borderRadius: 8,
            fontSize: 10,
            padding: "0px 5px",
            fontWeight: 600,
            border: `1px solid ${PINK_DARK}`
          }}
        >
        </span>
      </Button>
    </div>
  );
}