import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { MessageSquare, Sparkles, Zap, Shield } from 'lucide-react';

const WelcomePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-pink-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo Animation */}
        <div className="mb-8 animate-bounce">
          <div className="bg-orange-500 p-6 rounded-3xl shadow-2xl shadow-orange-200 mx-auto w-fit">
            <MessageSquare size={48} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-gray-800 mb-4 animate-fade-in-up">
          Vesta <span className="text-orange-500">Messenger</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-fade-in-up animation-delay-500">
          Connect, chat, and collaborate with your team in real-time
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8 animate-fade-in-up animation-delay-1000">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg">
            <Zap className="text-orange-500" size={24} />
            <span className="text-gray-700 font-medium">Lightning Fast Messaging</span>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg">
            <Shield className="text-orange-500" size={24} />
            <span className="text-gray-700 font-medium">Secure & Private</span>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg">
            <Sparkles className="text-orange-500" size={24} />
            <span className="text-gray-700 font-medium">Group Collaboration</span>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-orange-500 text-white py-4 px-6 rounded-3xl font-bold text-lg hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up animation-delay-1500"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <>
              <img src="https://www.gstatic.com/firebase/anonymous/google.png" className="w-6 h-6" alt="google" />
              Continue with Google
            </>
          )}
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6 animate-fade-in-up animation-delay-2000">
          Join thousands of users already chatting on Vesta
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
