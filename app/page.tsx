'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import {
  Mail,
  Lock,
  LogIn,
  ShieldCheck,
  BarChart3,
  UserPlus,
  User,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert('Remplis tous les champs');
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (!data.session) {
      alert('Session non créée');
      return;
    }

    router.replace('/dashboard');
  };

  const register = async () => {
    if (!fullName || !email || !password) {
      alert('Remplis tous les champs');
      return;
    }

    if (password.length < 6) {
      alert(
        'Le mot de passe doit contenir au moins 6 caractères'
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      '✅ Compte créé avec succès ! Vérifie ton email.'
    );

    setIsRegister(false);
    setFullName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-800 via-indigo-800 to-sky-700 text-white relative">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-col justify-center px-20">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
              <BarChart3 size={42} />
            </div>

            <div>
              <h1 className="text-5xl font-black tracking-tight">
                AKDICAL
              </h1>

              <p className="text-blue-100 text-lg mt-2">
                Dashboard KPI & Suivi Achats
              </p>
            </div>
          </div>

          <div className="space-y-6 max-w-lg">
            <div className="flex items-start gap-4 bg-white/10 p-5 rounded-3xl backdrop-blur-sm border border-white/10">
              <ShieldCheck className="mt-1" size={28} />

              <div>
                <h3 className="font-bold text-xl mb-1">
                  Gestion sécurisée
                </h3>

                <p className="text-blue-100">
                  Accès sécurisé.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 p-5 rounded-3xl backdrop-blur-sm border border-white/10">
              <BarChart3 className="mt-1" size={28} />

              <div>
                <h3 className="font-bold text-xl mb-1">
                  KPI Automatisés
                </h3>

                <p className="text-blue-100">
                  Calcul automatique des KPI et import Excel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-[32px] p-10 border border-blue-100">
            {/* MOBILE */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                AKDICAL
              </h1>

              <p className="text-slate-600 mt-2">
                Dashboard KPI & Suivi Achats
              </p>
            </div>

            {/* HEADER */}
            <div className="mb-10">
              <h2 className="text-4xl font-black text-slate-900 mb-3">
                {isRegister
                  ? 'Créer un compte'
                  : 'Connexion'}
              </h2>

              <p className="text-slate-600">
                {isRegister
                  ? 'Crée ton accès AKDICAL.'
                  : 'Connecte-toi pour accéder au dashboard.'}
              </p>
            </div>

            {/* NAME */}
            {isRegister && (
              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Nom complet
                </label>

                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Nom Prénom"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-blue-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="mb-5">
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Adresse email
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="email@entreprise.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-blue-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-8">
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Mot de passe
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-blue-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={
                isRegister ? register : login
              }
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isRegister ? (
                <UserPlus size={22} />
              ) : (
                <LogIn size={22} />
              )}

              {loading
                ? 'Chargement...'
                : isRegister
                ? 'Créer un compte'
                : 'Se connecter'}
            </button>

            {/* SWITCH */}
            <div className="mt-8 text-center">
              <button
                onClick={() =>
                  setIsRegister(!isRegister)
                }
                className="text-blue-700 font-semibold hover:underline"
              >
                {isRegister
                  ? 'Déjà un compte ? Se connecter'
                  : "Pas de compte ? Créer un compte"}
              </button>
            </div>

            {/* FOOTER */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                AKDICAL • KPI Dashboard • Supabase
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}