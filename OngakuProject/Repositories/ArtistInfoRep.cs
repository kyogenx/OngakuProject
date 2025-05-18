using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Repositories
{
    public class ArtistInfoRep : IArtistInfo
    {
        private readonly Context _context;
        private readonly ITrack _track;
        public ArtistInfoRep(Context context, ITrack track)
        {
            _context = context;
            _track = track;
        }

        public async Task<User?> GetArtistPageInfoAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id && u.IsVisible).Select(u => new User { Id = Id, Nickname = u.Nickname, Searchname = u.Searchname, MonthlyListeners = u.UserListeners != null ? u.UserListeners.Count(u => u.IsActive) : 0, ImgUrl = u.UserImages != null ? u.UserImages.Select(u=>u.ImgUrl).FirstOrDefault() : null, LastSeenAt = u.LastSeenAt, WhoCanChat = u.WhoCanChat, WhoCanDownload = u.WhoCanDownload, WhoCanSeeLastSeenInfo = u.WhoCanSeeLastSeenInfo }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<Track?> GetLatestReleaseAsync(int Id, int RecepientUserId = 0)
        {
            if (Id > 0) {
                if (RecepientUserId > 0) return await _context.Tracks.AsNoTracking().Where(t => t.UserId == Id && !t.IsDeleted).OrderByDescending(t => t.AddedAt).Select(t => new Track { Id = t.Id, AddedAt = t.AddedAt, Title = t.Title, HasExplicit = t.HasExplicit, CoverImageUrl = t.CoverImageUrl, TrackArtists = t.TrackArtists != null ? t.TrackArtists.Select(ta => new TrackArtist { ArtistName = ta.User != null ? ta.User.Nickname : null, ArtistId = ta.ArtistId }).ToList() : null, IsFavorite = t.Favorite != null ? t.Favorite.Any(t => t.UserId == RecepientUserId && !t.IsDeleted) : false }).FirstOrDefaultAsync();
                else return await _context.Tracks.AsNoTracking().Where(t => t.UserId == Id && !t.IsDeleted).OrderByDescending(t => t.AddedAt).Select(t => new Track { Id = t.Id, AddedAt = t.AddedAt, Title = t.Title, HasExplicit = t.HasExplicit, CoverImageUrl = t.CoverImageUrl, TrackArtists = t.TrackArtists != null ? t.TrackArtists.Select(ta => new TrackArtist { ArtistName = ta.User != null ? ta.User.Nickname : null, ArtistId = ta.ArtistId }).ToList() : null }).FirstOrDefaultAsync();
            }
            else return null;
        }

        public IQueryable<Track>? GetMostPopularTracks(int Id, int RecepientUserId = 0, int Qty = 8)
        {
            if (Id > 0)
            {
                if (RecepientUserId > 0) return _context.Tracks.AsNoTracking().Where(t => t.UserId == Id && !t.IsDeleted).Select(t => new Track { Id = t.Id, Title = t.Title, CoverImageUrl = t.CoverImageUrl, IsFavorite = t.Favorite != null ? t.Favorite.Any(t => t.UserId == RecepientUserId && !t.IsDeleted) : false, HasExplicit = t.HasExplicit, StreamsQty = t.TrackHistory != null ? t.TrackHistory.Count : 0 }).Take(Qty);
                else return _context.Tracks.AsNoTracking().Where(t => t.UserId == Id && !t.IsDeleted).Select(t => new Track { Id = t.Id, Title = t.Title, CoverImageUrl = t.CoverImageUrl, HasExplicit = t.HasExplicit, StreamsQty = t.TrackHistory != null ? t.TrackHistory.Count : 0 }).Take(Qty);
            }
            else return null;
        }
    }
}
