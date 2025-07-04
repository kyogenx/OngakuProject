using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface ILyric
    {
        public Task<int> AddrLyricsAsync(Lyrics_VM Model);
        public Task<int> EditLyricsAsync(Lyrics_VM Model);
        public Task<int> DeleteLyricsAsync(int Id, int TrackId, int UserId);
        public Task<bool> CheckLyricsAvailabilityAsync(int Id, bool CheckViaTrackId);
        public Task<string?> AddLyricSyncAsync(LyricSync_VM Model);
        public Task<string?> EditLyricSyncAsync(LyricSync_VM Model);
        public Task<string?> DeleteLyricSyncAsync(string? Id, int UserId, int TrackId);
        public Task<Lyrics?> GetLyricsAsync(int Id);
        public Task<TrackRaven?> GetSyncedLyricsAsync(string? Id);
    }
}
