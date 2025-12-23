import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { ChatScreen } from './components/ChatScreen';

type Screen = 'login' | 'register' | 'reset' | 'main';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('Kullanıcı');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setCurrentScreen('main');
      } else {
        setUserId(null);
        setCurrentScreen('login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (uid: string) => {
    setUserId(uid);
    // Kullanıcı adını veritabanından al
    setUsername('Kullanıcı'); // Geçici
  };

  const handleRegisterSuccess = (uid: string, uname: string) => {
    // Kullanıcı adını veritabanına kaydet
    setUsername(uname);
    console.log('Kayıt başarılı:', { uid, uname });
  };

  const handleLogout = () => {
    setUserId(null);
    setUsername('Kullanıcı');
    setCurrentScreen('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentScreen === 'login' && (
        <LoginScreen
          onNavigate={setCurrentScreen}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen
          onNavigate={setCurrentScreen}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      {currentScreen === 'reset' && (
        <ResetPasswordScreen onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'main' && userId && (
        <ChatScreen
          userId={userId}
          username={username}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
