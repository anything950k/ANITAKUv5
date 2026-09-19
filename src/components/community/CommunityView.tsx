import React, { useState } from 'react';
import { Bell, Trophy } from 'lucide-react';

type CommunityMainTab = 'leaderboards' | 'notifications';
type NotificationSubTab = 'news' | 'releases' | 'system';

export const CommunityView: React.FC = () => {
  const [mainTab, setMainTab] = useState<CommunityMainTab>('notifications');
  const [subTab, setSubTab] = useState<NotificationSubTab>('news');

  return (
    <div className="relative w-full h-screen sm:h-[100dvh] flex flex-col bg-black text-white select-none overflow-hidden">
      {/* Background Top GIF Canvas (Positioned at top in original size, vertically shifted 185px upwards, zero blur, smoothly fading to black at bottom starting 10px lower) */}
      <div className="absolute top-0 left-0 right-0 h-[490px] sm:h-[550px] pointer-events-none z-0 overflow-hidden">
        <img
          src="https://www.image2url.com/r2/default/gifs/1789557803774-8ff4bb92-3d4a-4eca-bf25-62dbfba9096a.gif"
          alt="Community Background Canvas"
          className="w-full h-[calc(100%+185px)] object-cover object-top -translate-y-[185px]"
          referrerPolicy="no-referrer"
        />
        {/* Ultra-smooth multi-stop gradient transition to solid black at bottom edge, starting 10px lower */}
        <div className="absolute inset-x-0 bottom-0 h-36 [background:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.85)_85%,#000000_100%)] pointer-events-none" />
      </div>

      {/* Top Fixed Header */}
      <header className="relative z-10 flex-shrink-0 w-full max-w-xl mx-auto px-4 sm:px-6 pt-5">
        {/* Screen Title */}
        <div className="tab-header-row mb-3">
          <h1 className="tab-title-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            Community
          </h1>
        </div>

        {/* 1. Leaderboards vs Notifications Segmented Switcher */}
        <div className="w-[calc(100%-150px)] max-w-[340px] mx-auto flex items-center p-1 rounded-[8px] bg-[#141419]/80 border-[2px] border-white/15 shadow-lg">
          <button
            onClick={() => setMainTab('leaderboards')}
            className={`flex-1 py-[11px] sm:py-[13px] px-2.5 rounded-[5px] text-[15px] sm:text-[17px] font-semibold transition-all cursor-pointer whitespace-nowrap border-0 outline-none ${
              mainTab === 'leaderboards'
                ? 'bg-[#2b1f4a] text-white font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Leaderboards
          </button>
          <button
            onClick={() => setMainTab('notifications')}
            className={`flex-1 py-[11px] sm:py-[13px] px-2.5 rounded-[5px] text-[15px] sm:text-[17px] font-semibold transition-all cursor-pointer whitespace-nowrap border-0 outline-none ${
              mainTab === 'notifications'
                ? 'bg-[#2b1f4a] text-white font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Notifications
          </button>
        </div>

        {/* 2. Sub-Tabs: News | Releases | System (when Notifications is selected) */}
        {mainTab === 'notifications' && (
          <div className="relative mt-3.5 border-b border-white/10">
            <div className="grid grid-cols-3 text-center">
              {(
                [
                  { key: 'news', label: 'News' },
                  { key: 'releases', label: 'Releases' },
                  { key: 'system', label: 'System' },
                ] as const
              ).map((tab) => {
                const isActive = subTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSubTab(tab.key)}
                    className="flex flex-col items-center justify-center py-2 text-[15px] sm:text-[17px] font-semibold transition-colors cursor-pointer"
                  >
                    <span className={isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'}>
                      {tab.label}
                    </span>
                    {/* Active purple indicator underline */}
                    <div
                      className={`h-[2.5px] rounded-full mt-1.5 transition-all duration-200 ${
                        isActive ? 'w-9 sm:w-10 bg-[#a855f7]' : 'w-0 bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area (Centered Empty/Information States as per reference image) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-28 text-center">
        {mainTab === 'notifications' ? (
          <div className="flex flex-col items-center max-w-sm animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <Bell className="w-8 h-8 text-neutral-400" />
            </div>

            {subTab === 'news' && (
              <>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  No news right now
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                  Editorial updates, announcements, and community news will appear here.
                </p>
              </>
            )}

            {subTab === 'releases' && (
              <>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  No releases right now
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                  Anime episode drops, manga chapter releases, and novel updates will appear here.
                </p>
              </>
            )}

            {subTab === 'system' && (
              <>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  No system notices
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                  Server maintenance status, version patches, and app announcements will appear here.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-sm animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Leaderboards
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
              Top anime watchers, seasonal rankings, and community contributors will be displayed here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
