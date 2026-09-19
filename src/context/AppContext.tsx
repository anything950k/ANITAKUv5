import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MediaItem,
  MediaCategory,
  Character,
  UserLibraryEntry,
  MangaReadingHistoryItem,
  AnimeWatchHistoryItem,
  RecentActivityItem,
  FilterOptions,
  LibraryStatus,
  SettingsState,
  AccentColorKey,
  NavTab,
} from '../types';
import { safeGetItem, safeSetItem } from '../utils/storage';
import { normalizeMediaStatus } from '../utils/libraryStatus';

export type { NavTab };

export const ACCENT_COLOR_MAP: Record<AccentColorKey, { bg: string; text: string; hex: string }> = {
  Purple: { bg: 'bg-purple-500', text: 'text-purple-400', hex: '#a855f7' },
  Blue: { bg: 'bg-blue-500', text: 'text-blue-400', hex: '#3b82f6' },
  Teal: { bg: 'bg-teal-500', text: 'text-teal-400', hex: '#14b8a6' },
  Emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', hex: '#10b981' },
  Amber: { bg: 'bg-amber-500', text: 'text-amber-400', hex: '#f59e0b' },
  Coral: { bg: 'bg-orange-500', text: 'text-orange-400', hex: '#f97316' },
  Rose: { bg: 'bg-rose-500', text: 'text-rose-400', hex: '#f43f5e' },
  Red: { bg: 'bg-red-500', text: 'text-red-400', hex: '#ef4444' },
  Lime: { bg: 'bg-lime-500', text: 'text-lime-400', hex: '#84cc16' },
};

export const DEFAULT_SETTINGS: SettingsState = {
  appLanguage: 'English',
  appHaptics: true,
  deviceNotifications: true,
  dns: 'Cloudflare',
  enableTrailers: true,
  trailersStartMuted: true,
  cacheLimit: 'Balanced',
  pureBlackMode: true,
  accentColor: 'Purple',
  enableLiquidGlass: true,
  glassBlur: 0,
  glassSaturation: 75,
  glassRefraction: 0,
  glassTint: 12,
  homepageMetadata: 'Auto',
  titleLanguage: 'English',
  ratingFormat: '10-Point · 1 Decimal Place',
  showLibraryProgress: true,
  fillerList: true,
  gestures: true,
  ambientLight: true,
  autoSkipFiller: true,
  sleepTimer: 'Off',
  videoQuality: 'Auto',
  audioPreference: 'Japanese',
  subtitleLanguage: 'English',
  subtitlePreference: 'Automatic',
  subtitleFont: 'Netflix Sans',
  subtitleSize: 15,
  subtitleElevation: -10,
  playbackSpeed: '1x',
  mangaReaderMode: 'Paged',
  pageTurnAnimation: 'Default',
  pagedReaderDirection: 'Left to Right',
  imageScale: 'Fit',
  zoomStart: 'Auto',
  tapNavigation: 'Edges',
  readerBackground: 'Black',
  cropBorders: false,
  webtoonCropBorders: false,
  automaticWebtoon: true,
  widePageZoom: true,
  keepScreenOn: true,
  preloadPages: 2,
  downloadPath: '',
  downloadPermissionGranted: false,
  deleteFilesByDefault: false,
};

export const INITIAL_USER_LIBRARY: UserLibraryEntry[] = [];
export const INITIAL_RECENT_ACTIVITY: RecentActivityItem[] = [];

export const DEFAULT_FILTERS: FilterOptions = {
  category: 'anime',
  query: '',
  genres: [],
  format: [],
  status: [],
  libraryState: 'Any',
  minScore: 'Any',
  scoreRange: [0, 100],
  selectedYear: 'Any',
  yearRange: [1940, 2028],
  season: [],
  studio: '',
  tagCategory: 'Theme',
  advancedTags: [],
};

interface AppContextType {
  activeCategory: MediaCategory;
  setActiveCategory: (cat: MediaCategory) => void;

  activeNav: NavTab;
  setActiveNav: (tab: NavTab) => void;

  selectedMedia: MediaItem | null;
  setSelectedMedia: (media: MediaItem | null) => void;
  openMediaDetails: (media: MediaItem) => void;
  closeMediaDetails: () => void;

  selectedCharacter: Character | null;
  setSelectedCharacter: (c: Character | null) => void;

  showWatchOrder: boolean;
  setShowWatchOrder: (show: boolean) => void;

  showEpisodeSearch: boolean;
  setShowEpisodeSearch: (show: boolean) => void;

  showAddToLibrary: boolean;
  setShowAddToLibrary: (show: boolean) => void;

  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;

  activeLibraryStatus: LibraryStatus | 'Favorites' | null;
  setActiveLibraryStatus: (status: LibraryStatus | 'Favorites' | null) => void;

  activeVideoEpisode: { media: MediaItem; episodeNumber: number } | null;
  setActiveVideoEpisode: (ep: { media: MediaItem; episodeNumber: number } | null) => void;

  activeReader: { media: MediaItem; chapterNumber: number; chapterId?: string } | null;
  setActiveReader: (r: { media: MediaItem; chapterNumber: number; chapterId?: string } | null) => void;

  // Real Manga Reading History (Independent from Profile Library)
  mangaReadingHistory: MangaReadingHistoryItem[];
  recordMangaReadingProgress: (
    media: MediaItem,
    chapterNumber: number,
    chapterId?: string,
    pageNumber?: number
  ) => void;
  removeFromMangaHistory: (mediaId: string | number) => void;
  clearMangaHistory: () => void;

  // Real Anime Watch History (Independent from Profile Library)
  animeWatchHistory: AnimeWatchHistoryItem[];
  recordAnimeWatchProgress: (
    media: MediaItem,
    episodeNumber: number,
    currentTime?: number,
    duration?: number
  ) => void;
  removeFromAnimeHistory: (mediaId: string | number) => void;
  clearAnimeHistory: () => void;

  // Personal Library state (Watching, Reading, Planning, Completed, Dropped)
  userLibrary: UserLibraryEntry[];
  addToLibrary: (media: MediaItem, status: LibraryStatus) => void;
  removeFromLibrary: (mediaId: string | number) => void;
  updateLibraryProgress: (mediaId: string | number, progress: number) => void;
  getLibraryEntry: (mediaId: string | number) => UserLibraryEntry | undefined;

  // Independent Favorites state (strictly profile favorites, not saved as a library status)
  userFavorites: MediaItem[];
  isMediaFavorite: (mediaId: string | number) => boolean;
  toggleFavorite: (media: MediaItem) => void;

  recentActivity: RecentActivityItem[];

  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;

  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  settingsSubPage: string | null;
  setSettingsSubPage: (page: string | null) => void;

  settingsActiveModal: string | null;
  setSettingsActiveModal: (modal: string | null) => void;

  isProfileSheetOpen: boolean;
  setIsProfileSheetOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('anime');
  const [activeNav, setActiveNav] = useState<NavTab>('home');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showWatchOrder, setShowWatchOrder] = useState<boolean>(false);
  const [showEpisodeSearch, setShowEpisodeSearch] = useState<boolean>(false);
  const [showAddToLibrary, setShowAddToLibrary] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [activeLibraryStatus, setActiveLibraryStatus] = useState<LibraryStatus | 'Favorites' | null>(null);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState<boolean>(false);

  const [activeVideoEpisode, setActiveVideoEpisode] = useState<{ media: MediaItem; episodeNumber: number } | null>(null);
  const [activeReader, setActiveReader] = useState<{ media: MediaItem; chapterNumber: number; chapterId?: string } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [settingsSubPage, setSettingsSubPage] = useState<string | null>(null);
  const [settingsActiveModal, setSettingsActiveModal] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  // User Library state (Watching, Reading, Planning, Completed, Dropped)
  const [userLibrary, setUserLibrary] = useState<UserLibraryEntry[]>(() => {
    const raw = safeGetItem<UserLibraryEntry[]>('satori_user_library', INITIAL_USER_LIBRARY, true);
    return raw.map((item) => ({
      ...item,
      status: normalizeMediaStatus(item.category, item.status),
    }));
  });

  // Dedicated User Favorites state (persisted independently)
  const [userFavorites, setUserFavorites] = useState<MediaItem[]>(() => {
    return safeGetItem<MediaItem[]>('satori_user_favorites', [], true);
  });

  // Dedicated Manga Reading History (persisted independently - NOT auto-added to profile userLibrary)
  const [mangaReadingHistory, setMangaReadingHistory] = useState<MangaReadingHistoryItem[]>(() => {
    return safeGetItem<MangaReadingHistoryItem[]>('satori_manga_reading_history', [], true);
  });

  // Dedicated Anime Watch History (persisted independently - NOT auto-added to profile userLibrary)
  const [animeWatchHistory, setAnimeWatchHistory] = useState<AnimeWatchHistoryItem[]>(() => {
    return safeGetItem<AnimeWatchHistoryItem[]>('satori_anime_watch_history', [], true);
  });

  // Recent activity
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(() => {
    return safeGetItem<RecentActivityItem[]>('satori_recent_activity', INITIAL_RECENT_ACTIVITY, true);
  });

  // Settings
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = safeGetItem<Partial<SettingsState> | null>('satori_settings', null, true);
    if (!saved) return DEFAULT_SETTINGS;
    
    // If the saved settings contain the legacy mock download path 'Internal storage/ANIFY', clear it
    const cleaned = { ...DEFAULT_SETTINGS, ...saved };
    if (cleaned.downloadPath === 'Internal storage/ANIFY') {
      cleaned.downloadPath = '';
      cleaned.downloadPermissionGranted = false;
    }
    if (!cleaned.dns || cleaned.dns === 'System Default') {
      cleaned.dns = 'Cloudflare';
    }
    if (!cleaned.cacheLimit || cleaned.cacheLimit === '2 GB') {
      cleaned.cacheLimit = 'Balanced';
    }
    if (cleaned.glassBlur === 16 && cleaned.glassSaturation === 100 && cleaned.glassRefraction === 50) {
      cleaned.glassBlur = 0;
      cleaned.glassSaturation = 75;
      cleaned.glassRefraction = 0;
      cleaned.glassTint = 12;
    }
    if (!cleaned.homepageMetadata) {
      cleaned.homepageMetadata = 'Auto';
    }
    if (!cleaned.ratingFormat) {
      cleaned.ratingFormat = '10-Point · 1 Decimal Place';
    }
    if (cleaned.autoSkipFiller === undefined) {
      cleaned.autoSkipFiller = true;
    }
    if (!cleaned.videoQuality) {
      cleaned.videoQuality = 'Auto';
    }
    if (!cleaned.subtitlePreference || cleaned.subtitlePreference === 'Softsubs') {
      cleaned.subtitlePreference = 'Automatic';
    }
    if (!cleaned.subtitleFont || cleaned.subtitleFont === 'Inter') {
      cleaned.subtitleFont = 'Netflix Sans';
    }
    if (cleaned.subtitleSize === undefined || cleaned.subtitleSize === 16) {
      cleaned.subtitleSize = 15;
    }
    if (cleaned.subtitleElevation === undefined || cleaned.subtitleElevation === 10) {
      cleaned.subtitleElevation = -10;
    }
    if (!cleaned.playbackSpeed || cleaned.playbackSpeed === '1.0x') {
      cleaned.playbackSpeed = '1x';
    }
    return cleaned;
  });

  useEffect(() => {
    safeSetItem('satori_user_library', userLibrary, true);
  }, [userLibrary]);

  useEffect(() => {
    safeSetItem('satori_user_favorites', userFavorites, true);
  }, [userFavorites]);

  useEffect(() => {
    safeSetItem('satori_manga_reading_history', mangaReadingHistory, true);
  }, [mangaReadingHistory]);

  useEffect(() => {
    safeSetItem('satori_anime_watch_history', animeWatchHistory, true);
  }, [animeWatchHistory]);

  useEffect(() => {
    safeSetItem('satori_recent_activity', recentActivity, true);
  }, [recentActivity]);

  useEffect(() => {
    safeSetItem('satori_settings', settings, true);
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const openMediaDetails = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const closeMediaDetails = () => {
    setSelectedMedia(null);
  };

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, category: activeCategory });
  };

  const addToLibrary = (media: MediaItem, status: LibraryStatus) => {
    const normalizedStatus = normalizeMediaStatus(media.category, status);

    setUserLibrary((prev) => {
      const existingIdx = prev.findIndex((item) => String(item.mediaId) === String(media.id));
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          category: media.category,
          status: normalizedStatus,
          lastUpdated: 'Just now',
        };
        return updated;
      }
      const isFav = userFavorites.some((f) => String(f.id) === String(media.id));
      const existingHistory =
        media.category === 'anime'
          ? animeWatchHistory.find((item) => String(item.mediaId) === String(media.id))?.lastWatchedEpisode
          : mangaReadingHistory.find((item) => String(item.mediaId) === String(media.id))?.lastReadChapter;

      const newEntry: UserLibraryEntry = {
        id: `lib-${Date.now()}`,
        mediaId: media.id,
        title: media.title,
        coverImage: media.coverImage,
        category: media.category,
        status: normalizedStatus,
        currentProgress: existingHistory !== undefined ? existingHistory : undefined,
        totalCount: media.totalEpisodes || media.totalChapters || media.totalVolumes || 12,
        lastUpdated: 'Just now',
        score: media.score,
        isFavorite: isFav,
      };
      return [newEntry, ...prev];
    });

    // Also add to recent activity
    const newAct: RecentActivityItem = {
      id: `act-${Date.now()}`,
      mediaId: media.id,
      title: media.title,
      coverImage: media.coverImage,
      type: media.category === 'anime' ? 'WATCHING' : 'READING',
      timeAgo: 'Just now',
    };
    setRecentActivity((prev) => [newAct, ...prev.filter((a) => String(a.mediaId) !== String(media.id))]);
    showToast(`Added to ${normalizedStatus}`);
    setShowAddToLibrary(false);
  };

  const removeFromLibrary = (mediaId: string | number) => {
    setUserLibrary((prev) => prev.filter((item) => String(item.mediaId) !== String(mediaId)));
    showToast('Removed from library');
    setShowAddToLibrary(false);
  };

  const updateLibraryProgress = (mediaId: string | number, progress: number) => {
    setUserLibrary((prev) =>
      prev.map((item) =>
        String(item.mediaId) === String(mediaId)
          ? { ...item, currentProgress: progress, lastUpdated: 'Just now' }
          : item
      )
    );
  };

  const recordMangaReadingProgress = (
    media: MediaItem,
    chapterNumber: number,
    chapterId?: string,
    pageNumber?: number
  ) => {
    // 1. Record / update dedicated manga reading history (most recent first)
    setMangaReadingHistory((prev) => {
      const existing = prev.find((item) => String(item.mediaId) === String(media.id));
      const entry: MangaReadingHistoryItem = {
        id: `mhist-${media.id}`,
        mediaId: media.id,
        title: media.title,
        coverImage: media.coverImage,
        bannerImage: media.bannerImage,
        category: media.category,
        lastReadChapter: chapterNumber,
        lastReadChapterId: chapterId || existing?.lastReadChapterId,
        lastReadPage: pageNumber || existing?.lastReadPage || 1,
        lastReadTime: Date.now(),
        score: media.score,
        genres: media.genres,
        description: media.description,
        totalChapters: media.totalChapters,
      };
      return [entry, ...prev.filter((item) => String(item.mediaId) !== String(media.id))];
    });

    // 2. If AND ONLY IF the user manually added this manga to their library, update progress there
    setUserLibrary((prev) =>
      prev.map((item) =>
        String(item.mediaId) === String(media.id)
          ? { ...item, currentProgress: chapterNumber, lastUpdated: 'Just now' }
          : item
      )
    );

    // 3. Update recent activity text
    setRecentActivity((prev) => {
      const act: RecentActivityItem = {
        id: `act-${Date.now()}`,
        mediaId: media.id,
        title: media.title,
        coverImage: media.coverImage,
        type: 'READING',
        progressText: `Chapter ${chapterNumber}`,
        timeAgo: 'Just now',
      };
      return [act, ...prev.filter((a) => String(a.mediaId) !== String(media.id))];
    });
  };

  const removeFromMangaHistory = (mediaId: string | number) => {
    setMangaReadingHistory((prev) => prev.filter((item) => String(item.mediaId) !== String(mediaId)));
  };

  const clearMangaHistory = () => {
    setMangaReadingHistory([]);
  };

  const recordAnimeWatchProgress = (
    media: MediaItem,
    episodeNumber: number,
    currentTime?: number,
    duration?: number
  ) => {
    // 1. Record / update dedicated anime watch history (most recent first)
    setAnimeWatchHistory((prev) => {
      const existing = prev.find((item) => String(item.mediaId) === String(media.id));
      const calcPercent = duration && duration > 0 && currentTime !== undefined
        ? Math.min(100, Math.round((currentTime / duration) * 100))
        : existing?.progressPercent || 0;

      const entry: AnimeWatchHistoryItem = {
        id: `ahist-${media.id}`,
        mediaId: media.id,
        title: media.title,
        coverImage: media.coverImage,
        bannerImage: media.bannerImage,
        category: 'anime',
        lastWatchedEpisode: episodeNumber,
        lastWatchedTime: Date.now(),
        currentTime: currentTime ?? existing?.currentTime ?? 0,
        duration: duration ?? existing?.duration ?? 0,
        progressPercent: calcPercent,
        score: media.score,
        genres: media.genres,
        description: media.description,
        totalEpisodes: media.totalEpisodes,
      };
      return [entry, ...prev.filter((item) => String(item.mediaId) !== String(media.id))];
    });

    // 2. If AND ONLY IF the user manually added this anime to their library, update progress there
    setUserLibrary((prev) =>
      prev.map((item) =>
        String(item.mediaId) === String(media.id)
          ? { ...item, currentProgress: episodeNumber, lastUpdated: 'Just now' }
          : item
      )
    );

    // 3. Update recent activity text
    setRecentActivity((prev) => {
      const act: RecentActivityItem = {
        id: `act-${Date.now()}`,
        mediaId: media.id,
        title: media.title,
        coverImage: media.coverImage,
        type: 'WATCHING',
        progressText: `Episode ${episodeNumber}`,
        timeAgo: 'Just now',
      };
      return [act, ...prev.filter((a) => String(a.mediaId) !== String(media.id))];
    });
  };

  const removeFromAnimeHistory = (mediaId: string | number) => {
    setAnimeWatchHistory((prev) => prev.filter((item) => String(item.mediaId) !== String(mediaId)));
  };

  const clearAnimeHistory = () => {
    setAnimeWatchHistory([]);
  };

  const isMediaFavorite = (mediaId: string | number) => {
    return userFavorites.some((item) => String(item.id) === String(mediaId));
  };

  const toggleFavorite = (media: MediaItem) => {
    const isCurrentlyFav = userFavorites.some((i) => String(i.id) === String(media.id));

    if (isCurrentlyFav) {
      // Remove from favorites
      setUserFavorites((prev) => prev.filter((i) => String(i.id) !== String(media.id)));
      // If it exists in userLibrary, simply toggle isFavorite flag without affecting library status
      setUserLibrary((prev) =>
        prev.map((i) =>
          String(i.mediaId) === String(media.id) ? { ...i, isFavorite: false } : i
        )
      );
      showToast('Removed from favorites');
    } else {
      // Add to favorites list directly (does NOT create any Watching/Reading library entry)
      const favItem: MediaItem = {
        id: String(media.id),
        title: media.title,
        romajiTitle: media.romajiTitle,
        nativeTitle: media.nativeTitle,
        coverImage: media.coverImage,
        bannerImage: media.bannerImage,
        category: media.category,
        format: media.format,
        status: media.status,
        score: media.score,
        year: media.year,
        genres: media.genres,
        description: media.description,
        studio: media.studio,
        author: media.author,
        communityHearts: media.communityHearts,
      };

      setUserFavorites((prev) => [favItem, ...prev.filter((i) => String(i.id) !== String(media.id))]);
      // If it exists in userLibrary, simply sync isFavorite flag
      setUserLibrary((prev) =>
        prev.map((i) =>
          String(i.mediaId) === String(media.id) ? { ...i, isFavorite: true } : i
        )
      );
      showToast('Added to favorites');
    }
  };

  const getLibraryEntry = (mediaId: string | number) => {
    return userLibrary.find((i) => String(i.mediaId) === String(mediaId));
  };

  return (
    <AppContext.Provider
      value={{
        activeCategory,
        setActiveCategory,
        activeNav,
        setActiveNav,
        selectedMedia,
        setSelectedMedia,
        openMediaDetails,
        closeMediaDetails,
        selectedCharacter,
        setSelectedCharacter,
        showWatchOrder,
        setShowWatchOrder,
        showEpisodeSearch,
        setShowEpisodeSearch,
        showAddToLibrary,
        setShowAddToLibrary,
        showFilterModal,
        setShowFilterModal,
        activeLibraryStatus,
        setActiveLibraryStatus,
        activeVideoEpisode,
        setActiveVideoEpisode,
        activeReader,
        setActiveReader,
        mangaReadingHistory,
        recordMangaReadingProgress,
        removeFromMangaHistory,
        clearMangaHistory,
        animeWatchHistory,
        recordAnimeWatchProgress,
        removeFromAnimeHistory,
        clearAnimeHistory,
        userLibrary,
        addToLibrary,
        removeFromLibrary,
        updateLibraryProgress,
        getLibraryEntry,
        userFavorites,
        isMediaFavorite,
        toggleFavorite,
        recentActivity,
        filters,
        setFilters,
        resetFilters,
        settings,
        updateSetting,
        toastMessage,
        showToast,
        settingsSubPage,
        setSettingsSubPage,
        settingsActiveModal,
        setSettingsActiveModal,
        isProfileSheetOpen,
        setIsProfileSheetOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
