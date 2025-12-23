import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { MessageCircle, Mail, Lock, AlertCircle, Wrench } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginScreenProps {
  onNavigate: (screen: 'login' | 'register' | 'reset' | 'main') => void;
  onLoginSuccess: (userId: string) => void;
}

export function LoginScreen({ onNavigate, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user.uid);
      onNavigate('main');
    } catch (err: any) {
      console.error('Firebase giriş hatası:', err); // Detaylı hata logu
      if (err.code === 'auth/invalid-credential') {
        setError('E-posta veya parola hatalı');
      } else if (err.code === 'auth/user-not-found') {
        setError('Kullanıcı bulunamadı');
      } else if (err.code === 'auth/wrong-password') {
        setError('Parola hatalı');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi');
      } else {
        setError(`Giriş yapılırken bir hata oluştu: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Geliştirme modu bypass
  const handleDevBypass = () => {
    onLoginSuccess('dev-test-user-123');
    onNavigate('main');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-2">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz</h1>
            <p className="text-gray-600">Hesabınıza giriş yapın</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Posta</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parola</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="space-y-3 pt-4 border-t">
            <button
              onClick={() => onNavigate('reset')}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Parolamı Unuttum
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Hesap Oluştur
            </button>
          </div>

          {/* Geliştirme modu bypass butonu */}
          <div className="mt-4">
            <button
              onClick={handleDevBypass}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Wrench className="inline-block w-4 h-4 mr-1" />
              Geliştirme Modu Bypass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}