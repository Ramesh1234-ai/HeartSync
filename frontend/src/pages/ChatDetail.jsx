import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";
import "./ChatDetail.css";

function ChatDetail() {
  const { id } = useParams();
  const { isLoaded, userId, getToken } = useAuth();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch chat details (only if not creating new chat)
  useEffect(() => {
    if (!isLoaded || !userId) return;

    if (id === "new") {
      // Create new chat
      setChat({
        _id: "new",
        title: "New Chat",
        messages: [],
      });
      setLoading(false);
      return;
    }

    // Fetch existing chat
    const fetchChat = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await fetch(
          `http://localhost:3000/api/chats/${id}?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch chat");

        const data = await response.json();
        setChat(data.chat);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching chat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [isLoaded, userId, id, getToken]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const token = await getToken();

      let response;

      // If it's a new chat, create it first
      if (id === "new" || !chat._id || chat._id === "new") {
        const createResponse = await fetch(
          "http://localhost:3000/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              messages: [
                {
                  role: "user",
                  content: newMessage,
                },
              ],
            }),
          }
        );

        if (!createResponse.ok) throw new Error("Failed to create chat");

        const createData = await createResponse.json();
        const newChat = createData.chat;
        setChat(newChat);

        // Update URL to reflect the new chat ID
        navigate(`/chat/${newChat._id}`, { replace: true });

        setNewMessage("");
        setSending(false);
        return;
      }

      // Add message to existing chat
      response = await fetch(
        `http://localhost:3000/api/chats/${id}/message`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            role: "user",
            content: newMessage,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add message");

      const data = await response.json();
      setChat(data.chat);
      setNewMessage("");

      // Auto-scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.querySelector(".messages-container");
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!isLoaded) {
    return <div className="chat-detail-container">Loading...</div>;
  }

  if (loading) {
    return <div className="chat-detail-container">Loading chat...</div>;
  }

  if (error) {
    return (
      <div className="chat-detail-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => navigate("/history")}>Back to History</button>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="chat-detail-container">
        <div className="error-state">
          <p>Chat not found</p>
          <button onClick={() => navigate("/history")}>Back to History</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-detail-container">
      <div className="chat-header">
        <button
          className="back-btn"
          onClick={() => navigate("/history")}
          title="Back to history"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>{chat.title}</h1>
        <div style={{ width: "40px" }} /> {/* Spacer for centering */}
      </div>

      <div className="messages-container">
        {chat.messages.length === 0 ? (
          <div className="empty-messages">
            <MessageSquare size={48} />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="messages">
            {chat.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message message-${msg.role}`}
              >
                <div className="message-content">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
          className="message-input"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="send-btn"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatDetail;
