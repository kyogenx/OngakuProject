using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.Security.Cryptography.X509Certificates;

namespace OngakuProject.Repositories
{
    public class PlaylistRep : IPlaylist
    {
        private readonly Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public PlaylistRep(Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
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

        public async Task<Playlist?> GetPlaylistEditInfoAsync(int Id)
        {
            if (Id > 0) return await _context.Playlists.AsNoTracking().Where(p => p.Id == Id && !p.IsDeleted).Select(p => new Playlist { Id = Id, Name = p.Name, Description = p.Description, PrivacyStatus = p.PrivacyStatus }).FirstOrDefaultAsync();
            else return null;
        }

        public IQueryable<Track?>? GetPlaylistTracks(int Id, int UserId = 0, int Skip = 0, int Take = 30)
        {
            if (Id > 0)
            {
                if(UserId > 0) return _context.TrackPlaylists.AsNoTracking().Where(tp => tp.PlaylistId == Id && !tp.IsDeleted).Select(tp => tp.Track != null ? new Track { Id = tp.TrackId, IsFavorite = tp.Track.Favorite != null ? tp.Track.Favorite.Any(f=>f.UserId == UserId && !f.IsDeleted) : false, CoverImageUrl = tp.Track.CoverImageUrl, Title = tp.Track.Title, UserId = tp.Track.UserId, MainArtistName = tp.Track.User != null ? tp.Track.User.Nickname : null, HasExplicit = tp.Track.HasExplicit, TrackArtists = tp.Track.TrackArtists != null ? tp.Track.TrackArtists.Select(ta => new TrackArtist { ArtistId = ta.User!.Id, ArtistName = ta.User.Nickname }).ToList() : null } : null);
                else return _context.TrackPlaylists.AsNoTracking().Where(tp => tp.PlaylistId == Id && !tp.IsDeleted).Select(tp => tp.Track != null ? new Track { Id = tp.TrackId, CoverImageUrl = tp.Track.CoverImageUrl, Title = tp.Track.Title, UserId = tp.Track.UserId, MainArtistName = tp.Track.User != null ? tp.Track.User.Nickname : null, HasExplicit = tp.Track.HasExplicit, TrackArtists = tp.Track.TrackArtists != null ? tp.Track.TrackArtists.Select(ta => new TrackArtist { ArtistId = ta.User!.Id, ArtistName = ta.User.Nickname }).ToList() : null } : null);
            }
            else return null;
        }

        public IQueryable<UserPlaylist>? GetPlaylists(int Id, bool IsForEditing = false)
        {
            if (Id > 0)
            {
                if (!IsForEditing) return _context.UserPlaylists.AsNoTracking().Where(p => p.UserId == Id && !p.IsDeleted).OrderByDescending(p => p.PinOrder).Select(p => new UserPlaylist { Id = p.Id, PinOrder = p.PinOrder, PlaylistId = p.PlaylistId, AlbumId = p.AlbumId, Playlist = p.Playlist != null ? new Playlist { Name = p.Playlist.Name, ImageUrl = p.Playlist.ImageUrl, SongsQty = p.Playlist.TrackPlaylists != null ? p.Playlist.TrackPlaylists.Count : 0 } : new Playlist { Name = p.Album!.Title, ImageUrl = p.Album.CoverImageUrl, SongsQty = p.Album.Tracks != null ? p.Album.Tracks.Count : 0 } });
                else return _context.UserPlaylists.AsNoTracking().Where(p => p.UserId == Id && !p.IsDeleted).OrderByDescending(p => p.PinOrder).Select(p => new UserPlaylist { Id = p.Id, Playlist = p.Playlist != null ? new Playlist { ImageUrl = p.Playlist.ImageUrl, Name = p.Playlist.Name } : null, PlaylistId = p.PlaylistId });
            }
            else return null;
        }

        public async Task<bool> IsPlaylistSavedAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.UserPlaylists.AsNoTracking().AnyAsync(up => up.UserId == UserId && up.PlaylistId == Id && !up.IsDeleted);
            return false;
        }

        public async Task<int> AddAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                bool CheckPlaylistAvailability = await _context.UserPlaylists.AsNoTracking().AnyAsync(p => p.PlaylistId == Id && p.UserId == UserId && !p.IsDeleted);
                if (CheckPlaylistAvailability) return 0;
                else
                {
                    UserPlaylist userPlaylistSample = new UserPlaylist
                    {
                        PlaylistId = Id,
                        UserId = UserId,
                        SavedAt = DateTime.Now,
                        PinOrder = 0
                    };
                    await _context.AddAsync(userPlaylistSample);
                    await _context.SaveChangesAsync();

                    return userPlaylistSample.Id;
                }
            }
            return 0;
        }

        public async Task<int> RemoveAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.UserPlaylists.AsNoTracking().Where(p => p.PlaylistId == Id && p.UserId == UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<Playlist?> CreateAsync(Playlist_VM Model)
        {
            if (!String.IsNullOrWhiteSpace(Model.Title))
            {
                string? FileRandName = null;
                if (Model.ImageUrl is not null)
                {
                    FileRandName = string.Concat(Guid.NewGuid().ToString("N").AsSpan(2, 8), Path.GetExtension(Model.ImageUrl.FileName));
                    using (FileStream fs = new FileStream(_webHostEnvironment.WebRootPath + "/PlaylistCovers/" + FileRandName, FileMode.Create))
                    {
                        await Model.ImageUrl.CopyToAsync(fs);
                    }

                }

                Playlist playlistSample = new Playlist()
                {
                    Name = Model.Title,
                    UserId = Model.UserId,
                    ImageUrl = FileRandName,
                    CreatedAt = DateTime.Now,
                    Description = Model.Description,
                    PrivacyStatus = Model.PrivacyStatus
                };
                await _context.Playlists.AddAsync(playlistSample);
                await _context.SaveChangesAsync();
                int Result = await AddAsync(playlistSample.Id, Model.UserId);
                playlistSample.TrueId = playlistSample.Id;
                playlistSample.Id = Result;

                return playlistSample;
            }
            else return null;
        }

        public async Task<string?> EditShortnameAsync(int Id, int UserId, string? Shortname)
        {
            if(Id > 0 && UserId > 0 && !String.IsNullOrWhiteSpace(Shortname) && Shortname.Length <= 15)
            {
                bool CheckAvailability = await CheckPlaylistShortnameAsync(Id, Shortname);
                if(!CheckAvailability)
                {
                    int Result = await _context.Playlists.AsNoTracking().Where(s => s.Id == Id && s.UserId == UserId).ExecuteUpdateAsync(s => s.SetProperty(s => s.Shortname, Shortname));
                    if (Result > 0) return Shortname;
                }
            }
            return null;
        }

        public async Task<int> EditAsync(Playlist_VM Model)
        {
            if (Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Title))
            {
                int Result = await _context.Playlists.AsNoTracking().Where(p => p.Id == Model.Id && p.UserId == Model.UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.Name, Model.Title).SetProperty(t => t.Description, Model.Description).SetProperty(p => p.PrivacyStatus, Model.PrivacyStatus));
                if (Result > 0) return Model.Id;
            }
            return 0;
        }

        public async Task<string?> EditImageAsync(int Id, int UserId, IFormFile? FileUrl)
        {
            if(Id > 0 && UserId > 0)
            {
                if(FileUrl != null)
                {
                    int Result = 0;
                    string? CurrentFileName = await _context.Playlists.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted).Select(p => p.ImageUrl).FirstOrDefaultAsync();
                    if(CurrentFileName is not null)
                    {
                        if (File.Exists(_webHostEnvironment.WebRootPath + "/PlaylistCovers/" + CurrentFileName))
                        {
                            File.Delete(_webHostEnvironment.WebRootPath + "/PlaylistCovers/" + CurrentFileName);
                            Result = 1;
                        }
                        else Result = 1;
                    }
                    else
                    {
                        CurrentFileName = string.Concat(Guid.NewGuid().ToString("N").AsSpan(2, 8), Path.GetExtension(FileUrl.FileName));
                        Result = await _context.Playlists.AsNoTracking().Where(p => p.Id == Id).ExecuteUpdateAsync(p => p.SetProperty(p => p.ImageUrl, CurrentFileName));
                    }

                    if(Result > 0)
                    {
                        using (FileStream fs = new FileStream(_webHostEnvironment.WebRootPath + "/PlaylistCovers/" + CurrentFileName, FileMode.Create))
                        {
                            await FileUrl.CopyToAsync(fs);
                            return CurrentFileName;
                        }
                    }
                }
            }
            return null;
        }

        public async Task<int> DeleteAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Playlists.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> PinAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.UserPlaylists.AsNoTracking().Where(up => up.Id == Id && up.UserId == UserId).ExecuteUpdateAsync(up => up.SetProperty(up => up.PinOrder, 1));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> UnpinAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.UserPlaylists.AsNoTracking().Where(up => up.Id == Id && up.UserId == UserId).ExecuteUpdateAsync(up => up.SetProperty(up => up.PinOrder, 0));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> AddTrackToPlaylistAsync(int Id, int PlaylistId, int UserId)
        {
            if(Id > 0 && PlaylistId > 0 && UserId > 0)
            {
                bool CheckPlaylistAndTrackAvailability = await _context.Playlists.AsNoTracking().AnyAsync(p => p.Id == PlaylistId && p.UserId == UserId && !p.IsDeleted);
                if(CheckPlaylistAndTrackAvailability)
                {
                    CheckPlaylistAndTrackAvailability = await _context.TrackPlaylists.AsNoTracking().AnyAsync(tp => tp.TrackId == Id && tp.PlaylistId == PlaylistId && !tp.IsDeleted);
                    if(!CheckPlaylistAndTrackAvailability)
                    {
                        TrackPlaylist trackPlaylistSample = new TrackPlaylist
                        {
                            TrackId = Id,
                            PlaylistId = PlaylistId,
                            AddedAt = DateTime.Now,
                        };
                        await _context.AddAsync(trackPlaylistSample);
                        await _context.SaveChangesAsync();

                        return trackPlaylistSample.TrackId;
                    }
                }
            }
            return 0;
        }

        public async Task<int> RemoveTrackFromPlaylistAsync(int Id, int PlaylistId, int UserId)
        {
            if(Id > 0 && PlaylistId > 0 && UserId > 0)
            {
                bool CheckPlaylistsAvailability = await _context.Playlists.AsNoTracking().AnyAsync(p => p.Id == PlaylistId && p.UserId == UserId && !p.IsDeleted);
                if(CheckPlaylistsAvailability)
                {
                    int Result = await _context.TrackPlaylists.AsNoTracking().Where(tp => tp.TrackId == Id && tp.PlaylistId == PlaylistId && !tp.IsDeleted).ExecuteUpdateAsync(tp => tp.SetProperty(tp => tp.IsDeleted, true));
                    if (Result > 0) return Id;
                }
            }
            return 0;
        }

        public async Task<bool> CheckPlaylistShortnameAsync(int Id, string? Shortname)
        {
            if (Shortname is not null)
            {
                if (Id > 0) return await _context.Playlists.AsNoTracking().AnyAsync(p => !p.IsDeleted && p.Id != Id && p.Shortname != null && p.Shortname.ToLower() == Shortname.ToLower());
                else return await _context.Playlists.AsNoTracking().AnyAsync(p => !p.IsDeleted && p.Shortname != null && p.Shortname.ToLower() == Shortname.ToLower());
            }
            else return false;
        }

        public async Task<Playlist?> GetPlaylistInfoAsync(int Id, bool IsForAuthor = true)
        {
            if (Id > 0)
            {
                if (IsForAuthor) return await _context.Playlists.AsNoTracking().Where(p => p.Id == Id && !p.IsDeleted).Select(p => new Playlist { Id = p.Id, Name = p.Name, CreatedAt = p.CreatedAt, Description = p.Description, PrivacyStatus = p.PrivacyStatus, Shortname = p.Shortname, SongsQty = p.TrackPlaylists != null ? p.TrackPlaylists.Count : 0 }).FirstOrDefaultAsync();
                else return await _context.Playlists.AsNoTracking().Where(p => p.Id == Id && !p.IsDeleted && p.PrivacyStatus > 0).Select(p => new Playlist { Id = p.Id, Name = p.Name, CreatedAt = p.CreatedAt, Description = p.Description, Shortname = p.Shortname, UserId = p.UserId, User = p.User != null ? new User { ImgUrl = p.User.UserImages != null ? p.User.UserImages.Select(i=>i.ImgUrl).FirstOrDefault() : null, Nickname = p.User.Nickname } : null }).FirstOrDefaultAsync();
            }
            else return null;
        }

        public async Task<Playlist?> GetPlaylistInfoAsync(string? Shortname, bool IsForAuthor = true)
        {
            if (!String.IsNullOrWhiteSpace(Shortname))
            {
                if(IsForAuthor) return await _context.Playlists.AsNoTracking().Where(p => !p.IsDeleted && p.Shortname != null && p.Shortname.ToLower() == Shortname.ToLower()).Select(p => new Playlist { Id = p.Id, Name = p.Name, CreatedAt = p.CreatedAt, Description = p.Description, PrivacyStatus = p.PrivacyStatus, Shortname = p.Shortname, SongsQty = p.TrackPlaylists != null ? p.TrackPlaylists.Count : 0 }).FirstOrDefaultAsync();
                else return await _context.Playlists.AsNoTracking().Where(p => p.Shortname != null && p.Shortname.ToLower() == Shortname.ToLower() && !p.IsDeleted && p.PrivacyStatus > 0).Select(p => new Playlist { Id = p.Id, Name = p.Name, CreatedAt = p.CreatedAt, Description = p.Description, Shortname = p.Shortname, SongsQty = p.TrackPlaylists != null ? p.TrackPlaylists.Count : 0 }).FirstOrDefaultAsync();
            }
            else return null;
        }

        public async Task<string?> GetPlaylistShortnameAsync(int Id)
        {
            if (Id > 0) return await _context.Playlists.AsNoTracking().Where(p => p.Id == Id && !p.IsDeleted).Select(p => p.Shortname).FirstOrDefaultAsync();
            else return null;
        }
    }
}
