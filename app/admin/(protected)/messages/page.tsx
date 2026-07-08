import { getContactMessages, getUnreadMessageCount } from "@/actions/contact";
import { MessageList } from "@/components/admin/message-list";
import { Badge } from "@/components/ui/badge";

export default async function AdminMessagesPage() {
  const [messagesResult, unreadResult] = await Promise.all([
    getContactMessages(),
    getUnreadMessageCount(),
  ]);

  const messages = messagesResult.success ? messagesResult.data : [];
  const unread = unreadResult.success ? unreadResult.data : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">İletişim Mesajları</h1>
          <p className="text-muted-foreground">Siteden gelen iletişim formu mesajları.</p>
        </div>
        {unread > 0 && (
          <Badge className="bg-primary text-primary-foreground">{unread} yeni</Badge>
        )}
      </div>
      <MessageList messages={messages} />
    </div>
  );
}
