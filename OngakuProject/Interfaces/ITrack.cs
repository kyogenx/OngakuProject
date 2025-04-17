using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface ITrack
    {
        public Task<int> UploadTrackAsync(Track_VM Model);
        public Task<int> UpdateGenresAsync(TrackGenre_VM Model);
        public Task<int> UpdateFeaturingArtistsAsync(TrackArtist_VM Model);
        public Task<string?> UpdateCoverImageAsync(TrackURL_VM Model);
        public Task<int> UpdateTrackAsync(Track_VM Model);
        public Task<int> UpdateCreditsOfTrackAsync(TrackCredits_VM Model);
        public Task<int> UpdateStatusAsync(int Id, int UserId, int Status);
        public Task<int> SubmitUploadedTrackAsync(int Id, int UserId);
        public Task<int> MuteTrackAsync(int Id, int UserId, int Duration = 0);
        public Task<int> UnmuteTrackAsync(int Id, int UserId);
        public Task<int> DisableTrackAsync(int Id, int UserId);
        public Task<int> DeleteTrackAsync(int Id, int UserId);
        public Task<int> UpdateStreamsQtyAsync(int TrackId);
        public Task<Track?> LoadTheTrackAsync(int Id, int PlaylistId);
        public Task<Track?> GetTrackInfoAsync(int Id, bool IsForAuthor = false);
        public IQueryable<Track>? GetStudioItems(int Id, bool IsForAuthor = false);
    }
}
