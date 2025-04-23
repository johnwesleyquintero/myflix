import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';
import useCurrentUser from '../hooks/useCurrentUser';
import React, { useCallback } from 'react';
// import useSWR from 'swr'; // Import useSWR if you plan to use it for fetching/mutating favorites

interface FavoriteButtonProps {
  movieId: string;
  // Define FavoritesResponse if needed for useSWR, e.g.:
  // interface FavoritesResponse {
  //   favoriteIds: string[];
  // }
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  // The useSWR hook was causing errors and wasn't being used.
  // If you intend to fetch/mutate favorites with SWR, uncomment and configure it.
  // const { data, error, isLoading, mutate } = useSWR<FavoritesResponse>('/api/favorites');

  // Correctly destructure 'user' from the hook's return value
  const { user: currentUser, mutate } = useCurrentUser(); // Assuming useCurrentUser returns { data: user, ... }
  // If useCurrentUser returns { user: ..., error: ..., ... }, use this instead:
  // const { user: currentUser } = useCurrentUser();
  
  const isFavorite = useCallback(() => {
    // Ensure currentUser and favoriteIds exist before accessing
    const list = currentUser?.favoriteIds || [];
    return list.includes(movieId);
  }, [currentUser, movieId]);

  // Placeholder for toggle favorite logic
  const toggleFavorite = useCallback(async () => {
    try {
      let response;
      
      if (isFavorite()) {
        response = await fetch('/api/favorite', {
          method: 'DELETE',
          body: JSON.stringify({ movieId }),
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        response = await fetch('/api/favorite', {
          method: 'POST',
          body: JSON.stringify({ movieId }),
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (!response.ok) throw new Error('Failed to toggle favorite');
      
      const updatedUser = await response.json();
      mutate({ ...currentUser, favoriteIds: updatedUser.favoriteIds });
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
}, [movieId, isFavorite, currentUser, mutate]);

  return (
    <div
      onClick={toggleFavorite} // Call the toggle function on click
      className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
      role="button" // Add role for accessibility
      aria-pressed={isFavorite()} // Indicate state for screen readers
      aria-label={isFavorite() ? 'Remove from favorites' : 'Add to favorites'} // Dynamic label
    >
      {isFavorite() ? (
        <AiOutlineCheck className="text-white" size={25} />
      ) : (
        <AiOutlinePlus className="text-white" size={25} />
      )}
    </div>
  );
};

export default FavoriteButton;

// Corrected undefined reference 'AiOutlineCheck' - This comment seems outdated as the import exists.
// Corrected useSWR and FavoritesResponse errors by commenting out the unused line.
// Corrected destructuring of useCurrentUser hook result (assuming it returns { data: user, ... }). Adjust if needed.
// Added basic accessibility attributes (role, aria-pressed, aria-label).
// Added placeholder toggleFavorite function and onClick handler.
