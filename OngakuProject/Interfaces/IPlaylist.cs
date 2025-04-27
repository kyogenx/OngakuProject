using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IPlaylist
    {
        public Task<int> AddToFavoritesAsync(Favorites_VM Model);
        public Task<int> RemoveFromFavoritesAsync(int Id, int UserId);
        public IQueryable<Favorite>? GetFavorites(int Id, int Skip = 0, int Take = 30);
        public Task<Playlist?> GetPlaylistInfoAsync(int Id, bool IsForAuthor = true);
        public Task<Playlist?> GetPlaylistInfoAsync(string? Shortname, bool IsForAuthor = true);
        public Task<string?> GetPlaylistShortnameAsync(int Id);
        public IQueryable<Track?>? GetPlaylistTracks(int Id, int Skip = 0, int Take = 30);
        public Task<bool> IsPlaylistSavedAsync(int Id, int UserId);
        public Task<int> GetFavoriteSongsQuantityAsync(int Id);
        public Task<bool> IsFavoritedAsync(int Id, int UserId);

        public Task<int> AddPlaylistAsync(int Id, int UserId);
        public Task<int> RemovePlaylistAsync(int Id, int UserId);
        public Task<Playlist?> CreatePlaylistAsync(Playlist_VM Model);
        public Task<int> EditPlaylistAsync(Playlist_VM Model);
        public Task<string?> EditPlaylistShortnameAsync(int Id, int UserId, string? Shortname);
        public Task<string?> EditPlaylistImageAsync(int Id, IFormFile? FileUrl);
        public Task<int> AddTrackToPlaylistAsync(int Id, int PlaylistId, int UserId);
        public Task<int> RemoveTrackFromPlaylistAsync(int Id, int PlaylistId, int UserId);
        public Task<bool> CheckPlaylistShortnameAsync(int Id, string? Shortname);
        public IQueryable<UserPlaylist>? GetPlaylists(int Id);
    }
}
