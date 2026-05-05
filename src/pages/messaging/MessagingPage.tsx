import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Send, Plus, Search, PenSquare } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { toast } from '@/hooks/use-toast';

type Member = { user_id: string; full_name: string | null; role?: string | null };

const initials = (name?: string | null) => {
  if (!name) return '?';
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() || '?';
};

const fmtListTime = (ts?: string | null) => {
  if (!ts) return '';
  const d = new Date(ts);
  if (isToday(d)) return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};

const MessagingPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [convoMembers, setConvoMembers] = useState<Record<string, string[]>>({});
  const [lastMessages, setLastMessages] = useState<Record<string, any>>({});
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    if (!activeWorkspace || !user) return;
    // Get conversations the user is a member of
    const { data: myMems } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('workspace_id', activeWorkspace.id)
      .eq('user_id', user.id);
    const ids = (myMems || []).map((m: any) => m.conversation_id);
    if (!ids.length) { setConversations([]); setConvoMembers({}); setLastMessages({}); return; }

    const [{ data: convos }, { data: allMems }, { data: msgs }] = await Promise.all([
      supabase.from('conversations').select('*').in('id', ids).order('last_message_at', { ascending: false }),
      supabase.from('conversation_members').select('conversation_id, user_id').in('conversation_id', ids),
      supabase.from('messages').select('conversation_id, content, created_at, sender_id').in('conversation_id', ids).order('created_at', { ascending: false }),
    ]);

    const memMap: Record<string, string[]> = {};
    (allMems || []).forEach((m: any) => {
      memMap[m.conversation_id] = memMap[m.conversation_id] || [];
      memMap[m.conversation_id].push(m.user_id);
    });
    const lastMap: Record<string, any> = {};
    (msgs || []).forEach((m: any) => {
      if (!lastMap[m.conversation_id]) lastMap[m.conversation_id] = m;
    });

    setConversations(convos || []);
    setConvoMembers(memMap);
    setLastMessages(lastMap);
  }, [activeWorkspace, user]);

  useEffect(() => {
    if (!activeWorkspace || !user) return;
    setLoading(true);
    Promise.all([
      supabase.from('workspace_members').select('user_id, full_name, role').eq('workspace_id', activeWorkspace.id).eq('status', 'active'),
      loadConversations(),
    ]).then(([m]) => {
      setMembers((m.data || []).filter((x: any) => x.user_id !== user.id));
      setLoading(false);
    });
  }, [activeWorkspace, user, loadConversations]);

  useEffect(() => {
    if (!activeConvo) { setMessages([]); return; }
    supabase.from('messages').select('*').eq('conversation_id', activeConvo.id).order('created_at')
      .then(({ data }) => setMessages(data || []));

    const channel = supabase
      .channel(`messages:${activeConvo.id}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConvo.id}` },
        (payload) => {
          setMessages(prev => prev.find(m => m.id === (payload.new as any).id) ? prev : [...prev, payload.new as any]);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConvo]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const memberNameMap = useMemo(() => {
    const m: Record<string, string> = {};
    members.forEach(x => { m[x.user_id] = x.full_name || 'Member'; });
    if (user) m[user.id] = 'You';
    return m;
  }, [members, user]);

  const convoTitle = (c: any) => {
    if (c.name) return c.name;
    const ids = (convoMembers[c.id] || []).filter(id => id !== user?.id);
    if (!ids.length) return 'Just you';
    return ids.map(id => memberNameMap[id] || 'Member').join(', ');
  };

  const filteredMembers = members.filter(m =>
    !search.trim() || (m.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const startConversation = async (target: Member) => {
    if (!activeWorkspace || !user) return;
    setCreating(true);
    try {
      // Find existing 1-on-1
      const existing = conversations.find(c => {
        const ids = convoMembers[c.id] || [];
        return ids.length === 2 && ids.includes(user.id) && ids.includes(target.user_id);
      });
      if (existing) {
        setActiveConvo(existing);
        setShowNew(false);
        return;
      }
      const { data: convo, error } = await supabase.from('conversations')
        .insert({ workspace_id: activeWorkspace.id, name: null }).select().single();
      if (error) throw error;
      const { error: mErr } = await supabase.from('conversation_members').insert([
        { conversation_id: convo.id, user_id: user.id, workspace_id: activeWorkspace.id },
        { conversation_id: convo.id, user_id: target.user_id, workspace_id: activeWorkspace.id },
      ]);
      if (mErr) throw mErr;
      await loadConversations();
      setActiveConvo(convo);
      setShowNew(false);
      setSearch('');
    } catch (err: any) {
      toast({ title: 'Could not start conversation', description: err.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvo || !user || !activeWorkspace) return;
    const content = newMessage.trim();
    setNewMessage('');
    const optimistic = { id: crypto.randomUUID(), content, sender_id: user.id, created_at: new Date().toISOString(), conversation_id: activeConvo.id };
    setMessages(prev => [...prev, optimistic]);
    const { error } = await supabase.from('messages').insert({
      conversation_id: activeConvo.id, sender_id: user.id, workspace_id: activeWorkspace.id, content,
    });
    if (error) toast({ title: 'Send failed', description: error.message, variant: 'destructive' });
    else loadConversations();
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading messages...</div></div>;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Messaging</h1>
          <p className="text-sm text-muted-foreground mt-1">Internal workspace communication</p>
        </div>
        <Button onClick={() => setShowNew(true)}><PenSquare className="h-4 w-4 mr-1" />New Message</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar */}
        <Card className="md:col-span-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold">Conversations</h2>
            <Button size="sm" variant="ghost" onClick={() => setShowNew(true)}><Plus className="h-4 w-4" /></Button>
          </div>
          <ScrollArea className="flex-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Start a new message to connect with your team</p>
                <Button size="sm" onClick={() => setShowNew(true)}><PenSquare className="h-3.5 w-3.5 mr-1" />New Message</Button>
              </div>
            ) : conversations.map(c => {
              const last = lastMessages[c.id];
              const title = convoTitle(c);
              const otherIds = (convoMembers[c.id] || []).filter(id => id !== user?.id);
              const avatarName = otherIds[0] ? memberNameMap[otherIds[0]] : title;
              return (
                <button key={c.id} onClick={() => setActiveConvo(c)}
                  className={`w-full text-left px-3 py-3 border-b border-border/40 hover:bg-muted/50 transition-colors flex items-start gap-3 ${activeConvo?.id === c.id ? 'bg-muted' : ''}`}>
                  <Avatar className="h-9 w-9 shrink-0"><AvatarFallback className="text-xs bg-primary/10 text-primary">{initials(avatarName)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium truncate">{title}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{fmtListTime(last?.created_at || c.last_message_at)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {last ? `${last.sender_id === user?.id ? 'You: ' : ''}${last.content}` : 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })}
          </ScrollArea>
        </Card>

        {/* Chat */}
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {activeConvo ? (
            <>
              <div className="p-3 border-b flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarFallback className="text-xs bg-primary/10 text-primary">{initials(convoTitle(activeConvo))}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-semibold">{convoTitle(activeConvo)}</p>
                  <p className="text-[11px] text-muted-foreground">{(convoMembers[activeConvo.id] || []).length} participant(s)</p>
                </div>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Send the first message 👋</div>
                ) : messages.map(m => {
                  const mine = m.sender_id === user?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${mine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                        <div className="whitespace-pre-wrap break-words">{m.content}</div>
                        <div className={`text-[10px] mt-1 ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{format(new Date(m.created_at), 'h:mm a')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t flex gap-2">
                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm px-6">
                <MessageSquare className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium">No conversations yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Start a new message to connect with your team.</p>
                <Button onClick={() => setShowNew(true)}><PenSquare className="h-4 w-4 mr-1" />New Message</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search team members..." className="pl-9" />
            </div>
            <ScrollArea className="max-h-80">
              {filteredMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No team members found.</p>
              ) : filteredMembers.map(m => (
                <button key={m.user_id} disabled={creating} onClick={() => startConversation(m)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-muted text-left transition-colors disabled:opacity-50">
                  <Avatar className="h-9 w-9"><AvatarFallback className="text-xs bg-primary/10 text-primary">{initials(m.full_name)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.full_name || 'Member'}</p>
                    {m.role && <p className="text-[11px] text-muted-foreground">{m.role}</p>}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagingPage;
