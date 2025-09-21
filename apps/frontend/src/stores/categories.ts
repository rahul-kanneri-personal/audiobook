import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { categoryAPI, type Category } from '@/lib/api';

interface CategoriesState {
  // State
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  fetchActiveCategories: () => Promise<void>;
  createCategory: (
    data: Omit<Category, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<Category>;
  clearError: () => void;
  reset: () => void;
}

const useCategoriesStore = create<CategoriesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      isLoading: false,
      error: null,

      // Actions
      fetchCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const categories = await categoryAPI.getAll();
          set({ categories, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to fetch categories';
          set({ error: errorMessage, isLoading: false });
          console.error('Error fetching categories:', error);
        }
      },

      fetchActiveCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const categories = await categoryAPI.getActive();
          set({ categories, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to fetch active categories';
          set({ error: errorMessage, isLoading: false });
          console.error('Error fetching active categories:', error);
        }
      },

      createCategory: async data => {
        try {
          set({ isLoading: true, error: null });
          const newCategory = await categoryAPI.create(data);
          const currentCategories = get().categories;
          set({
            categories: [...currentCategories, newCategory],
            isLoading: false,
          });
          return newCategory;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to create category';
          set({ error: errorMessage, isLoading: false });
          console.error('Error creating category:', error);
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set({ categories: [], isLoading: false, error: null }),
    }),
    {
      name: 'categories-store',
    }
  )
);

export default useCategoriesStore;
