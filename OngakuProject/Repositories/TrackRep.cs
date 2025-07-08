using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Tiff.Constants;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.Repositories
{
    public class TrackRep : BaseRep<Track>, ITrack
    {
        private readonly Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public TrackRep(Context context, IWebHostEnvironment webHostEnvironment) : base(context)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<bool> CheckTrackOwnership(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted);
            else return false;
        }

        public Task<int> DeleteTrackAsync(int Id, int UserId)
        {
            throw new NotImplementedException();
        }

        public async Task<int> DisableTrackAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted).ExecuteUpdateAsync(t => t.SetProperty(t => t.Status, 2));
                if (Result > 0) return 2;
            }
            return 0;
        }

        public async Task<int> MuteTrackAsync(int Id, int UserId, int Duration = 0)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted).ExecuteUpdateAsync(t => t.SetProperty(t => t.Status, 0));
                if (Result > 0) return -1;
            }
            return 0;
        }

        public async Task<int> SubmitUploadedTrackAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted).ExecuteUpdateAsync(t => t.SetProperty(t => t.Status, 3).SetProperty(t => t.LastUpdatedAt, DateTime.Now));
                if (Result > 0) return 3;
            }
            return 0;
        }

        public async Task<int> UnmuteTrackAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted).ExecuteUpdateAsync(t => t.SetProperty(t => t.Status, 3));
                if (Result > 0) return 3;
            }
            return 0;
        }

        public async Task<int> UpdateCreditsAsync(TrackCredits_VM Model)
        {
            if (Model.Id > 0 && Model.MainVocalist != null)
            {
                string[]?[] Strings = [Model.Producer ?? null, Model.Composer ?? null, Model.Arranger ?? null, Model.Lyricist ?? null, Model.MainVocalist ?? null, Model.FeaturedArtists ?? null, Model.MixingEngineer ?? null, Model.MasteringEngineer ?? null, Model.RecordingEngineer ?? null, Model.SoundDesigner ?? null, Model.Instrumentalist ?? null];
                if (Strings != null)
                {
                    TrackCredit? trackCreditSample = new TrackCredit();
                    for (int i = 0; i < Strings.Length; i++)
                    {
                        string? TempValue = "";
                        if (Strings[i] is not null)
                        {
                            for (int j = 0; j < Strings[i]?.Length; j++)
                            {
                                if (j == 0) TempValue = Strings[i]?[j];
                                else TempValue += ", " + Strings[i]?[j];
                            }
                        }

                        if (!String.IsNullOrWhiteSpace(TempValue))
                        {
                            switch (i)
                            {
                                case 0:
                                    trackCreditSample.MainVocalist = TempValue;
                                    break;
                                case 1:
                                    trackCreditSample.Composer = TempValue;
                                    break;
                                case 2:
                                    trackCreditSample.Lyricist = TempValue;
                                    break;
                                case 3:
                                    trackCreditSample.Producer = TempValue;
                                    break;
                                case 4:
                                    trackCreditSample.Arranger = TempValue;
                                    break;
                                case 5:
                                    trackCreditSample.FeaturedArtists = TempValue;
                                    break;
                                case 6:
                                    trackCreditSample.Instrumentalist = TempValue;
                                    break;
                                case 7:
                                    trackCreditSample.MixingEngineer = TempValue;
                                    break;
                                case 8:
                                    trackCreditSample.MasteringEngineer = TempValue;
                                    break;
                                case 9:
                                    trackCreditSample.RecordingEngineer = TempValue;
                                    break;
                                case 10:
                                    trackCreditSample.SoundDesigner = TempValue;
                                    break;
                                default:
                                    trackCreditSample.MainVocalist = TempValue;
                                    break;
                            }
                        }
                    }
                    if (trackCreditSample is not null)
                    {
                        bool CheckCreditsAvailability = await _context.TrackCredits.AsNoTracking().AnyAsync(t => t.TrackId == Model.Id && t.MainArtistId == Model.MainArtistId);
                        if (CheckCreditsAvailability)
                        {
                            int Result = await _context.TrackCredits.AsNoTracking().Where(t => t.TrackId == Model.Id && t.MainArtistId == Model.MainArtistId).ExecuteUpdateAsync(t => t.SetProperty(t => t.Producer, trackCreditSample.Producer).SetProperty(t => t.Composer, trackCreditSample.Composer).SetProperty(t => t.Arranger, trackCreditSample.Arranger).SetProperty(t => t.Lyricist, trackCreditSample.Arranger).SetProperty(t => t.MainVocalist, trackCreditSample.MainVocalist).SetProperty(t => t.FeaturedArtists, trackCreditSample.FeaturedArtists).SetProperty(t => t.MixingEngineer, trackCreditSample.MixingEngineer).SetProperty(t => t.MasteringEngineer, trackCreditSample.MasteringEngineer).SetProperty(t => t.RecordingEngineer, trackCreditSample.RecordingEngineer).SetProperty(t => t.SoundDesigner, trackCreditSample.SoundDesigner).SetProperty(t => t.Instrumentalist, trackCreditSample.Instrumentalist));
                            if (Result > 0) return Model.Id;
                        }
                        else
                        {
                            trackCreditSample.TrackId = Model.Id;
                            trackCreditSample.MainArtistId = Model.MainArtistId;
                            await _context.AddAsync(trackCreditSample);
                            await _context.SaveChangesAsync();

                            return Model.Id;
                        }
                    }
                }
            }
            return 0;
        }

        public ValidationResult? CreditValidation(string? ValueName, ValidationContext Context)
        {
            if (!String.IsNullOrWhiteSpace(ValueName))
            {
                List<string?>? NonValids = new List<string?>() { ",", "&", ";", ":", "/", "and", "|", "feat.", "or" };
                if (NonValids.Any(v => v != null && ValueName.ToLower().Contains(v.ToLower()))) return new ValidationResult("\"Please enter only one person per field. Use a separate field for each person");
                else return ValidationResult.Success;
            }
            else return new ValidationResult("Please, enter at least one person to store him as a valid member");
        }

        public async Task<int> UpdateTrackAsync(Track_VM Model)
        {
            throw new NotImplementedException();
        }

        public async Task<int> UpdateStatusAsync(int Id, int UserId, int Status)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = 0;
                switch(Status)
                {
                    case 0:
                        Result = await UnmuteTrackAsync(Id, UserId);
                        break;
                    case 1:
                        Result = await SubmitUploadedTrackAsync(Id, UserId);
                        break;
                    case 3:
                        Result = await MuteTrackAsync(Id, UserId);
                        break;
                    default:
                        Result = await UnmuteTrackAsync(Id, UserId);
                        break;
                }
                if (Result > 0) return Result;
            }
            return 0;
        }

        public async Task<int> UploadTrackAsync(Track_VM Model)
        {
            if (!String.IsNullOrWhiteSpace(Model.Title) && Model.Genres is not null)
            {
                string? StrTrackFileUrl = null;
                string? StrThumbnailUrl = null;
                string? StrCoverImageUrl = null;
                int GenresQty = Model.Genres.Count > 3 ? 3 : Model.Genres.Count;
                if (Model.TrackFileUrl != null)
                {
                    StrTrackFileUrl = Guid.NewGuid().ToString("D").Substring(0, 8) + Path.GetExtension(Model.TrackFileUrl.FileName);
                    using (FileStream fs = new FileStream(_webHostEnvironment.WebRootPath + "/Tracks/" + StrTrackFileUrl, FileMode.Create))
                    {
                        await Model.TrackFileUrl.CopyToAsync(fs);
                    }
                }
                if(Model.CoverImageUrl != null)
                {
                    StrThumbnailUrl = Guid.NewGuid().ToString("D").Substring(6, 9) + Path.GetExtension(Model.CoverImageUrl.FileName);
                    StrCoverImageUrl = Guid.NewGuid().ToString("D").Substring(4, 9) + Path.GetExtension(Model.CoverImageUrl.FileName);
                    using(FileStream fs = new FileStream(_webHostEnvironment.WebRootPath + "/TrackCovers/" + StrCoverImageUrl,  FileMode.Create))
                    {
                        await Model.CoverImageUrl.CopyToAsync(fs);
                    }
                }

                Model.ReleasedAtDt = Model.ReleaseDateYear > 0 ? new DateTime(Model.ReleaseDateYear, Model.ReleaseDateMonth, Model.ReleaseDateDay) : DateTime.Now;
                Track trackSample = new Track()
                {
                    Status = 1,
                    Title = Model.Title,
                    LastUpdatedAt = null,
                    UserId = Model.UserId,
                    AddedAt = DateTime.Now,
                    TrackFileUrl = StrTrackFileUrl,
                    HasExplicit = Model.HasExplicit,
                    ThumbnailUrl = StrThumbnailUrl,
                    ReleasedAt = Model.ReleasedAtDt,
                    CoverImageUrl = StrCoverImageUrl
                };

                await _context.AddAsync(trackSample);
                await _context.SaveChangesAsync();

                return trackSample.Id;
            }
            return 0;
        }

        public async Task<string?> UpdateCoverImageAsync(TrackURL_VM Model)
        {
            if (Model.CoverImageUrl != null)
            {
                string? CurrentImgUrl = await _context.Tracks.AsNoTracking().Where(t => t.Id == Model.Id && !t.IsDeleted).Select(t => t.CoverImageUrl).FirstOrDefaultAsync();
                if(CurrentImgUrl != null)
                {
                    if(File.Exists(_webHostEnvironment.WebRootPath + "/TrackCovers/" + CurrentImgUrl)) File.Delete(_webHostEnvironment.WebRootPath + "/TrackCovers/" + CurrentImgUrl);
                    using (FileStream fs=new FileStream(_webHostEnvironment.WebRootPath + "/TrackCovers/" + CurrentImgUrl, FileMode.Create))
                    {
                        await Model.CoverImageUrl.CopyToAsync(fs);
                    }
                    return CurrentImgUrl;
                }   
            }
            return null;
        }

        public async Task<int> UpdateGenresAsync(TrackGenre_VM Model)
        {
            if(Model.Id > 0 && Model.Genres is not null)
            {
                List<int>? CheckedGenreIds = new List<int>();
                for (int i = 0; i < Model.Genres.Count; i++)
                {
                    for (int j = 0; j < Model.Genres.Count; j++)
                    {
                        if ((Model.Genres[i] == Model.Genres[j]) && (i != j)) continue;
                        else
                        {
                            CheckedGenreIds.Add(Model.Genres[i]);
                            break;
                        }
                    }
                }
                Genre? TempGenre = null;
                List<Genre>? NecessaryGenres = new List<Genre>();
                for(int i = 0; i < CheckedGenreIds.Count; i++)
                {
                    TempGenre = await _context.Genres.FirstOrDefaultAsync(g => g.Id == CheckedGenreIds[i]);
                    if (TempGenre is not null) NecessaryGenres.Add(TempGenre);
                }
                if (NecessaryGenres.Any())
                {
                    Track? TrackInfo = await _context.Tracks.Include(g => g.Genres).FirstOrDefaultAsync(t=>t.Id == Model.Id && !t.IsDeleted);
                    if(TrackInfo is not null)
                    {
                        TrackInfo.Genres?.AddRange(NecessaryGenres);
                        await _context.SaveChangesAsync();
                        return Model.Id;
                    }
                }
            }
            return 0;
        }

        public async Task<int> UpdateFeaturingArtistsAsync(TrackArtist_VM Model)
        {
            if(Model.Id > 0 && Model.FeaturingArtists is not null)
            {
                List<TrackArtist>? trackArtists = new List<TrackArtist>();
                foreach(int Artist in Model.FeaturingArtists)
                {
                    TrackArtist trackArtistSample = new TrackArtist()
                    {
                        ArtistId = Artist,
                        TrackId = Model.Id
                    };
                    trackArtists.Add(trackArtistSample);
                }
                await _context.AddRangeAsync(trackArtists);
                await _context.SaveChangesAsync();

                return Model.Id;
            }
            return 0;
        }

        public async Task<Track?> GetTrackInfoAsync(int Id, int UserId = 0, bool IsForAuthor = false)
        {
            if(Id > 0)
            {
                if (IsForAuthor) return await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).OrderByDescending(t => t.ReleasedAt).Select(t => new Track { HasExplicit = t.HasExplicit, TrackFileUrl = t.TrackFileUrl, Id = Id, Title = t.Title, ReleasedAt = t.ReleasedAt, Status = t.Status, CoverImageUrl = t.CoverImageUrl, Genres = t.Genres != null ? t.Genres.Select(g => new Genre { Id = g.Id, Name = g.Name }).ToList() : null, TrackArtists = t.TrackArtists != null ? t.TrackArtists.Select(tr => new TrackArtist { Id = tr.Id, ArtistName = tr.User != null ? tr.User.Nickname : null }).ToList() : null, AddedAt = t.AddedAt, IsFavorite = t.Favorite != null ? t.Favorite.Any(f => f.UserId == UserId && !f.IsDeleted) : false }).FirstOrDefaultAsync();
                else return await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).OrderByDescending(t => t.ReleasedAt).Select(t => new Track { HasExplicit = t.HasExplicit, TrackFileUrl = t.TrackFileUrl, Id = Id, Title = t.Title, ReleasedAt = t.ReleasedAt, CoverImageUrl = t.CoverImageUrl, UserId = t.UserId, User = t.User != null ? new User { Nickname = t.User.Nickname } : null, Genres = t.Genres != null ? t.Genres.Select(g => new Genre { Id = g.Id, Name = g.Name }).ToList() : null, TrackArtists = t.TrackArtists != null ? t.TrackArtists.Select(tr => new TrackArtist { Id = tr.Id, ArtistName = tr.User != null ? tr.User.Nickname : null }).ToList() : null, IsFavorite = t.Favorite != null ? t.Favorite.Any(f => f.UserId == UserId && !f.IsDeleted) : false }).FirstOrDefaultAsync();
            }
            return null;
        }

        public IQueryable<Track>? GetStudioItems(int Id, bool IsForAuthor = false)
        {
            if (Id > 0)
            {
                if(IsForAuthor) return _context.Tracks.AsNoTracking().Where(t => t.UserId == Id && !t.IsDeleted).Select(t => new Track { Id = t.Id, Status = t.Status, Title = t.Title, Genres = t.Genres != null ? t.Genres.Select(g => new Genre { Name = g.Name }).ToList() : null, ReleasedAt = t.ReleasedAt, CoverImageUrl = t.CoverImageUrl });
                else return _context.Tracks.AsNoTracking().Where(t => t.UserId == Id && !t.IsDeleted && t.Status == 3).Select(t => new Track { Id = t.Id, Title = t.Title, Genres = t.Genres != null ? t.Genres.Select(g => new Genre { Name = g.Name }).ToList() : null, ReleasedAt = t.ReleasedAt, CoverImageUrl = t.CoverImageUrl });
            }
            else return null;
        }

        public async Task<string?> GetTrackAudioUrlAsync(int Id)
        {
            if (Id > 0) return await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).Select(t => t.TrackFileUrl).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<Track?> LoadTheTrackAsync(int Id, int PlaylistId, int UserId = 0)
        {
            if (Id > 0)
            {
                Track? TrackInfo = null;
                if (UserId > 0) TrackInfo = await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).Select(t => new Track { Id = Id, LyricsId = t.LyricsId, TrackFileUrl = t.TrackFileUrl, IsFavorite = t.Favorite != null ? t.Favorite.Any(f => f.UserId == UserId && !f.IsDeleted) : false }).FirstOrDefaultAsync();
                else TrackInfo = await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).Select(t => new Track { Id = Id, LyricsId = t.LyricsId, TrackFileUrl = t.TrackFileUrl, IsFavorite = false }).FirstOrDefaultAsync();
                
                if (TrackInfo is not null) return TrackInfo;
            }
            return null;
        }

        public async Task<TrackCredit?> GetCreditsAsync(int Id)
        {
            if (Id > 0) return await _context.TrackCredits.AsNoTracking().Where(t => t.TrackId == Id).Select(t => new TrackCredit { MainVocalist = t.MainVocalist, FeaturedArtists = t.FeaturedArtists, Lyricist = t.Lyricist, Composer = t.Composer, Arranger = t.Arranger, Instrumentalist = t.Instrumentalist, MasteringEngineer = t.MasteringEngineer, MixingEngineer = t.MixingEngineer, RecordingEngineer = t.RecordingEngineer, Producer = t.Producer, SoundDesigner = t.SoundDesigner }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<int> UpdateLyricsAsync(Lyrics_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Content))
            {
                Lyrics? HasLyrics = await _context.Lyrics.AsNoTracking().Where(t => t.TrackId == Model.Id && !t.IsDeleted).Select(t => new Lyrics {Id = t.Id, IsDeleted = t.IsDeleted}).FirstOrDefaultAsync();
                if(HasLyrics is not null)
                {
                    if(HasLyrics.IsDeleted)
                    {
                        int Result = await _context.Lyrics.AsNoTracking().Where(t => t.Id == HasLyrics.Id).ExecuteUpdateAsync(t => t.SetProperty(t => t.Content, Model.Content).SetProperty(t => t.LanguageId, Model.LanguageId).SetProperty(t => t.IsDeleted, false));
                        if (Result > 0) return HasLyrics.Id;
                    }
                    else
                    {
                        int Result = await _context.Lyrics.AsNoTracking().Where(t => t.Id == HasLyrics.Id).ExecuteUpdateAsync(t => t.SetProperty(t => t.Content, Model.Content).SetProperty(t => t.LanguageId, Model.LanguageId));
                        if (Result > 0) return HasLyrics.Id;
                    }
                }
                else
                {
                    Lyrics lyricsSample = new Lyrics
                    {
                        Content = Model.Content,
                        LanguageId = Model.LanguageId,
                        TrackId = Model.Id
                    };
                    await _context.AddAsync(lyricsSample);
                    await _context.SaveChangesAsync();

                    return lyricsSample.Id;
                }
            }
            return 0;
        }

        public async Task<int> DeleteLyricsAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                bool CheckTrackAvailability = await _context.Tracks.AsNoTracking().AnyAsync(t => !t.IsDeleted && t.Id == Id && t.UserId == UserId);
                if (CheckTrackAvailability)
                {
                    int Result = await _context.Lyrics.AsNoTracking().Where(l => l.TrackId == Id && !l.IsDeleted).ExecuteUpdateAsync(l => l.SetProperty(l => l.IsDeleted, true));
                    if (Result > 0) return Id;
                }
            }
            return 0;
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
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.Favorites.Where(f => f.TrackId == Id && f.UserId == UserId && !f.IsDeleted).ExecuteUpdateAsync(f => f.SetProperty(f => f.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }
    }
}
