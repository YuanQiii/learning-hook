import { ref } from "vue";

export default function useModal() {
  const visible = ref(false);
  const loading = ref(false);
  const fullScreen = ref<boolean>(false)
  const openModal = () => (visible.value = true);
  const closeModal = () => (visible.value = false);
  const openLoading = () => (loading.value = true);
  const closeLoading = () => (loading.value = false);
  const openFullScreen = () => (fullScreen.value = true)
  const closeFullScreen = () => (fullScreen.value = false)
  return {
    visible,
    loading,
    fullScreen,
    openModal,
    closeModal,
    openLoading,
    closeLoading,
    openFullScreen,
    closeFullScreen
  };
}