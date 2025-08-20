"use client";
import ChatPanel from "@/components/panels/ChatPanel";
import SourcesPanel from "@/components/panels/SourcePanel";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/hooks/useAuth";

const ChatPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex max-h-screen min-h-screen">
      <div className="m-2 w-2/6 shadow">
        <SourcesPanel />
      </div>
      <div className="m-2 w-4/6 shadow">
        <ChatPanel />
      </div>
      <LoginDialog open={!user} />
    </div>
  );
};

export default ChatPage;
