import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, User, Clock, MessageSquare, Trash2, Lock, Shield, Ban } from "lucide-react";
import { Link } from "wouter";
import type { ContactMessage, BannedIp } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "Firehawk25";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      setPasswordInput("");
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    setSelectedMessage(null);
  };

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
  });

  const { data: bannedIps, isLoading: bannedIpsLoading } = useQuery<BannedIp[]>({
    queryKey: ["/api/banned-ips"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      setSelectedMessage(null);
      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const banIpMutation = useMutation({
    mutationFn: async ({ ipAddress, reason }: { ipAddress: string; reason?: string }) => {
      return await apiRequest('POST', '/api/ban-ip', { ipAddress, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banned-ips"] });
      toast({
        title: "IP banned",
        description: "The IP address has been successfully banned.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to ban IP address. Please try again.",
        variant: "destructive",
      });
    },
  });

  const unbanIpMutation = useMutation({
    mutationFn: async (ipAddress: string) => {
      return await apiRequest('DELETE', `/api/ban-ip/${encodeURIComponent(ipAddress)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banned-ips"] });
      toast({
        title: "IP unbanned",
        description: "The IP address has been successfully unbanned.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unban IP address. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  const getSubjectBadgeColor = (subject: string | null) => {
    if (!subject) return "bg-gray-500";
    switch (subject.toLowerCase()) {
      case "technical": return "bg-blue-500";
      case "collaboration": return "bg-green-500";
      case "general": return "bg-purple-500";
      case "media": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-firehawk-primary text-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Link href="/">
            <Button variant="outline" className="border-firehawk-slate-500 text-firehawk-slate-300 hover:bg-firehawk-secondary mb-6">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
          
          <Card className="bg-firehawk-secondary border-firehawk-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto bg-firehawk-accent/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Lock className="text-firehawk-accent" size={32} />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <p className="text-firehawk-slate-400 text-sm mt-2">
                Enter the password to access the admin dashboard
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="bg-slate-800 border-firehawk-slate-600 text-slate-50 placeholder:text-firehawk-slate-500"
                    autoFocus
                    data-testid="input-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-firehawk-accent hover:bg-red-600"
                  data-testid="button-login"
                >
                  <Lock className="mr-2" size={16} />
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-firehawk-primary text-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-firehawk-accent mx-auto"></div>
            <p className="mt-4 text-firehawk-slate-400">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-firehawk-primary text-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/">
              <Button variant="outline" className="border-firehawk-slate-500 text-firehawk-slate-300 hover:bg-firehawk-secondary">
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <Lock className="mr-2" size={16} />
              Logout
            </Button>
          </div>
          
          <div className="text-center mb-12">
            <Mail className="mx-auto text-firehawk-accent mb-4" size={64} />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-firehawk-slate-400">
              Contact Messages from FireHawk Website
            </p>
          </div>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="messages">
              <MessageSquare className="mr-2" size={16} />
              Messages ({messages?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="banned-ips">
              <Shield className="mr-2" size={16} />
              Banned IPs ({bannedIps?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Messages List */}
              <div className="lg:col-span-2">
                <Card className="bg-firehawk-secondary border-firehawk-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2" size={20} />
                      Contact Messages ({messages?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                {!messages || messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="mx-auto text-firehawk-slate-500 mb-4" size={48} />
                    <p className="text-firehawk-slate-400">No messages yet</p>
                    <p className="text-sm text-firehawk-slate-500 mt-2">
                      Messages from the contact form will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id
                            ? 'bg-firehawk-accent/20 border-firehawk-accent'
                            : 'bg-slate-800 border-firehawk-slate-600 hover:bg-slate-700'
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User size={16} className="text-firehawk-slate-400" />
                            <span className="font-semibold">{message.name}</span>
                            <span className="text-firehawk-slate-400 text-sm">({message.email})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {message.subject && (
                              <Badge className={`${getSubjectBadgeColor(message.subject)} text-white text-xs`}>
                                {message.subject}
                              </Badge>
                            )}
                            <div className="flex items-center text-xs text-firehawk-slate-500">
                              <Clock size={12} className="mr-1" />
                              {formatDate(message.createdAt)}
                            </div>
                          </div>
                        </div>
                        <p className="text-firehawk-slate-300 text-sm line-clamp-2">
                          {message.message}
                        </p>
                        {message.ipAddress && (
                          <div className="mt-2 flex items-center text-xs text-firehawk-slate-500">
                            <Shield size={12} className="mr-1" />
                            IP: {message.ipAddress}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                  </CardContent>
                </Card>
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-1">
            <Card className="bg-firehawk-secondary border-firehawk-slate-700 sticky top-8">
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedMessage ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto text-firehawk-slate-500 mb-4" size={48} />
                    <p className="text-firehawk-slate-400">Select a message to view details</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-firehawk-accent">From:</h4>
                      <p className="text-firehawk-slate-300">{selectedMessage.name}</p>
                      <p className="text-firehawk-slate-400 text-sm">{selectedMessage.email}</p>
                    </div>

                    {selectedMessage.subject && (
                      <div>
                        <h4 className="font-semibold mb-2 text-firehawk-accent">Subject:</h4>
                        <Badge className={`${getSubjectBadgeColor(selectedMessage.subject)} text-white`}>
                          {selectedMessage.subject}
                        </Badge>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2 text-firehawk-accent">Received:</h4>
                      <p className="text-firehawk-slate-300 text-sm">
                        {formatDate(selectedMessage.createdAt)}
                      </p>
                    </div>

                    {selectedMessage.ipAddress && (
                      <div>
                        <h4 className="font-semibold mb-2 text-firehawk-accent">IP Address:</h4>
                        <div className="flex items-center space-x-2">
                          <code className="bg-slate-800 px-2 py-1 rounded text-sm text-firehawk-slate-300">
                            {selectedMessage.ipAddress}
                          </code>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2 text-firehawk-accent">Message:</h4>
                      <div className="bg-slate-800 p-4 rounded-lg">
                        <p className="text-firehawk-slate-300 whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-firehawk-slate-600 space-y-2">
                      <Button 
                        className="w-full bg-firehawk-accent hover:bg-red-600"
                        onClick={() => {
                          const subject = selectedMessage.subject 
                            ? `Re: ${selectedMessage.subject}` 
                            : 'Re: Your FireHawk inquiry';
                          const body = `Hi ${selectedMessage.name},\n\nThank you for your message about the FireHawk drone project.\n\n---\nOriginal message:\n${selectedMessage.message}`;
                          window.location.href = `mailto:${selectedMessage.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        }}
                        data-testid="button-reply"
                      >
                        <Mail className="mr-2" size={16} />
                        Reply via Email
                      </Button>
                      
                      {selectedMessage.ipAddress && (
                        <Button 
                          variant="outline"
                          className="w-full border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                          onClick={() => banIpMutation.mutate({ 
                            ipAddress: selectedMessage.ipAddress!, 
                            reason: `Banned from message by ${selectedMessage.name}` 
                          })}
                          disabled={banIpMutation.isPending}
                          data-testid="button-ban-ip"
                        >
                          <Ban className="mr-2" size={16} />
                          {banIpMutation.isPending ? 'Banning...' : 'Ban IP Address'}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline"
                        className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => deleteMutation.mutate(selectedMessage.id)}
                        disabled={deleteMutation.isPending}
                        data-testid="button-delete"
                      >
                        <Trash2 className="mr-2" size={16} />
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete Message'}
                      </Button>
                    </div>
                  </div>
                )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="banned-ips">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-firehawk-secondary border-firehawk-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2" size={20} />
                  Banned IP Addresses ({bannedIps?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bannedIpsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-firehawk-accent mx-auto"></div>
                    <p className="mt-4 text-firehawk-slate-400">Loading banned IPs...</p>
                  </div>
                ) : !bannedIps || bannedIps.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="mx-auto text-firehawk-slate-500 mb-4" size={48} />
                    <p className="text-firehawk-slate-400">No banned IP addresses</p>
                    <p className="text-sm text-firehawk-slate-500 mt-2">
                      IP addresses you ban will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bannedIps.map((bannedIp) => (
                      <div
                        key={bannedIp.id}
                        className="p-4 rounded-lg border bg-slate-800 border-firehawk-slate-600 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <code className="bg-slate-900 px-3 py-1 rounded text-sm font-mono text-firehawk-accent">
                              {bannedIp.ipAddress}
                            </code>
                            <div className="flex items-center text-xs text-firehawk-slate-500">
                              <Clock size={12} className="mr-1" />
                              Banned {formatDate(bannedIp.bannedAt)}
                            </div>
                          </div>
                          {bannedIp.reason && (
                            <p className="text-sm text-firehawk-slate-400">
                              Reason: {bannedIp.reason}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white ml-4"
                          onClick={() => unbanIpMutation.mutate(bannedIp.ipAddress)}
                          disabled={unbanIpMutation.isPending}
                          data-testid={`button-unban-${bannedIp.ipAddress}`}
                        >
                          {unbanIpMutation.isPending ? 'Unbanning...' : 'Unban'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}