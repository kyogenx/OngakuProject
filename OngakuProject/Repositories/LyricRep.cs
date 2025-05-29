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

        public Task<string?> EditLyricSyncAsync(LyricSync_VM Model)
        {
            throw new NotImplementedException();
        }

        public Task<TrackRaven>? GetSyncedLyricsAsync(string? Id)
        {
            throw new NotImplementedException();
        }
    }
}
