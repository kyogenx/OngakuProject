using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.Interfaces
{
    public interface ITrack
    {
        public Task<bool> CheckTrackOwnership(int Id, int UserId);

        public Task<int> AddToFavoritesAsync(Favorites_VM Model);
        public Task<int> RemoveFromFavoritesAsync(int Id, int UserId);

        public Task<int> UploadTrackAsync(Track_VM Model);
        public Task<int> UpdateGenresAsync(TrackGenre_VM Model);
        public Task<int> UpdateFeaturingArtistsAsync(TrackArtist_VM Model);
        public Task<string?> UpdateCoverImageAsync(TrackURL_VM Model);
        public Task<int> UpdateTrackAsync(Track_VM Model);
        public Task<int> UpdateCreditsAsync(TrackCredits_VM Model);
        public Task<int> UpdateLyricsAsync(Lyrics_VM Model);
        public Task<int> DeleteLyricsAsync(int Id, int UserId);
        public Task<int> UpdateStatusAsync(int Id, int UserId, int Status);
        public Task<int> SubmitUploadedTrackAsync(int Id, int UserId);
        public Task<int> MuteTrackAsync(int Id, int UserId, int Duration = 0);
        public Task<int> UnmuteTrackAsync(int Id, int UserId);
        public Task<int> DisableTrackAsync(int Id, int UserId);
        public Task<int> DeleteTrackAsync(int Id, int UserId);
        public Task<string?> GetTrackAudioUrlAsync(int Id);
        public Task<Track?> LoadTheTrackAsync(int Id, int PlaylistId, int UserId = 0);
        public Task<Track?> GetTrackInfoAsync(int Id, int UserId = 0, bool IsForAuthor = false);
        public Task<TrackCredit?> GetCreditsAsync(int Id);
        public IQueryable<Track>? GetStudioItems(int Id, bool IsForAuthor = false);
        public ValidationResult? CreditValidation(string? Value, ValidationContext Context);
    }
}
