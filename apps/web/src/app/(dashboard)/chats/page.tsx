import chatConversations from "@/constants/chat-conversation.json";
import chatMessages from "@/constants/chat-messages.json";
import chatUsers from "@/constants/chat-users.json";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Chat } from "@/features/chats/components/chats";
import {
  ChatConversation,
  ChatMessage,
  ChatUser,
} from "@/features/chats/utils/types";

export default function ChatsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Chats"
        description="Chat with your customers and team members."
      />

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <Chat
          conversations={chatConversations as ChatConversation[]}
          messages={chatMessages as Record<string, ChatMessage[]>}
          users={chatUsers as ChatUser[]}
        />
      </div>
    </>
  );
}
