'use client';

import { ReactNode } from 'react';
import { Bell, Settings, User } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-700">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <h1 className="text-xl font-bold text-white">Energy Flow</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                <Settings className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                <User className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
