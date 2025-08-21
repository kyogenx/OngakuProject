using OngakuProject.DTO;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IAlbum
    {
        public Task<int> UploadNewAlbumAsync(Album_VM Model);
        public Task<int> EditMetadataAsync(AlbumMetadata_VM MetadataModel);
        public Task<int> EditVersionAsync(int Id, int UserId, int Version);
        public Task<int> EditGenreAsync(int Id, int UserId, int GenreId);
        public Task<int> EditPremiereDateAsync(int Id, int UserId, DateTime PremiereDate);
        public Task<string?> EditCoverImageAsync(int Id, int UserId, IFormFile? CoverImageFile);
        public Task<int> ApplyTracklistToAlbumAsync(int Id, int UserId, List<AlbumTrack_VM> AlbumTracksModel);
        public Task<int> DisableAsync(int Id, int UserId);
        public Task<int> EnableAsync(int Id, int UserId);
        public Task<int> SubmitAsync(int Id, int UserId);
        public Task<int> DeleteAlbumAsync(int Id, int UserId);

        public Task<int> GetQuantityAsync(int Id, bool IsForAuthor = false);
        public IQueryable<Album_DTO>? Get(int Id, bool IsForAuthor = false, int Skip = 0, int LoadQty = 25);
        public Task<Album_DTO?> GetInfoAsync(int Id, int FetchingUserId = 0, bool IsForAuthor = false);
        public IQueryable<Track_DTO>? GetTracks(int Id, int Skip = 0, int LoadQty = 45);
    }
}
