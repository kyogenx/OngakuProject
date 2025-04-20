using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class PlaylistRep : IPlaylist
    {
        private readonly Context _context;
        public PlaylistRep(Context context)
        {
            _context = context;
        }

        public async Task<int> AddToFavoritesAsync(Favorites_VM Model)
        {    
            int WasTheTrackAddedBefore = await _context.Favorites.AsNoTracking().Where(t => t.UserId == Model.UserId && t.TrackId == Model.TrackId && !t.IsDeleted).Select(t => t.Id).FirstOrDefaultAsync();
            if (WasTheTrackAddedBefore > 0)
            {
                int Result = await _context.Favorites.AsNoTracking().Where(t => t.Id == WasTheTrackAddedBefore).ExecuteUpdateAsync(t => t.SetProperty(t => t.IsDeleted, false).SetProperty(t => t.Order, 0).SetProperty(t => t.AddedAt, DateTime.Now));
                if (Result > 0) return WasTheTrackAddedBefore;
            }
            else
            {
                Favorite favoriteSample = new Favorite
                {
                    AddedAt = DateTime.Now,
                    TrackId = Model.TrackId,
                    UserId = Model.UserId,
                    Order = 0
                };
                await _context.AddAsync(favoriteSample);
                await _context.SaveChangesAsync();

                return Model.TrackId;
            }
            return 0;
        }

        public async Task<int> RemoveFromFavoritesAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Favorites.Where(f => f.TrackId == Id && f.UserId == UserId && !f.IsDeleted).ExecuteUpdateAsync(f => f.SetProperty(f => f.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> GetFavoriteSongsQuantityAsync(int Id)
        {
            if (Id > 0) return await _context.Favorites.AsNoTracking().CountAsync(f => f.UserId == Id && !f.IsDeleted);
            else return 0;
        }

        public async Task<bool> IsFavoritedAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                bool Result = await _context.Favorites.AsNoTracking().AnyAsync(f => f.TrackId == Id && f.UserId == UserId && !f.IsDeleted);
                return Result;
            }
            else return false;
        }

        public IQueryable<Favorite>? GetFavorites(int Id, int Skip = 0, int Take = 30)
        {
            if (Id > 0) return _context.Favorites.AsNoTracking().Where(f => f.UserId == Id && !f.IsDeleted).OrderByDescending(f => f.AddedAt).Select(f => new Favorite { Id = f.Id, Track = f.Track != null ? new Track { Id = f.Track.Id, HasExplicit = f.Track.HasExplicit, Title = f.Track.Title, CoverImageUrl = f.Track.CoverImageUrl, UserId = f.Track.UserId, MainArtistName = f.Track.User!.Nickname, TrackArtists = f.Track.TrackArtists != null ? f.Track.TrackArtists.Select(ta => new TrackArtist { ArtistId = ta.ArtistId, ArtistName = ta.User!.Nickname }).ToList() : null } : null }).Skip(Skip).Take(Take);
            else return null;
        }

        public async Task<Playlist?> GetPlaylistInfoAsync(int Id)
        {
            if (Id > 0) return await _context.Playlists.AsNoTracking().Where(p => p.Id == Id && !p.IsDeleted).Select(p => new Playlist { Id = p.Id, Name = p.Name, CreatedAt = p.CreatedAt, Description = p.Description, PrivacyStatus = p.PrivacyStatus, Shortname = p.Shortname, SongsQty = p.TrackPlaylists != null ? p.TrackPlaylists.Count : 0 }).FirstOrDefaultAsync();
            else return null;
        }

        public IQueryable<Track?>? GetPlaylistTracks(int Id, int Skip = 0, int Take = 30)
        {
            if (Id > 0) return _context.TrackPlaylists.AsNoTracking().Where(tp => tp.PlaylistId == Id && !tp.IsDeleted).Select(tp => tp.Track != null ? new Track { Id = tp.TrackId, Title = tp.Track.Title, User = tp.Track.User != null ? new User { Nickname = tp.Track.User.Nickname } : null, HasExplicit = tp.Track.HasExplicit, TrackArtists = tp.Track.TrackArtists != null ? tp.Track.TrackArtists.Select(ta => new TrackArtist { ArtistId = ta.User!.Id, ArtistName = ta.User.Nickname }).ToList() : null } : null);
            else return null;
        }

        public IQueryable<UserPlaylist>? GetPlaylists(int Id)
        {
            if (Id > 0)
            {
                return _context.UserPlaylists.AsNoTracking().Where(p => p.UserId == Id && !p.IsDeleted).OrderByDescending(p => p.PinOrder).Select(p => new UserPlaylist { Id = p.Id, PlaylistId = p.PlaylistId, AlbumId = p.AlbumId, Playlist = p.Playlist != null ? new Playlist { Name = p.Playlist.Name, ImageUrl = p.Playlist.ImageUrl, SongsQty = p.Playlist.TrackPlaylists != null ? p.Playlist.TrackPlaylists.Count : 0 } : new Playlist { Name = p.Album!.Title, ImageUrl = p.Album.CoverImageUrl, SongsQty= p.Album.Tracks != null ? p.Album.Tracks.Count : 0 } });
                //return _context.Playlists.AsNoTracking().Where(p => p.UserId == Id && !p.IsDeleted).OrderByDescending(p => p.CreatedAt).Select(p => new Playlist { Id = p.Id, Name = p.Name, ImageUrl = p.ImageUrl, SongsQty = p.TrackPlaylists != null ? p.TrackPlaylists.Count : 0 });
            }
            else return null;
        }

        public async Task<bool> IsPlaylistSavedAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.UserPlaylists.AsNoTracking().AnyAsync(up => up.UserId == UserId && up.PlaylistId == Id && !up.IsDeleted);
            return false;
        }
    }
}
