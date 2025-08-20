"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useMessageLimit = (userId: string | null) => {
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dailyLimit = 10;

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  const fetchMessageCount = async () => {
    if (!userId) return;

    try {
      const today = getTodayString();
      const docRef = doc(db, "messageUsage", `${userId}_${today}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMessageCount(docSnap.data().count || 0);
      } else {
        setMessageCount(0);
      }
    } catch (error) {
      console.error("Error fetching message count:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementMessageCount = async () => {
    if (!userId) return false;

    try {
      const today = getTodayString();
      const docRef = doc(db, "messageUsage", `${userId}_${today}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().count || 0;
        if (currentCount >= dailyLimit) return false;

        await updateDoc(docRef, { count: currentCount + 1 });
        setMessageCount(currentCount + 1);
      } else {
        await setDoc(docRef, { count: 1, date: today });
        setMessageCount(1);
      }
      return true;
    } catch (error) {
      console.error("Error incrementing message count:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchMessageCount();
  }, [userId]);

  return {
    messageCount,
    dailyLimit,
    canSendMessage: messageCount < dailyLimit,
    loading,
    incrementMessageCount,
    refreshCount: fetchMessageCount,
  };
};
