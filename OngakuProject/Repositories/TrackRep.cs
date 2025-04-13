using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using SixLabors.ImageSharp;

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

        public Task<int> DisableTrackAsync(int Id, int UserId)
        {
            throw new NotImplementedException();
        }

        public Task<int> MuteTrackAsync(int Id, int UserId, int Duration = 0)
        {
            throw new NotImplementedException();
        }

        public Task<int> SubmitUploadedTrackAsync(int Id, int UserId)
        {
            throw new NotImplementedException();
        }

        public Task<int> UnmuteTrackAsync(int Id, int UserId)
        {
            throw new NotImplementedException();
        }

        public Task<int> UpdateCreditsOfTrackAsync(TrackCredits_VM Model)
        {
            throw new NotImplementedException();
        }

        public Task<int> UpdateTrackAsync(Track_VM Model)
        {
            throw new NotImplementedException();
        }

        public async Task<int> UploadTrackAsync(Track_VM Model)
        {
            if (!String.IsNullOrWhiteSpace(Model.Title) && Model.Genres is not null)
            {
                string? StrTrackFileUrl = null;
                string? StrThumbnailUrl = null;
                string? StrCoverImageUrl = null;
                int GenresQty = Model.Genres.Count > 3 ? 3 : Model.Genres.Count;
                List<TrackGenre>? TrackGenres = new List<TrackGenre>();
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
                    StrThumbnailUrl = Guid.NewGuid().ToString("D").Substring(6, 8) + Path.GetExtension(Model.CoverImageUrl.FileName);
                    StrCoverImageUrl = Guid.NewGuid().ToString("D").Substring(4, 8) + Path.GetExtension(Model.CoverImageUrl.FileName);
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

        public async Task<int> UpdateGenresAsync(TrackGenre_VM Model)
        {
            if(Model.Id > 0 && Model.Genres is not null)
            {
                List<TrackGenre> TrackGenres = new List<TrackGenre>();
                for (int i = 0; i < Model.Genres.Count; i++)
                {
                    for (int j = 0; j < Model.Genres.Count; j++)
                    {
                        if ((Model.Genres[i] == Model.Genres[j]) && (i != j)) continue;
                        else
                        {
                            TrackGenre trackGenreSample = new TrackGenre()
                            {
                                IsDeleted = false,
                                TrackId = Model.Id,
                                GenreId = Model.Genres[i]
                            };
                            TrackGenres.Add(trackGenreSample);
                            break;
                        }
                    }
                }
                await _context.AddRangeAsync(TrackGenres);
                await _context.SaveChangesAsync();

                return Model.Id;
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
    }
}
