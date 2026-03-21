import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axiosConfig';

const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      error: null,

      fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
          console.log('Fetching projects from /api/projects...');
          const response = await axiosInstance.get('/api/projects');
          console.log('Projects API response:', response.data);
          const projectsData = Array.isArray(response.data) ? response.data : [];
          // Add imageUrl to each project
          const projectsWithImageUrls = projectsData.map((project) => {
            const imageUrl = project.attachments?.[0]
              ? `http://localhost:5000${project.attachments[0]}`
              : null;
            console.log(`Image URL for project ${project.name || project._id}:`, imageUrl);
            return { ...project, imageUrl };
          });
          set({ projects: projectsWithImageUrls, loading: false });
        } catch (error) {
          console.error('Error fetching projects:', error);
          console.error('Error details:', error.response?.data || error.message);
          set({ 
            projects: [], 
            error: error.response?.data?.message || 'Failed to fetch projects', 
            loading: false 
          });
        }
      },

      addProject: async (projectData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/api/projects', projectData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const newProject = {
            ...response.data,
            imageUrl: response.data.attachments?.[0]
              ? `http://localhost:5000${response.data.attachments[0]}`
              : null,
          };
          set((state) => ({
            projects: [...state.projects, newProject],
            loading: false,
          }));
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false });
          throw error;
        }
      },

      updateProject: async (id, projectData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put(`/api/projects/${id}`, projectData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const updatedProject = {
            ...response.data,
            imageUrl: response.data.attachments?.[0]
              ? `http://localhost:5000${response.data.attachments[0]}`
              : null,
          };
          set((state) => ({
            projects: state.projects.map((project) =>
              project._id === id ? updatedProject : project
            ),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false });
          throw error;
        }
      },

      deleteProject: async (id) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/api/projects/${id}`);
          set((state) => ({
            projects: state.projects.filter((project) => project._id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false });
          throw error;
        }
      },

      clearPersistedState: () => {
        set({ projects: [], loading: false, error: null });
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);

// Clear persisted state on app load to ensure projects is an array
useProjectStore.getState().clearPersistedState();

export default useProjectStore;