import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  audiobookAPI,
  type Audiobook,
  type AudiobookListResponse,
} from '@/lib/api';

interface AudiobooksState {
  // State
  audiobooks: Audiobook[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    pages: number;
  };
  filters: {
    searchTerm: string;
    selectedCategory: string;
    statusFilter?: string;
  };

  // Actions
  fetchAudiobooks: (params?: {
    page?: number;
    size?: number;
    category_id?: string;
    search?: string;
    status_filter?: string;
  }) => Promise<void>;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedCategory: (category: string) => void;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;
  clearError: () => void;
  reset: () => void;
}

const useAudiobooksStore = create<AudiobooksState>()(
  devtools(
    (set, get) => ({
      // Initial state
      audiobooks: [],
      isLoading: false,
      error: null,
      pagination: {
        total: 0,
        page: 1,
        size: 20,
        pages: 0,
      },
      filters: {
        searchTerm: '',
        selectedCategory: 'All',
      },

      // Actions
      fetchAudiobooks: async params => {
        try {
          set({ isLoading: true, error: null });

          const { filters } = get();
          const requestParams = {
            page:
              params?.page || filters.searchTerm ? 1 : get().pagination.page,
            size: params?.size || get().pagination.size,
            category_id: params?.category_id,
            search: params?.search || filters.searchTerm || undefined,
            status_filter: params?.status_filter || filters.statusFilter,
          };

          console.log('Fetching audiobooks with params:', requestParams);

          // Make real API call to backend
          console.log('Fetching audiobooks from backend API...');
          const response: AudiobookListResponse =
            await audiobookAPI.getAll(requestParams);
          console.log('Successfully fetched audiobooks from API:', response);

          set({
            audiobooks: response.audiobooks,
            pagination: {
              total: response.total,
              page: response.page,
              size: response.size,
              pages: response.pages,
            },
            isLoading: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to fetch audiobooks';
          set({ error: errorMessage, isLoading: false });
          console.error('Error fetching audiobooks:', error);
        }
      },

      setSearchTerm: searchTerm => {
        set(state => ({
          filters: { ...state.filters, searchTerm },
        }));
      },

      setSelectedCategory: selectedCategory => {
        set(state => ({
          filters: { ...state.filters, selectedCategory },
        }));
      },

      setStatusFilter: statusFilter => {
        set(state => ({
          filters: { ...state.filters, statusFilter },
        }));
      },

      clearFilters: () => {
        set(() => ({
          filters: {
            searchTerm: '',
            selectedCategory: 'All',
            statusFilter: undefined,
          },
        }));
      },

      clearError: () => set({ error: null }),

      reset: () =>
        set({
          audiobooks: [],
          isLoading: false,
          error: null,
          pagination: {
            total: 0,
            page: 1,
            size: 20,
            pages: 0,
          },
          filters: {
            searchTerm: '',
            selectedCategory: 'All',
          },
        }),
    }),
    {
      name: 'audiobooks-store',
    }
  )
);

export default useAudiobooksStore;
