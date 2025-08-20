import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    const docRef = doc(db, "messageUsage", `${userId}_${today}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentCount = docSnap.data().count || 0;
      if (currentCount >= 10) {
        return NextResponse.json({
          canSend: false,
          count: currentCount,
          limit: 10,
        });
      }

      await updateDoc(docRef, { count: currentCount + 1 });
      return NextResponse.json({
        canSend: true,
        count: currentCount + 1,
        limit: 10,
      });
    } else {
      await setDoc(docRef, { count: 1, date: today });
      return NextResponse.json({
        canSend: true,
        count: 1,
        limit: 10,
      });
    }
  } catch (error) {
    console.error("Message limit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    const docRef = doc(db, "messageUsage", `${userId}_${today}`);
    const docSnap = await getDoc(docRef);

    const count = docSnap.exists() ? docSnap.data().count || 0 : 0;

    return NextResponse.json({
      count,
      limit: 10,
      canSend: count < 10,
    });
  } catch (error) {
    console.error("Get message limit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
