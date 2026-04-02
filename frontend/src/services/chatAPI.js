const API_BASE = "http://localhost:3000/api";

/**
 * Get auth token from Clerk
 */
const getAuthToken = async (getToken) => {
  try {
    return await getToken();
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};

/**
 * Create a new chat
 */
export const createChatAPI = async (userId, messages, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      messages,
    }),
  });

  if (!response.ok) throw new Error("Failed to create chat");
  return await response.json();
};

/**
 * Get all chats for user
 */
export const getUserChatsAPI = async (userId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/chats?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch chats");
  return await response.json();
};

/**
 * Get single chat by ID
 */
export const getChatByIdAPI = async (chatId, userId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(
    `${API_BASE}/chats/${chatId}?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch chat");
  return await response.json();
};

/**
 * Add message to chat
 */
export const addMessageToChatAPI = async (
  chatId,
  userId,
  role,
  content,
  getToken
) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/chats/${chatId}/message`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      role,
      content,
    }),
  });

  if (!response.ok) throw new Error("Failed to add message");
  return await response.json();
};

/**
 * Delete chat
 */
export const deleteChatAPI = async (chatId, userId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/chats/${chatId}?userId=${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete chat");
  return await response.json();
};
