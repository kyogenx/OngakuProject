using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using SixLabors.ImageSharp;
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

        public async Task<int> UpdateCreditsOfTrackAsync(TrackCredits_VM Model)
        {
            if (Model.Id > 0 && Model.MainVocalist != null)
            {
                string[]?[] Strings = [Model.Producer ?? null, Model.Composer ?? null, Model.Arranger ?? null, Model.Lyricist ?? null, Model.MainVocalist ?? null, Model.FeaturedArtists ?? null, Model.MixingEngineer ?? null, Model.MasteringEngineer ?? null, Model.RecordingEngineer ?? null, Model.SoundDesigner ?? null, Model.Instrumentalist ?? null];
                string[]? ReadyStrings = [];

                if (Strings != null)
                {
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
                        if(!String.IsNullOrWhiteSpace(TempValue))
                        {
                            ReadyStrings.Append(TempValue);
                        }
                    }
                }

                if(ReadyStrings is not null)
                {
                    bool CheckCreditsAvailability = await _context.TrackCredits.AsNoTracking().AnyAsync(t => t.TrackId == Model.Id && t.MainArtistId == Model.MainArtistId);
                    if (CheckCreditsAvailability)
                    {
                        int Result = await _context.TrackCredits.AsNoTracking().Where(t => t.TrackId == Model.Id && t.MainArtistId == Model.MainArtistId).ExecuteUpdateAsync(t => t.SetProperty(t => t.Producer, ReadyStrings[0]).SetProperty(t => t.Composer, ReadyStrings[1]).SetProperty(t => t.Arranger, ReadyStrings[2]).SetProperty(t => t.Lyricist, ReadyStrings[3]).SetProperty(t => t.MainVocalist, ReadyStrings[4]).SetProperty(t => t.FeaturedArtists, ReadyStrings[5]).SetProperty(t => t.MixingEngineer, ReadyStrings[6]).SetProperty(t => t.MasteringEngineer, ReadyStrings[7]).SetProperty(t => t.RecordingEngineer, ReadyStrings[8]).SetProperty(t => t.SoundDesigner, ReadyStrings[9]).SetProperty(t => t.Instrumentalist, ReadyStrings[10]));
                        if (Result > 0) return Model.Id;
                    }
                    else
                    {
                        //TrackCredit trackCreditSample=new TrackCredit()
                        //{
                        //    TrackId = Model.Id,
                        //    MainArtistId = Model.MainArtistId,

                        //}
                        return 1;
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

        public async Task<Track?> GetTrackInfoAsync(int Id, bool IsForAuthor = false)
        {
            if(Id > 0)
            {
                if (IsForAuthor) return await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).OrderByDescending(t => t.ReleasedAt).Select(t => new Track { HasExplicit = t.HasExplicit, TrackFileUrl = t.TrackFileUrl, Id = Id, Title = t.Title, ReleasedAt = t.ReleasedAt, StreamsQty = t.StreamsQty, Status = t.Status, CoverImageUrl = t.CoverImageUrl, Genres = t.Genres != null ? t.Genres.Select(g => new Genre { Id = g.Id, Name = g.Name }).ToList() : null, TrackArtists = t.TrackArtists != null ? t.TrackArtists.Select(tr => new TrackArtist { Id = tr.Id, ArtistName = tr.User != null ? tr.User.Nickname : null }).ToList() : null, AddedAt = t.AddedAt }).FirstOrDefaultAsync();
                else return await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).OrderByDescending(t => t.ReleasedAt).Select(t => new Track { HasExplicit = t.HasExplicit, TrackFileUrl = t.TrackFileUrl, Id = Id, Title = t.Title, ReleasedAt = t.ReleasedAt, StreamsQty = t.StreamsQty, CoverImageUrl = t.CoverImageUrl, UserId = t.UserId, User = t.User != null ? new User { Nickname = t.User.Nickname } : null, Genres = t.Genres != null ? t.Genres.Select(g => new Genre { Id = g.Id, Name = g.Name }).ToList() : null, TrackArtists = t.TrackArtists != null ? t.TrackArtists.Select(tr => new TrackArtist { Id = tr.Id, ArtistName = tr.User != null ? tr.User.Nickname : null }).ToList() : null }).FirstOrDefaultAsync();
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

        public async Task<Track?> LoadTheTrackAsync(int Id, int PlaylistId)
        {
            if (Id > 0)
            {
                Track? TrackInfo = await _context.Tracks.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted).Select(t => new Track { Id = Id, TrackFileUrl = t.TrackFileUrl, NextTrackId = 0 }).FirstOrDefaultAsync();
                if (TrackInfo is not null)
                {
                    if (PlaylistId > 0)
                    {

                    }
                    else return TrackInfo;
                }
            }
            return null;
        }

        public async Task<int> UpdateStreamsQtyAsync(int TrackId)
        {
            if(TrackId > 0)
            {
                int CurrentStreams = await _context.Tracks.AsNoTracking().Where(t => t.Id == TrackId && !t.IsDeleted && t.Status == 3).Select(t => t.StreamsQty).FirstOrDefaultAsync() + 1;
                int Result = await _context.Tracks.AsNoTracking().Where(t => t.Id == TrackId && !t.IsDeleted && t.Status == 3).ExecuteUpdateAsync(t => t.SetProperty(t => t.StreamsQty, CurrentStreams));
                if (Result > 0) return CurrentStreams;
            }
            return -1;
        }
    }
}
