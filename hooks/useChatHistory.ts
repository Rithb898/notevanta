"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ChatHistory {
  id: string;
  title: string;
  messages: any[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const useChatHistory = (userId: string | null) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const fetchChatHistory = async () => {
    if (!userId) return;

    try {
      const q = query(
        collection(db, "chatHistory"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatHistory[];
      console.log("Fetched chat history:", chats.length, "chats");
      setChatHistory(chats);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveChat = async (messages: any[], title?: string) => {
    if (!userId || messages.length === 0) return;

    let chatTitle = title;

    if (!chatTitle) {
      try {
        const response = await fetch("/api/generate-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });

        if (response.ok) {
          const { title: generatedTitle } = await response.json();
          chatTitle = generatedTitle;
        } else {
          chatTitle =
            messages[0]?.parts?.[0]?.text?.substring(0, 50) + "..." ||
            "New Chat";
        }
      } catch (error) {
        chatTitle =
          messages[0]?.parts?.[0]?.text?.substring(0, 50) + "..." || "New Chat";
      }
    }

    try {
      await addDoc(collection(db, "chatHistory"), {
        userId,
        title: chatTitle,
        messages,
        createdAt: new Date().toISOString(),
      });
      fetchChatHistory();
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await deleteDoc(doc(db, "chatHistory", chatId));
      fetchChatHistory();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [userId]);

  const createNewChat = async (messages: any[]) => {
    console.log("createNewChat called with:", messages.length, "messages");
    if (!userId || messages.length === 0) return null;

    let chatTitle;
    try {
      const response = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (response.ok) {
        const { title: generatedTitle } = await response.json();
        chatTitle = generatedTitle;
        console.log("Generated title:", chatTitle);
      } else {
        chatTitle =
          messages[0]?.parts?.[0]?.text?.substring(0, 50) + "..." || "New Chat";
        console.log("Fallback title:", chatTitle);
      }
    } catch (error) {
      chatTitle =
        messages[0]?.parts?.[0]?.text?.substring(0, 50) + "..." || "New Chat";
      console.log("Error generating title, using fallback:", chatTitle);
    }

    try {
      console.log("Saving chat to Firebase with title:", chatTitle);

      // Clean messages to remove undefined values
      const cleanMessages = messages.map((msg) => ({
        id: msg.id || "",
        role: msg.role || "",
        parts: (msg.parts || []).map((part: any) => ({
          type: part.type || "text",
          text: part.text || "",
        })),
      }));

      const docRef = await addDoc(collection(db, "chatHistory"), {
        userId: userId,
        title: chatTitle || "New Chat",
        messages: cleanMessages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log("Chat saved with ID:", docRef.id);
      setCurrentChatId(docRef.id);
      fetchChatHistory();
      return docRef.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  const updateCurrentChat = async (messages: any[]) => {
    if (!currentChatId || !userId) return;

    try {
      // Clean messages to remove undefined values
      const cleanMessages = messages.map((msg) => ({
        id: msg.id || "",
        role: msg.role || "",
        parts: (msg.parts || []).map((part: any) => ({
          type: part.type || "text",
          text: part.text || "",
        })),
      }));

      const docRef = doc(db, "chatHistory", currentChatId);
      await updateDoc(docRef, {
        messages: cleanMessages,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  const loadChat = (chat: ChatHistory) => {
    setCurrentChatId(chat.id);
    return chat.messages;
  };

  const startNewChat = () => {
    setCurrentChatId(null);
  };

  return {
    chatHistory,
    loading,
    saveChat,
    createNewChat,
    updateCurrentChat,
    loadChat,
    startNewChat,
    deleteChat,
    currentChatId,
    refreshHistory: fetchChatHistory,
  };
};
