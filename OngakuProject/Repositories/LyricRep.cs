using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using Raven.Client.Documents.Session;

namespace OngakuProject.Repositories
{
    public class LyricRep : ILyric
    {
        private readonly Context _context;
        public LyricRep(Context context)
        {
            _context = context;
        }

        public async Task<int> AddrLyricsAsync(Lyrics_VM Model)
        {
            if (Model.TrackId > 0 && Model.UserId > 0)
            {
                bool CheckLyricsAvailability = await _context.Lyrics.AsNoTracking().AnyAsync(l => l.TrackId == Model.TrackId && !l.IsDeleted);
                if (CheckLyricsAvailability) return 0;
                else
                {
                    Lyrics lyricsSample = new Lyrics()
                    {
                        TrackId = Model.TrackId,
                        Content = Model.Content,
                        LanguageId = Model.LanguageId
                    };
                    await _context.AddAsync(lyricsSample);
                    await _context.SaveChangesAsync();

                    return lyricsSample.Id;
                }
            }
            return 0;
        }

        public async Task<int> EditLyricsAsync(Lyrics_VM Model)
        {
            if(Model.Id > 0 && Model.TrackId > 0 && Model.UserId > 0)
            {
                bool CheckTrackOwnership = await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == Model.TrackId && t.UserId == Model.UserId && t.LyricsId == Model.Id && !t.IsDeleted);
                if(CheckTrackOwnership)
                {
                    int Result = await _context.Lyrics.AsNoTracking().Where(l => l.Id == Model.Id && !l.IsDeleted).ExecuteUpdateAsync(l => l.SetProperty(l => l.LanguageId, Model.LanguageId).SetProperty(l => l.Content, Model.Content));
                    if (Result > 0) return Model.Id;
                }
            }
            return 0;
        }

        public async Task<int> DeleteLyricsAsync(int Id, int TrackId, int UserId)
        {
            if (Id > 0 && TrackId > 0 && UserId > 0)
            {
                bool CheckTrackOwnership = await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == TrackId && t.UserId == UserId && t.LyricsId == Id && !t.IsDeleted);
                if (CheckTrackOwnership)
                {
                    int Result = await _context.Lyrics.AsNoTracking().Where(l => l.Id == Id && !l.IsDeleted).ExecuteUpdateAsync(l => l.SetProperty(l => l.IsDeleted, true));
                    if (Result > 0) return Id;
                }
            }
            return 0;
        }

        public async Task<bool> CheckLyricsAvailabilityAsync(int Id, bool CheckViaTrackId)
        {
            if (Id > 0)
            {
                if(!CheckViaTrackId) return await _context.Lyrics.AsNoTracking().AnyAsync(l => l.Id == Id && !l.IsDeleted);
                else return await _context.Lyrics.AsNoTracking().AnyAsync(l => l.TrackId == Id && !l.IsDeleted);
            }
            else return false;
        }


        public async Task<string?> AddLyricSyncAsync(LyricSync_VM Model)
        {
            if (Model.TrackId > 0)
            {
                bool CheckTrackOwnership = await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == Model.TrackId && t.UserId == Model.UserId && !t.IsDeleted);
                if(CheckTrackOwnership)
                {
                    List<LyricSync>? SyncedLyricsList = new List<LyricSync>();
                    if (Model.Timestamps != null && Model.Lines != null)
                    {
                        for (int i = 0; i < Model.Timestamps.Length; i++)
                        {
                            if (Model.Lines[i] != null)
                            {
                                LyricSync lyricSyncSample = new LyricSync()
                                {
                                    WordLineContent = Model.Lines[i],
                                    TimestampSec = Model.Timestamps[i]
                                };
                                SyncedLyricsList.Add(lyricSyncSample);
                            }
                        }
                    }

                    TrackRaven trackRavenSample = new TrackRaven()
                    {
                        LyricsId = Model.LyricsId,
                        SyncedLyrics = SyncedLyricsList,
                        LegacyDb_TrackId = Model.TrackId
                    };

                    using (IAsyncDocumentSession _session = DocumentStoreHolder.Store.OpenAsyncSession())
                    {
                        await _session.StoreAsync(trackRavenSample);
                        await _session.SaveChangesAsync();
                        await _context.Lyrics.AsNoTracking().Where(t => t.Id == Model.LyricsId).ExecuteUpdateAsync(l => l.SetProperty(l => l.SyncedLyricsId, trackRavenSample.Id));

                        return trackRavenSample.Id;
                    }
                }
            }
            return null;
        }

        public async Task<string?> DeleteLyricSyncAsync(string? Id, int UserId, int TrackId)
        {
            if(!String.IsNullOrWhiteSpace(Id) && UserId > 0 && TrackId > 0)
            {
                bool CheckTrackAvailabilityForThisUser = await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == TrackId && t.UserId == UserId && !t.IsDeleted);
                if(CheckTrackAvailabilityForThisUser)
                {
                    using(IAsyncDocumentSession _session = DocumentStoreHolder.Store.OpenAsyncSession())
                    {
                        TrackRaven? LyricSync = await _session.LoadAsync<TrackRaven>(Id);
                        if(LyricSync is not null)
                        {
                            _session.Delete(Id);
                            await _session.SaveChangesAsync();

                            return Id;
                        }
                    }
                }
            }
            return null;
        }

        public async Task<string?> EditLyricSyncAsync(LyricSync_VM Model)
        {
            if(Model.Id is not null && Model.TrackId > 0)
            {
                bool CheckTrackOwnership = await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == Model.TrackId && t.UserId == Model.UserId && !t.IsDeleted);
                if(CheckTrackOwnership)
                {
                    using (IAsyncDocumentSession _session = DocumentStoreHolder.Store.OpenAsyncSession())
                    {
                        TrackRaven? RavenSample = await _session.LoadAsync<TrackRaven>(Model.Id);
                        if(RavenSample is not null)
                        {
                            List<LyricSync>? SyncedLyricsList = new List<LyricSync>();
                            if (Model.Timestamps != null && Model.Lines != null)
                            {
                                for (int i = 0; i < Model.Timestamps.Length; i++)
                                {
                                    if (Model.Lines[i] != null)
                                    {
                                        LyricSync lyricSyncSample = new LyricSync()
                                        {
                                            WordLineContent = Model.Lines[i],
                                            TimestampSec = Model.Timestamps[i]
                                        };
                                        SyncedLyricsList.Add(lyricSyncSample);
                                    }
                                }
                            }

                            RavenSample.SyncedLyrics = SyncedLyricsList;
                            await _session.SaveChangesAsync();

                            return RavenSample.Id;
                        }
                    } 
                }
            }
            return null;
        }

        public async Task<Lyrics?> GetLyricsAsync(int Id)
        {
            if (Id > 0) return await _context.Lyrics.AsNoTracking().Where(t => t.TrackId == Id && !t.IsDeleted).Select(t => new Lyrics { Id = t.Id, SyncedLyricsId = t.SyncedLyricsId, Content = t.Content, LanguageId = t.LanguageId, Language = t.Language != null ? new Language { Name = t.Language.Name } : null }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<TrackRaven?> GetSyncedLyricsAsync(string? Id)
        {
            if (Id is not null)
            {
                using (IAsyncDocumentSession _session = DocumentStoreHolder.Store.OpenAsyncSession())
                {
                    TrackRaven? Result = await _session.LoadAsync<TrackRaven>(Id);
                    if (Result is not null) return Result;
                }
            }
            return null;
        }
    }
}
