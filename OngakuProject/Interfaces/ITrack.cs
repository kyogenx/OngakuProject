using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface ITrack
    {
        public Task<int> UploadTrackAsync(Track_VM Model);
        public Task<int> UpdateGenresAsync(TrackGenre_VM Model);
        public Task<int> UpdateFeaturingArtistsAsync(TrackArtist_VM Model);
        public Task<int> UpdateTrackAsync(Track_VM Model);
        public Task<int> UpdateCreditsOfTrackAsync(TrackCredits_VM Model);
        public Task<int> SubmitUploadedTrackAsync(int Id, int UserId);
        public Task<int> MuteTrackAsync(int Id, int UserId, int Duration = 0);
        public Task<int> UnmuteTrackAsync(int Id, int UserId);
        public Task<int> DisableTrackAsync(int Id, int UserId);
        public Task<int> DeleteTrackAsync(int Id, int UserId);
    }
}
