using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IPlaylist
    {
        public Task<int> AddToFavoritesAsync(Favorites_VM Model);
        public Task<int> RemoveFromFavoritesAsync(int Id, int UserId);
        public IQueryable<Favorite>? GetFavorites(int Id, int Skip = 0, int Take = 30);
        public Task<Playlist?> GetPlaylistInfoAsync(int Id);
        public IQueryable<Track?>? GetPlaylistTracks(int Id, int Skip = 0, int Take = 30);
        public Task<bool> IsPlaylistSavedAsync(int Id, int UserId);
        public Task<int> GetFavoriteSongsQuantityAsync(int Id);
        public Task<bool> IsFavoritedAsync(int Id, int UserId);
        public IQueryable<UserPlaylist>? GetPlaylists(int Id);
    }
}
