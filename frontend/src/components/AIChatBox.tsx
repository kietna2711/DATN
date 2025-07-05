import React, { useState, useEffect } from "react";
import { Card, Button, Avatar, Input, Spin, Modal, Select, message as antMessage, Dropdown, Menu } from "antd";
import { CloseOutlined, LoadingOutlined, AudioOutlined, MenuOutlined } from "@ant-design/icons";

const SUPPORT_TEXTS = [
  "Xin chào Anh/Chị! Em là trợ lý AI của MiMiBear, rất vui được hỗ trợ Anh/Chị trong việc tìm kiếm sản phẩm phù hợp nhất. ",
  "Em rất sẵn lòng hỗ trợ Anh/Chị 😊"
];

const OCCASIONS = [
  { value: "sinh nhật", label: "Sinh nhật" },
  { value: "tình yêu", label: "Tình yêu" },
  // Có thể thêm dịp khác nếu backend hỗ trợ
];

const PINK = "#ffe6f3";
const PINK_DARK = "#ffb6d5";
const WHITE = "#fff";

const EMOJIS = [
  { key: "heart", icon: "❤️" },
  { key: "like", icon: "👍" },
  { key: "haha", icon: "😂" },
  { key: "wow", icon: "😮" },
  { key: "cry", icon: "😭" },
  { key: "dislike", icon: "👎" }
];

// Extend the Window interface to include SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function AIChatBox() {
  const [textIdx, setTextIdx] = useState(0);
  const [anim, setAnim] = useState(false);
  const [showSupport, setShowSupport] = useState(true);
  const [hover, setHover] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  const [showGift, setShowGift] = useState(false);
  const [giftName, setGiftName] = useState("");
  const [giftOccasion, setGiftOccasion] = useState("");
  const [giftResult, setGiftResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [giftLoading, setGiftLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [reactions, setReactions] = useState<{ [key: number]: string | null }>({});
  const [showEmoji, setShowEmoji] = useState<number | null>(null);
  const [hoverMsg, setHoverMsg] = useState<number | null>(null);
  const [showTeddy, setShowTeddy] = useState(false);
  const [teddyInput, setTeddyInput] = useState("");
  const [teddyReply, setTeddyReply] = useState<string | null>(null);
  const [teddyLoading, setTeddyLoading] = useState(false);

  type Message = {
    role: string;
    content: string;
    image?: string;
    isHtml?: boolean;
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: SUPPORT_TEXTS[0] },
    { role: "bot", content: SUPPORT_TEXTS[1] }
  ]);
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

  const sendMessage = async (msg?: string) => {
    const userMsg = (msg || input).trim();
    if (!userMsg) return;
    setMessages(msgs => [...msgs, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    // Nhận diện yêu cầu tạo lời chúc
    const regex =
      /(chúc|lời chúc|tạo lời chúc|thiệp|tạo thiệp|chúc mừng)[\s:]*((sinh nhật|tình yêu|birthday|love)[\s\S]*?)(?:cho|tặng|dành cho|cho|tới|đến)?[\s:]*((người|bạn)?(?: tên)? )?([\w\sÀ-ỹ]+)/i;
    const match = userMsg.match(regex);

    let occasion = "";
    let name = "";

    if (match) {
      occasion = match[2]?.trim() || match[3]?.trim() || "sinh nhật";
      name = match[6]?.trim() || "";
    } else if (/thiệp.*sinh nhật/i.test(userMsg)) {
      occasion = "sinh nhật";
      const nameMatch = userMsg.match(/sinh nhật(?: cho| tặng)? ([\w\sÀ-ỹ]+)/i);
      name = nameMatch ? nameMatch[1].trim() : "";
    }

    if (occasion && name) {
      try {
        // Gọi API tạo lời chúc
        const res = await fetch("http://localhost:3001/api/gift-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, occasion })
        });
        const data = await res.json();

        setMessages(msgs => [
          ...msgs,
          {
            role: "bot",
            content: `🎁 Lời chúc tặng quà cho ${name} (${occasion}):\n${data.message}`
          }
        ]);
      } catch {
        setMessages(msgs => [
          ...msgs,
          { role: "bot", content: "Có lỗi khi tạo lời chúc, vui lòng thử lại!" }
        ]);
      }
      setLoading(false);
      return;
    }

    // Nếu không phải tạo lời chúc, trả về câu chào mặc định
    setMessages(msgs => [
      ...msgs,
      { role: "bot", content: "Chào Anh/Chị! Em có thể giúp gì cho Anh/Chị hôm nay?" }
    ]);
    setLoading(false);
    return;
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

  // Hàm gọi API tạo lời chúc
  const handleGiftMessage = async () => {
    if (!giftName.trim() || !giftOccasion) {
      antMessage.warning("Vui lòng nhập tên và chọn dịp tặng quà!");
      return;
    }
    setGiftLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/gift-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: giftName, occasion: giftOccasion })
      });
      const data = await res.json();
      setGiftResult(data.message);

      // Thêm lời chúc vào lịch sử chat như tin nhắn bot
      setMessages(msgs => [
        ...msgs,
        {
          role: "bot",
          content: `🎁 Lời chúc tặng quà cho ${giftName} (${giftOccasion}):\n${data.message}`
        }
      ]);
    } catch {
      setGiftResult("Có lỗi khi tạo lời chúc, vui lòng thử lại!");
    }
    setGiftLoading(false);
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ nhận diện giọng nói!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN"; // hoặc "en-US"
    recognition.continuous = false; // chỉ nghe 1 câu, dừng sẽ tự tắt
    recognition.interimResults = false; // chỉ lấy kết quả cuối cùng
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setListening(false); // khi dừng nói sẽ tắt mic
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const sendTeddy = async () => {
    const userMsg = teddyInput.trim();
    if (!userMsg) return;
    setTeddyInput("");
    setTeddyLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/bear-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const blob = await res.blob();
      // Phát audio trả về
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      setTeddyReply("Gấu đã trả lời, bé hãy lắng nghe nhé!");
    } catch {
      setTeddyReply("Có lỗi khi gửi tin nhắn, vui lòng thử lại!");
    }
    setTeddyLoading(false);
  };

  const startTeddyVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      antMessage.warning("Trình duyệt không hỗ trợ nhận diện giọng nói!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTeddyInput(transcript);
      setTimeout(sendTeddy, 300); // Gửi luôn sau khi nhận giọng nói
    };
    recognition.start();
  };

  return (
    <>
      {/* Modal Gấu biết nói luôn được render */}
      <Modal
        open={showTeddy}
        title="🐻 Gấu biết nói"
        onCancel={() => setShowTeddy(false)}
        footer={null}
        centered
      >
        <div style={{ marginBottom: 12, color: "#d63384", fontWeight: 500 }}>
          Gợi ý cho bé: <br />
          <span style={{ marginRight: 8 }}>“Gấu tên gì?”</span>
          <span style={{ marginRight: 8 }}>“Gấu thích ăn gì?”</span>
          <span>“Hôm nay gấu làm gì?”</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <Input
            placeholder="Bé hỏi gì với Gấu?"
            value={teddyInput}
            onChange={e => setTeddyInput(e.target.value)}
            onPressEnter={sendTeddy}
            style={{ marginBottom: 8 }}
          />
          <Button
            icon={<AudioOutlined />}
            onClick={startTeddyVoice}
            style={{ marginRight: 8 }}
          >
            Nói với Gấu
          </Button>
          <Button
            type="primary"
            style={{ background: PINK_DARK, border: "none" }}
            onClick={sendTeddy}
          >
            Gửi
          </Button>
        </div>
        <div style={{ minHeight: 40 }}>
          {teddyLoading ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 22, color: PINK_DARK }} spin />} />
          ) : (
            teddyReply && (
              <div style={{ background: PINK, borderRadius: 10, padding: 10, color: "#d63384" }}>
                <b>Gấu:</b> {teddyReply}
              </div>
            )
          )}
        </div>
      </Modal>

      {/* Giao diện chatbox lớn hoặc mini */}
      {showChat ? (
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
                  onMouseEnter={() => setHoverMsg(i)}
                  onMouseLeave={() => setHoverMsg(null)}
                  style={{
                    background: msg.role === "bot" ? "#f7f7fa" : "#fff",
                    borderRadius: 16,
                    padding: "7px 14px",
                    marginBottom: 8,
                    fontSize: 15,
                    color: msg.role === "bot" ? "#222" : "#fff",
                    position: "relative",
                    maxWidth: "70%",
                    alignSelf: msg.role === "bot" ? "flex-start" : "flex-end",
                    border: msg.role === "user" ? "none" : "none",
                    boxShadow: msg.role === "bot" ? "0 1px 4px #ececec" : "0 1px 4px #fce4ec",
                    fontWeight: 400,
                    textAlign: "left",
                    wordBreak: "break-word",
                    lineHeight: 1.5,
                    marginLeft: msg.role === "bot" ? 0 : "auto",
                    marginRight: msg.role === "user" ? 0 : "auto",
                    backgroundColor: msg.role === "user" ? "#d63384" : "#f7f7fa",
                  }}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="user upload"
                      style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8, marginBottom: 4 }}
                    />
                  )}
                  {msg.role === "bot" && msg.isHtml ? (
                    <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                  ) : (
                    msg.content
                  )}
                  {reactions[i] && (
                    <span
                      style={{
                        position: "absolute",
                        right: -18,
                        bottom: -18,
                        zIndex: 1,
                        background: "#fff",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px #eee",
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        color: "#ff4d6d"
                      }}
                    >
                      {EMOJIS.find(e => e.key === reactions[i])?.icon}
                    </span>
                  )}
                  {(hoverMsg === i || reactions[i]) && (
                    <div
                      style={{
                        position: "absolute",
                        right: -18,
                        bottom: -18,
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center"
                      }}
                      onMouseEnter={() => setShowEmoji(i)}
                      onMouseLeave={() => setShowEmoji(null)}
                    >
                      <Button
                        type="text"
                        icon={
                          <span style={{ fontSize: 20, color: reactions[i] ? "#ff4d6d" : "#bbb" }}>
                            {reactions[i] ? EMOJIS.find(e => e.key === reactions[i])?.icon : "♡"}
                          </span>
                        }
                        style={{
                          background: "#fff",
                          border: "none",
                          boxShadow: "0 2px 8px #eee",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          borderRadius: "50%",
                          width: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      />
                      {showEmoji === i && (
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            bottom: 30,
                            right: -4,
                            background: "#fff",
                            borderRadius: 20,
                            boxShadow: "0 2px 8px #eee",
                            padding: "4px 6px",
                            zIndex: 10,
                            gap: 6
                          }}
                        >
                          {EMOJIS.map(e => (
                            <span
                              key={e.key}
                              style={{
                                fontSize: 18,
                                cursor: "pointer",
                                transition: "transform 0.1s",
                                transform: reactions[i] === e.key ? "scale(1.2)" : "scale(1)"
                              }}
                              onClick={() => {
                                setReactions(r => ({
                                  ...r,
                                  [i]: r[i] === e.key ? null : e.key
                                }));
                                setShowEmoji(null);
                              }}
                            >
                              {e.icon}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
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
                prefix={
                  <Dropdown
                    trigger={["click"]}
                    overlay={
                      <Menu>
                        <Menu.Item key="gift" onClick={() => setShowGift(true)}>
                          🎁 Tạo thiệp chúc mừng
                        </Menu.Item>
                        <Menu.Item key="teddy" onClick={() => {
  setShowTeddy(true);
  setTeddyInput("");
  setTeddyReply(null);
}}>
  🐻 AI nói chuyện với bé
</Menu.Item>
                      </Menu>
                    }
                    placement="bottomLeft"
                  >
                    <Button
                      type="text"
                      icon={<MenuOutlined style={{ fontSize: 22, color: "#888" }} />}
                      style={{
                        background: "none",
                        border: "none",
                        boxShadow: "none",
                        padding: 0,
                        margin: 0,
                        marginRight: 4,
                        marginLeft: -8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    />
                  </Dropdown>
                }
                suffix={
                  <>
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
                    <Button
                      icon={<AudioOutlined />}
                      onClick={startVoice}
                      loading={listening}
                      style={{ marginLeft: 8 }}
                    />
                  </>
                }
              />
            </div>
            {listening && (
              <div style={{ fontSize: 12, color: "#d63384", marginTop: 4, textAlign: "center" }}>
                Đang lắng nghe, vui lòng nói...
              </div>
            )}
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
      ) : (
        // Giao diện mini + icon AI
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
                variant="outlined"
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
                <Button
                  type="primary"
                  style={{
                    background: PINK_DARK,
                    color: "#fff",
                    marginTop: 10,
                    width: "100%",
                    border: "none"
                  }}
                  onClick={() => {
                    setShowGift(true);
                    setGiftResult(null);
                    setGiftName("");
                    setGiftOccasion("");
                  }}
                >
                  🎁 Tạo lời chúc tặng quà
                </Button>
              </Card>
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

          {/* Modal tạo lời chúc */}
          <Modal
            open={showGift}
            title="Tạo lời chúc tặng quà"
            onCancel={() => setShowGift(false)}
            footer={null}
            centered
          >
            <div style={{ marginBottom: 12 }}>
              <Input
                placeholder="Tên người nhận"
                value={giftName}
                onChange={e => setGiftName(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <Select
                placeholder="Chọn dịp tặng quà"
                options={OCCASIONS}
                value={giftOccasion || undefined}
                onChange={setGiftOccasion}
                style={{ width: "100%" }}
              />
            </div>
            <Button
              type="primary"
              loading={giftLoading}
              style={{ background: PINK_DARK, border: "none", width: "100%" }}
              onClick={handleGiftMessage}
            >
              Tạo lời chúc
            </Button>
            {giftResult && (
              <div
                style={{
                  marginTop: 18,
                  background: PINK,
                  color: "#d63384",
                  borderRadius: 10,
                  padding: 12,
                  fontWeight: 500,
                  textAlign: "center"
                }}
              >
                {giftResult}
              </div>
            )}
          </Modal>
        </div>
      )}
    </>
  );
}