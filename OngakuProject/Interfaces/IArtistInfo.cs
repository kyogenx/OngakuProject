using OngakuProject.Models;

namespace OngakuProject.Interfaces
{
    public interface IArtistInfo
    {
        public Task<User?> GetArtistPageInfoAsync(int Id);
        public IQueryable<Track>? GetMostPopularTracks(int Id, int RecepientUserId = 0, int Qty = 8);
        public Task<Track?> GetLatestReleaseAsync(int Id, int RecepientUserId = 0);
    }
}
