export default function useCurrentUser() {
  return {
    data: {
      favoriteIds: [] as string[],
    },
    mutate: () => {},
  };
}
