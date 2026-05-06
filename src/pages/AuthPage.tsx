import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { BrandLogo } from '@/components/BrandLogo';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { logAudit } from '@/lib/audit';

type OAuthProvider = 'google' | 'azure';

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
    <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#F25022" d="M2 2h9.5v9.5H2z"/>
    <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z"/>
    <path fill="#00A4EF" d="M2 12.5h9.5V22H2z"/>
    <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z"/>
  </svg>
);

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const { activeWorkspace, loading: workspaceLoading } = useWorkspace();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [invitePreview, setInvitePreview] = useState<{ workspace_name: string; email: string | null } | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [resendCooldown]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const invite = params.get('invite');
    if (invite) {
      setInviteToken(invite);
      setActiveTab('register');
    } else if (tab === 'register' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    if (!inviteToken) { setInvitePreview(null); return; }
    (async () => {
      const { data, error } = await supabase.rpc('get_invite_by_token', { _token: inviteToken });
      if (error || !data || (Array.isArray(data) && data.length === 0)) {
        toast.error('Invalid or expired invite link');
        setInvitePreview(null);
        return;
      }
      const row = Array.isArray(data) ? data[0] : data;
      setInvitePreview({ workspace_name: row.workspace_name, email: row.email });
      if (row.email) setRegisterEmail(row.email);
    })();
  }, [inviteToken]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      if (error) {
        toast.error(errorDescription || 'Email confirmation failed.');
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }
      if (accessToken) {
        toast.success('Email confirmed successfully!');
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    handleAuthCallback();
  }, []);

  useEffect(() => {
    if (!authLoading && !workspaceLoading && session) {
      if (inviteToken) {
        (async () => {
          const { error } = await supabase.rpc('accept_invite', { _token: inviteToken });
          if (error) {
            toast.error(error.message || 'Failed to accept invite');
          } else {
            toast.success('Welcome! Invite accepted.');
          }
          setInviteToken(null);
          navigate('/', { replace: true });
        })();
        return;
      }
      if (activeWorkspace) {
        navigate('/', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [session, authLoading, workspaceLoading, activeWorkspace, navigate, inviteToken]);

  if (authLoading || (session && workspaceLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    let normalizedPhone = phone.trim();
    if (normalizedPhone && !normalizedPhone.startsWith('+')) {
      const digits = normalizedPhone.replace(/\D/g, '');
      if (digits.length === 10) normalizedPhone = `+1${digits}`;
      else if (digits.length === 11 && digits.startsWith('1')) normalizedPhone = `+${digits}`;
    }

    setLoading(true);
    const redirectUrl = `${window.location.origin}/auth`;

    const { data, error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          phone_number: normalizedPhone,
        },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      const errorMsg = error.message?.toLowerCase() || '';
      if (errorMsg.includes('already registered') || error.status === 422) {
        toast.error('An account with this email already exists. Please sign in instead.');
        setActiveTab('login');
        setLoginEmail(registerEmail);
      } else {
        toast.error(error.message || 'An error occurred during registration.');
      }
      setLoading(false);
      return;
    }

    if (data?.session) {
      toast.success('Account created successfully!');
      setLoading(false);
      return;
    }

    setSentToEmail(registerEmail);
    setVerificationSent(true);
    toast.success('Registration successful! Please check your email to confirm your account.');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setLoading(false);
  };

  const handleResendEmail = async () => {
    if (!sentToEmail || resendCooldown > 0) return;
    setLoading(true);
    setResendSuccess(false);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: sentToEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setResendSuccess(true);
      setResendCooldown(30);
      toast.success(`Verification email resent to ${sentToEmail}!`);
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
        toast.error('Please confirm your email before signing in. We can resend the verification link.');
        setSentToEmail(loginEmail);
        setVerificationSent(true);
      } else if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
        // Check if the account exists but email is unconfirmed
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: loginEmail,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (!resendError) {
          toast.error('Your email is not confirmed yet. We just resent the verification link.');
          setSentToEmail(loginEmail);
          setResendCooldown(30);
          setVerificationSent(true);
        } else {
          toast.error('Invalid email or password. If you just registered, check your inbox to confirm your email first.');
        }
      } else {
        toast.error(error.message);
      }
      setLoading(false);
    } else {
      if (data.user) {
        logAudit('', data.user.id, 'LOGIN', 'auth', data.user.id);
      }
      toast.success('Signed in successfully!');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('If an account exists for this email, a password reset link has been sent.');
      setIsForgotPassword(false);
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setLoading(true);
    const redirectTo = inviteToken
      ? `${window.location.origin}/auth?invite=${inviteToken}`
      : `${window.location.origin}/auth`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
      },
    });
    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('provider is not enabled') || msg.includes('not enabled')) {
        toast.error(`${provider === 'google' ? 'Google' : 'Microsoft'} sign-in isn't enabled yet. Please use email and password, or contact support.`);
      } else {
        toast.error(`Couldn't sign in with ${provider === 'google' ? 'Google' : 'Microsoft'}. Please try again.`);
      }
      setLoading(false);
    }
  };

  const SocialAuthSection: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11"
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
          aria-label="Continue with Google"
        >
          <GoogleIcon />
          <span className="ml-2">Continue with Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-11"
          onClick={() => handleOAuthSignIn('azure')}
          disabled={loading}
          aria-label="Continue with Microsoft"
        >
          <MicrosoftIcon />
          <span className="ml-2">Continue with Microsoft</span>
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {mode === 'register'
          ? 'Fastest way to get started — no password needed.'
          : 'Use your school or work account.'}
      </p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or {mode === 'register' ? 'sign up' : 'continue'} with email</span>
        </div>
      </div>
    </div>
  );

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Verification email sent</CardTitle>
            <CardDescription>Check your inbox to confirm your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation email to:
            </p>
            <p className="font-medium">{sentToEmail}</p>
            <button
              onClick={() => {
                setVerificationSent(false);
                setActiveTab('register');
                setRegisterEmail(sentToEmail);
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Entered the wrong email? Go back
            </button>
            <p className="text-xs text-muted-foreground">
              Please check your inbox and spam folder.
            </p>
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={loading || resendCooldown > 0}
            >
              {loading ? 'Resending...' : resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend verification email'}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setVerificationSent(false);
                setActiveTab('login');
              }}
              disabled={loading}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <BrandLogo variant="auth" />
          <p className="text-sm text-muted-foreground">Universal Service Operations Platform</p>
        </div>

        {invitePreview && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="pt-4 pb-4 text-center text-sm">
              <p className="font-medium">You've been invited to join <span className="text-primary">{invitePreview.workspace_name}</span></p>
              <p className="text-muted-foreground text-xs mt-1">Free Access — sign in or create your account to continue.</p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardContent className="pt-6">
                {isForgotPassword ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgotEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="forgotEmail"
                          type="email"
                          className="pl-10"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Sending link...' : 'Send Reset Link'}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setIsForgotPassword(false)}>
                      Back to Login
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loginEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="loginEmail"
                          type="email"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="loginPassword">Password</Label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setForgotPasswordEmail(loginEmail);
                          }}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="loginPassword"
                          type={showPassword ? 'text' : 'password'}
                          className="pl-10 pr-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="firstName" className="pl-10" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="lastName" className="pl-10" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="regEmail" type="email" className="pl-10" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPhone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="regPhone" type="tel" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <p className="text-xs text-muted-foreground">Used only for account security and support</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regPassword"
                        type={showPassword ? 'text' : 'password'}
                        className="pl-10 pr-10"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmPassword" type="password" className="pl-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 text-center">
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
