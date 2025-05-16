using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IPlaylist
    {
        public IQueryable<Favorite>? GetFavorites(int Id, int Skip = 0, int Take = 30);
        public Task<Playlist?> GetInfoAsync(int Id, bool IsForAuthor = true);
        public Task<Playlist?> GetInfoAsync(string? Shortname, bool IsForAuthor = true);
        public Task<Playlist?> GetAftersaveInfoAsync(int Id);
        public Task<Playlist?> GetEditInfoAsync(int Id);
        public Task<string?> GetShortnameAsync(int Id);
        public IQueryable<Track?>? GetTracks(int Id, int UserId = 0, int Skip = 0, int Take = 30);
        public Task<DateTime?> GetPlaylistLastUpdateDateAsync(int Id, int UserId = 0);
        public Task<bool> IsSavedAsync(int Id, int UserId);
        public Task<int> GetFavoriteSongsQuantityAsync(int Id);
        public Task<bool> IsFavoritedAsync(int Id, int UserId);

        public Task<(int, int)?> AddAsync(int Id, int UserId);
        public Task<int> RemoveAsync(int Id, int UserId);
        public Task<Playlist?> CreateAsync(Playlist_VM Model);
        public Task<int> EditAsync(Playlist_VM Model);
        public Task<string?> EditShortnameAsync(int Id, int UserId, string? Shortname);
        public Task<string?> EditImageAsync(int Id, int UserId, IFormFile? FileUrl);
        public Task<int> DeleteAsync(int Id, int UserId);
        public Task<int> PinAsync(int Id, int UserId);
        public Task<int> UnpinAsync(int Id, int UserId);
        public Task<int> AddTrackToAsync(TrackManagement_VM Model);
        public Task<int> RemoveTrackFromAsync(TrackManagement_VM Model);
        public Task<bool> CheckShortnameAsync(int Id, string? Shortname);
        public IQueryable<UserPlaylist>? Get(int Id, bool ForTrackManagement = false);
        public IQueryable<Playlist>? GetToEdit(int Id);
    }
}
