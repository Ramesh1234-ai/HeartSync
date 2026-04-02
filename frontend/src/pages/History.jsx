import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, MessageSquare } from "lucide-react";
import Navbar from "../components/common/navbar";
import Sidebar from "../components/common/sidebar";
import "./History.css";
function History() {
  const { isLoaded, userId, getToken } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch all chats
  useEffect(() => {
    if (!isLoaded || !userId) return;
    const fetchChats = async () => {
      try {
        const token = await getToken();

        const res = await fetch("http://localhost:3000/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch chats");

        const data = await res.json();
        console.log(data);

      } catch (err) {
        console.error("Error fetching chats:", err);
      }
      fetchChats();
    };
  }, [isLoaded, userId]);

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: new Date(date).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Delete chat
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3000/api/chats/${chatId}?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete chat");

      setChats(chats.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert("Failed to delete chat");
    }
  };

  // Create new chat
  const handleNewChat = () => {
    navigate("/chat/new");
  };

  if (!isLoaded) {
    return (
      <div className="history-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-4 flex overflow-hidden pt-16">
        {/* Sidebar */}
        <Sidebar />
        <div className="history-container">
          <div className="history-header">
            <h1>Chat History</h1>
            <button className="new-chat-btn" onClick={handleNewChat}>
              <Plus size={20} /> New Chat
            </button>
          </div>

          {loading && <div className="loading">Loading chats...</div>}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && chats.length === 0 && (
            <div className="empty-state">
              <MessageSquare size={48} />
              <h2>No chats yet</h2>
              <p>Start a new conversation to begin</p>
              <button className="new-chat-btn" onClick={handleNewChat}>
                <Plus size={20} /> Create First Chat
              </button>
            </div>
          )}

          {!loading && !error && chats.length > 0 && (
            <div className="chats-list">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className="chat-item"
                  onClick={() => navigate(`/chat/${chat._id}`)}
                >
                  <div className="chat-info">
                    <h3 className="chat-title">{chat.title}</h3>
                    <p className="chat-date">{formatDate(chat.createdAt)}</p>
                    <p className="chat-preview">
                      {chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteChat(chat._id, e)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default History;
