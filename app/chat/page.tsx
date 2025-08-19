import ChatPanel from "@/components/panels/ChatPanel";
import SourcesPanel from "@/components/panels/SourcePanel";

const ChatPage = () => {
  return (
    <div className="min-h-screen max-h-screen flex">
      <div className="w-2/6 m-2 shadow">
        <SourcesPanel />
      </div>
      <div className="w-4/6 m-2 shadow">
        <ChatPanel />
      </div>
    </div>
  );
};

export default ChatPage;
