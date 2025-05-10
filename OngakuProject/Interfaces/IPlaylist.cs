using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IPlaylist
    {
        public IQueryable<Favorite>? GetFavorites(int Id, int Skip = 0, int Take = 30);
        public Task<Playlist?> GetPlaylistInfoAsync(int Id, bool IsForAuthor = true);
        public Task<Playlist?> GetPlaylistInfoAsync(string? Shortname, bool IsForAuthor = true);
        public Task<Playlist?> GetPlaylistEditInfoAsync(int Id);
        public Task<string?> GetPlaylistShortnameAsync(int Id);
        public IQueryable<Track?>? GetPlaylistTracks(int Id, int UserId = 0, int Skip = 0, int Take = 30);
        public Task<bool> IsPlaylistSavedAsync(int Id, int UserId);
        public Task<int> GetFavoriteSongsQuantityAsync(int Id);
        public Task<bool> IsFavoritedAsync(int Id, int UserId);

        public Task<int> AddAsync(int Id, int UserId);
        public Task<int> RemoveAsync(int Id, int UserId);
        public Task<Playlist?> CreateAsync(Playlist_VM Model);
        public Task<int> EditAsync(Playlist_VM Model);
        public Task<string?> EditShortnameAsync(int Id, int UserId, string? Shortname);
        public Task<string?> EditImageAsync(int Id, int UserId, IFormFile? FileUrl);
        public Task<int> DeleteAsync(int Id, int UserId);
        public Task<int> PinAsync(int Id, int UserId);
        public Task<int> UnpinAsync(int Id, int UserId);
        public Task<int> AddTrackToPlaylistAsync(int Id, int PlaylistId, int UserId);
        public Task<int> RemoveTrackFromPlaylistAsync(int Id, int PlaylistId, int UserId);
        public Task<bool> CheckPlaylistShortnameAsync(int Id, string? Shortname);
        public IQueryable<UserPlaylist>? GetPlaylists(int Id, bool IsForEditing = false);
    }
}
