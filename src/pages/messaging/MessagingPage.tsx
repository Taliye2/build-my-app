import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';

const MessagingPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    supabase.from('conversations').select('*').eq('workspace_id', activeWorkspace.id).order('last_message_at', { ascending: false })
      .then(({ data }) => { setConversations(data || []); setLoading(false); });
  }, [activeWorkspace]);

  useEffect(() => {
    if (!activeConvo) { setMessages([]); return; }
    supabase.from('messages').select('*').eq('conversation_id', activeConvo.id).order('created_at')
      .then(({ data }) => setMessages(data || []));
  }, [activeConvo]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvo || !user || !activeWorkspace) return;
    const { error } = await supabase.from('messages').insert({
      conversation_id: activeConvo.id,
      sender_id: user.id,
      workspace_id: activeWorkspace.id,
      content: newMessage.trim(),
    });
    if (!error) {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), content: newMessage.trim(), sender_id: user.id, created_at: new Date().toISOString() }]);
      setNewMessage('');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading messages...</div></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-2xl font-semibold">Messaging</h1><p className="text-sm text-muted-foreground mt-1">Internal workspace communication</p></div>

      <div className="grid md:grid-cols-3 gap-4" style={{ minHeight: '500px' }}>
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Conversations</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {conversations.length === 0 ? (
                <div className="p-4 text-center"><MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">No conversations yet.</p></div>
              ) : (
                conversations.map(c => (
                  <button key={c.id} onClick={() => setActiveConvo(c)}
                    className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${activeConvo?.id === c.id ? 'bg-muted' : ''}`}>
                    <p className="text-sm font-medium truncate">{c.name || 'Unnamed'}</p>
                    <p className="text-xs text-muted-foreground">{c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : ''}</p>
                  </button>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="md:col-span-2 flex flex-col">
          {activeConvo ? (
            <>
              <CardHeader className="pb-2 border-b"><CardTitle className="text-sm">{activeConvo.name || 'Conversation'}</CardTitle></CardHeader>
              <ScrollArea className="flex-1 p-4" style={{ minHeight: '350px' }}>
                {messages.map(m => (
                  <div key={m.id} className={`mb-3 flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${m.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-3 border-t flex gap-2">
                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."
                  onKeyDown={e => e.key === 'Enter' && handleSend()} />
                <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center"><MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">Select a conversation to start messaging.</p></div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagingPage;