import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CharacterModal: React.FC = () => {
  const { selectedCharacter, setSelectedCharacter } = useApp();

  if (!selectedCharacter) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black overflow-y-auto no-scrollbar pb-24 text-white animate-in fade-in duration-200">
      {/* Top Header with Back button */}
      <div className="sticky top-0 z-50 flex items-center gap-3 p-4 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <button
          onClick={() => setSelectedCharacter(null)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-white line-clamp-1">{selectedCharacter.name}</h2>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Character Hero Card */}
        <div className="flex gap-4 p-4 bg-[#12121A] rounded-3xl border border-white/10 shadow-xl">
          {selectedCharacter.image ? (
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
              className="w-28 h-36 sm:w-32 sm:h-44 object-cover rounded-2xl shadow-lg shrink-0"
            />
          ) : (
            <div className="w-28 h-36 sm:w-32 sm:h-44 bg-neutral-800 rounded-2xl shadow-lg shrink-0" />
          )}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{selectedCharacter.name}</h1>
              {selectedCharacter.nativeName && (
                <p className="text-xs font-semibold text-white/50">{selectedCharacter.nativeName}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedCharacter.role && (
                <div className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 font-bold text-xs border border-white/10">
                  {selectedCharacter.role.toLowerCase().includes('main') ? 'Main' : 'Supporting'}
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/20 text-purple-400 font-bold text-xs border border-purple-500/30">
                <Heart className="w-4 h-4 fill-current" />
                <span>{selectedCharacter.hearts || 80}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 bg-[#12121A] rounded-3xl border border-white/10 space-y-2 text-xs">
          {selectedCharacter.gender && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50 font-medium">Gender</span>
              <span className="text-white font-bold">{selectedCharacter.gender}</span>
            </div>
          )}
          {selectedCharacter.birthday && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50 font-medium">Birthday</span>
              <span className="text-white font-bold">{selectedCharacter.birthday}</span>
            </div>
          )}
          {selectedCharacter.age && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50 font-medium">Age</span>
              <span className="text-white font-bold">{selectedCharacter.age}</span>
            </div>
          )}
          {selectedCharacter.bloodType && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50 font-medium">Blood Type</span>
              <span className="text-white font-bold">{selectedCharacter.bloodType}</span>
            </div>
          )}
          {selectedCharacter.height && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50 font-medium">Height</span>
              <span className="text-white font-bold">{selectedCharacter.height}</span>
            </div>
          )}
          {selectedCharacter.relatives && selectedCharacter.relatives.length > 0 && (
            <div className="py-1">
              <span className="text-white/50 font-medium block mb-1">Relatives</span>
              <div className="space-y-0.5 pl-2 text-purple-300">
                {selectedCharacter.relatives.map((rel, idx) => (
                  <div key={idx} className="text-[11px]">
                    <span className="font-bold underline">{rel.name}</span> ({rel.relation})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        {selectedCharacter.bio && (
          <div className="p-4 bg-[#12121A] rounded-3xl border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white">Biography</h3>
            <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line">{selectedCharacter.bio}</p>
          </div>
        )}

        {/* Voice Actor */}
        {selectedCharacter.voiceActor && (
          <div className="p-4 bg-[#12121A] rounded-3xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white">Voice Actor</h3>
            <div className="flex items-center gap-3">
              {selectedCharacter.voiceActor.image ? (
                <img
                  src={selectedCharacter.voiceActor.image}
                  alt={selectedCharacter.voiceActor.name}
                  className="w-12 h-16 object-cover rounded-xl shadow-md shrink-0"
                />
              ) : (
                <div className="w-12 h-16 bg-neutral-800 rounded-xl shadow-md shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white line-clamp-1">{selectedCharacter.voiceActor.name}</h4>
                {selectedCharacter.voiceActor.nativeName && (
                  <p className="text-xs text-white/50">{selectedCharacter.voiceActor.nativeName}</p>
                )}
                <p className="text-[11px] text-purple-400 font-semibold mt-0.5">{selectedCharacter.voiceActor.language || 'Japanese'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Appeared In List */}
        {selectedCharacter.appearedIn && selectedCharacter.appearedIn.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Appeared In</h3>
            <div className="space-y-2.5">
              {selectedCharacter.appearedIn.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 p-2.5 bg-[#12121A] rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer"
                >
                  {app.image ? (
                    <img src={app.image} alt={app.title} className="w-12 h-16 object-cover rounded-xl shadow-md" />
                  ) : (
                    <div className="w-12 h-16 bg-neutral-800 rounded-xl shadow-md shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{app.title}</h4>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {app.year} · {app.format}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
