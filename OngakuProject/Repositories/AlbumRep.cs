using Hangfire;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.Services;
using OngakuProject.ViewModels;
using System.Drawing;
using System.Numerics;

namespace OngakuProject.Repositories
{
    public class AlbumRep : IAlbum
    {
        private readonly Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public AlbumRep(Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<int> DeleteAlbumAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted && a.Status < 2).ExecuteUpdateAsync(a => a.SetProperty(a => a.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> EditMetadataAsync(AlbumMetadata_VM MetadataModel)
        {
            int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == MetadataModel.Id && a.UserId == MetadataModel.UserId && !a.IsDeleted).ExecuteUpdateAsync(a => a.SetProperty(a => a.Title, MetadataModel.Title).SetProperty(a => a.IsExplicit, MetadataModel.IsExplicit).SetProperty(a => a.Description, MetadataModel.Description));
            if (Result > 0) return MetadataModel.Id;
            else return 0;
        }

        public async Task<int> EditVersionAsync(int Id, int UserId, int Version)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted).ExecuteUpdateAsync(a => a.SetProperty(a => a.Version, Version));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> EditGenreAsync(int Id, int UserId, int GenreId)
        {
            if (Id > 0 && UserId > 0 && GenreId > 0)
            {
                int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted).ExecuteUpdateAsync(a => a.SetProperty(a => a.GenreId, GenreId));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<string?> EditCoverImageAsync(int Id, int UserId, IFormFile? CoverImageFile)
        {
            if(Id > 0 && UserId > 0 && CoverImageFile is not null)
            {
                if(Path.GetExtension(CoverImageFile.FileName) == ".png" || Path.GetExtension(CoverImageFile.FileName) == ".jpg" || Path.GetExtension(CoverImageFile.FileName) == ".jpeg")
                {
                    string? CurrentImageUrl = await _context.Albums.AsNoTracking().Where(a => a.Id == Id).Select(a => a.CoverImageUrl).FirstOrDefaultAsync();
                    if (CurrentImageUrl is not null)
                    {
                        using (FileStream Fs = new FileStream(_webHostEnvironment.WebRootPath + "/AlbumCovers/" + CurrentImageUrl, FileMode.Create))
                        {
                            await CoverImageFile.CopyToAsync(Fs);
                            return CurrentImageUrl;
                        }
                    }
                    else
                    {
                        string? RandFileName = Guid.NewGuid().ToString("N").Substring(6, 12) + Path.GetExtension(CoverImageFile.FileName);
                        using (FileStream Fs = new FileStream(_webHostEnvironment.WebRootPath + "/AlbumCovers/" + RandFileName, FileMode.Create))
                        {
                            await CoverImageFile.CopyToAsync(Fs);
                            int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id).ExecuteUpdateAsync(a => a.SetProperty(a => a.CoverImageUrl, RandFileName));
                            if (Result > 0) return CurrentImageUrl;
                        }
                    }
                }
            }
            return null;
        }

        public async Task<int> EditPremiereDateAsync(int Id, int UserId, DateTime PremiereDate)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted).ExecuteUpdateAsync(a => a.SetProperty(a => a.PremieredAt, PremiereDate));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> DisableAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted).ExecuteUpdateAsync(a => a.SetProperty(a => a.Status, 0));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> EnableAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted).ExecuteUpdateAsync(a => a.SetProperty(a => a.Status, 2));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> SubmitAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                //Check if the album has at least 2 tracks and not more than 90 tracks
                int IsTheAlbumReady = await _context.AlbumTracks.AsNoTracking().CountAsync(a => a.AlbumId == Id && !a.IsDeleted);
                if(IsTheAlbumReady >= 2 && IsTheAlbumReady <= 90)
                {
                    int Result = await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted && a.Status == 1).ExecuteUpdateAsync(a => a.SetProperty(a => a.Status, 2).SetProperty(a => a.LastUpdatedAt, DateTime.Now));
                    if (Result > 0) return Id;
                }
            }
            return 0;
        }

        public async Task<int> UploadNewAlbumAsync(Album_VM Model)
        {
            if (!String.IsNullOrEmpty(Model.Title))
            {
                if(Model.CoverImageFile != null)
                {
                    string? RandFileName = Guid.NewGuid().ToString("N").Substring(4, 12) + Path.GetExtension(Model.CoverImageFile.FileName);
                    using (FileStream Stream = new FileStream(_webHostEnvironment.WebRootPath + "/AlbumCovers/" + RandFileName, FileMode.Create))
                    {
                        await Model.CoverImageFile.CopyToAsync(Stream);
                        Model.CoverImage = RandFileName;

                        //using (Bitmap Img = new Bitmap(_webHostEnvironment.WebRootPath + "/AlbumCovers/" + RandFileName))
                        //{
                        //    int Size = 150;
                        //    int Quality = 75;
                        //    Bitmap? Resized = new Bitmap(Size, Size);

                        //    using(Graphics Gr = Graphics.FromImage(Img))
                        //    {
                        //        Size Sz = new Size(Size, Size);
                        //        Point PF = new Point(Sz);
                        //        Gr.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighSpeed;
                        //        Gr.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        //        Gr.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
                        //        Gr.DrawImage(Img, PF);

                        //        using(FileStream NewStream = new FileStream(_webHostEnvironment.WebRootPath + "/AlbumCompressedCovers/" + RandFileName, FileMode.Create))
                        //        {
                        //            System.Drawing.Imaging.ImageCodecInfo[] Codecs = System.Drawing.Imaging.ImageCodecInfo.GetImageEncoders();
                        //            System.Drawing.Imaging.ImageCodecInfo Codec = Codecs.FirstOrDefault(c => c.FormatID == System.Drawing.Imaging.ImageFormat.Jpeg.Guid);
                        //            if (Codec != null)
                        //            {
                        //                System.Drawing.Imaging.EncoderParameters EncoderParams = new System.Drawing.Imaging.EncoderParameters(1);
                        //                EncoderParams.Param[0] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.Quality, Quality);
                        //                Resized.Save(NewStream, Codec, EncoderParams);
                        //            }
                        //            else Resized.Save(NewStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                        //        }
                        //    }
                        //}
                    }
                }

                Album albumSample = new Album()
                {
                    Status = 1, //Pending...
                    Title = Model.Title,
                    Description = Model.Description,
                    GenreId = Model.GenreId,
                    UserId = Model.UserId,
                    IsExplicit = Model.IsExplicit,
                    LastUpdatedAt = DateTime.Now,
                    ThumbnailUrl = Model.CoverImage,
                    Version = Model.Version,
                    AddedAt = DateTime.Now,               
                    UPC_Code = Model.UPC_Code,
                    PremieredAt = Model.PremieredAt,
                    CoverImageUrl = Model.CoverImage,
                };

                await _context.AddAsync(albumSample);
                await _context.SaveChangesAsync();

                if (Model.PremieredAt.Date > DateTime.Now.Date)
                {
                    BackgroundJob.Schedule(() => SubmitAsync(albumSample.Id, albumSample.UserId), new DateTimeOffset(Model.PremieredAt));
                }

                return albumSample.Id;
            }
            else return 0;
        }

        public async Task<int> ApplyTracklistToAlbumAsync(int Id, int UserId, List<AlbumTrack_VM> AlbumTracksModel)
        {
            if(Id > 0 && UserId > 0 && AlbumTracksModel.Count > 1)
            {
                bool CheckAlbumValidity = await _context.Albums.AsNoTracking().AnyAsync(a => a.Id == Id && a.UserId == UserId && !a.IsDeleted && a.Status < 2);
                if(CheckAlbumValidity)
                {
                    int CheckAlbumTracksQty = await GetQuantityAsync(Id, false);
                    CheckAlbumTracksQty = 90 - CheckAlbumTracksQty;
                    AlbumTracksModel = AlbumTracksModel.Count > CheckAlbumTracksQty ? AlbumTracksModel.Take(CheckAlbumTracksQty).ToList() : AlbumTracksModel;

                    List<AlbumTrack> AlbumTracks = new List<AlbumTrack>();
                    foreach (AlbumTrack_VM AlbumTrack in AlbumTracksModel)
                    {
                        AlbumTracks.Add(new AlbumTrack { AlbumId = Id, TrackId = AlbumTrack.Id, TrackOrderNumber = AlbumTrack.OrderNumber });
                    }
                    AlbumTracks = AlbumTracks.OrderByDescending(a => a.TrackOrderNumber).ToList();

                    await _context.AddRangeAsync(AlbumTracks);
                    await _context.SaveChangesAsync();

                    return AlbumTracks.Count;
                }
            }
            return 0;
        }

        public async Task<int> GetQuantityAsync(int Id, bool IsForAuthor = false)
        {
            if (Id > 0)
            {
                if (!IsForAuthor) return await _context.Albums.AsNoTracking().CountAsync(a => a.UserId == Id && !a.IsDeleted && a.Status == 3);
                else return await _context.Albums.AsNoTracking().CountAsync(a => a.UserId == Id && !a.IsDeleted);
            }
            else return 0;
        }

        public IQueryable<Album_DTO>? Get(int Id, bool IsForAuthor = false, int Skip = 0, int LoadQty = 25)
        {
            if (Id > 0)
            {
                if (!IsForAuthor) return _context.Albums.AsNoTracking().Where(a => a.UserId == Id && !a.IsDeleted && a.Status == 3).OrderByDescending(a => a.PremieredAt).Skip(Skip).Take(LoadQty).Select(a => new Album_DTO { Id = a.Id, Title = a.Title, CoverImageUrl = a.CoverImageUrl, PremieredAt = a.PremieredAt, IsExplicit = a.IsExplicit });
                else return _context.Albums.AsNoTracking().Where(a => a.UserId == Id && !a.IsDeleted).OrderByDescending(a => a.PremieredAt).Skip(Skip).Take(LoadQty).Select(a => new Album_DTO { Id = a.Id, Title = a.Title, CoverImageUrl = a.CoverImageUrl, PremieredAt = a.PremieredAt, IsExplicit = a.IsExplicit, Status = a.Status });
            }
            else return null;
        }

        public async Task<Album_DTO?> GetInfoAsync(int Id, int FetchingUserId = 0, bool IsForAuthor = false)
        {
            if (Id > 0)
            {
                if (!IsForAuthor) return await _context.Albums.AsNoTracking().Where(a => a.Id == Id && !a.IsDeleted && a.Status == 3).Select(a => new Album_DTO { Id = a.Id, Title = a.Title, CoverImageUrl = a.CoverImageUrl, Description = a.Description, UserId = a.UserId, GenreId = a.GenreId, Genre = a.Genre.Name, MainArtist = a.User.Nickname, PremieredAt = a.PremieredAt, Version = a.Version, IsExplicit = a.IsExplicit, Tracks = a.AlbumTracks.Select(a => new Track { Id = a.TrackId, Title = a.Track.Title, HasExplicit = a.Track.HasExplicit, TrackArtists = a.Track.TrackArtists.Select(ar => new TrackArtist { ArtistId = ar.ArtistId, ArtistName = ar.User.Nickname }).ToList() }).ToList() }).FirstOrDefaultAsync();
                else
                {
                    if(FetchingUserId > 0) return await _context.Albums.AsNoTracking().Where(a => a.Id == Id && a.UserId == FetchingUserId && !a.IsDeleted).Select(a => new Album_DTO { Id = a.Id, CoverImageUrl = a.CoverImageUrl, Title = a.Title, UserId = a.UserId, Description = a.Description, GenreId = a.GenreId, MainArtist = a.User.Nickname, Genre = a.Genre.Name, PremieredAt = a.PremieredAt, Version = a.Version, IsExplicit = a.IsExplicit, Tracks = a.AlbumTracks.Select(a => new Track { Id = a.TrackId, Title = a.Track.Title, HasExplicit = a.Track.HasExplicit, TrackArtists = a.Track.TrackArtists.Select(ar => new TrackArtist { ArtistId = ar.ArtistId, ArtistName = ar.User.Nickname }).ToList() }).ToList(), Status = a.Status }).FirstOrDefaultAsync();
                }
            }
            return null;
        }

        public IQueryable<Track_DTO>? GetTracks(int Id, int Skip = 0, int Take = 45)
        {
            if (Id > 0) return _context.AlbumTracks.AsNoTracking().Where(t => t.AlbumId == Id && !t.IsDeleted).OrderBy(a => a.TrackOrderNumber).Skip(Skip).Take(Take).Select(a => new Track_DTO { Id = a.TrackId, IsIncluded = a.AlbumId == Id ? true : false, Title = a.Track.Title, HasExplicit = a.Track.HasExplicit, ArtistName = a.Track.User.Nickname, UserId = a.Track.UserId, FeaturingArtists = a.Track.TrackArtists.Select(ar => new TrackArtist { Id = ar.ArtistId, ArtistName = ar.User.Nickname }).ToList() });
            else return null;
        }
    }
}
