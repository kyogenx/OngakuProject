using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using Org.BouncyCastle.Bcpg;
using StackExchange.Redis;
using System.Data;

namespace OngakuProject.Repositories
{
    public class PollRep : IPoll
    {
        private string? _connectionString;
        private readonly Context _context;
        private readonly IDatabase _redisDb;
        private readonly ITrackAnalytic _trackAnalytic;
        private readonly IConnectionMultiplexer _connectionMultiplexer;
        public PollRep(Context context, ITrackAnalytic trackAnalytic, IConnectionMultiplexer connectionMultiplexer)
        {
            _context = context;
            _trackAnalytic = trackAnalytic;
            _connectionMultiplexer = connectionMultiplexer;
            _redisDb = _connectionMultiplexer.GetDatabase();
            _connectionString = "Server=(localdb)\\mssqllocaldb;Database=OngakuDb;Trusted_Connection=True;";
        }

        public IQueryable<Poll_DTO>? GetPolls(int UserId, int SkipQty = 0, int GetQty = 25, bool OnlyActiveOnes = false)
        {
            if (UserId > 0)
            {
                if (!OnlyActiveOnes) return _context.Polls.AsNoTracking().Where(p => p.UserId == UserId && !p.IsDeleted).OrderBy(p => p.CreatedAt).Skip(SkipQty).Take(GetQty).Select(p => new Poll_DTO { Id = p.Id, LikesQty = p.LikesQty, CommsQty = p.CommsQty, ExpiresAt = p.ExpiresAt, IsAnonymous = p.IsAnonymous, IsSkippable = p.IsSkippable, Question = p.Question, IsCompleted = p.IsCompleted, MaxChoicesQty = p.IsCompleted == true ? (byte)0 : p.MaxChoicesQty, PollOptions = p.PollOptions.Select(p => new PollOption { Id = p.Id, Option = p.Option, VotesQty = p.Votes.Count(p => !p.IsDeleted) }).ToList() });
                else return _context.Polls.AsNoTracking().Where(p => p.UserId == UserId && !p.IsDeleted && !p.IsCompleted).OrderBy(p => p.CreatedAt).Skip(SkipQty).Take(GetQty).Select(p => new Poll_DTO { Id = p.Id, LikesQty = p.LikesQty, CommsQty = p.CommsQty, ExpiresAt = p.ExpiresAt, IsAnonymous = p.IsAnonymous, IsSkippable = p.IsSkippable, Question = p.Question, IsCompleted = false, MaxChoicesQty = p.MaxChoicesQty, PollOptions = p.PollOptions.Select(p => new PollOption { Id = p.Id, Option = p.Option, VotesQty = p.Votes.Count(p => !p.IsDeleted) }).ToList() });
            }
            else return null;
        }

        public async Task<HashSet<PollVote_DTO>?> GetUserVotesAsync(int Id)
        {
            if (Id > 0) return await _context.PollOptionVotes.AsNoTracking().Where(pv => pv.UserId == Id && !pv.IsDeleted).Select(pv => new PollVote_DTO { PollId = pv.PollId, OptionId = pv.PollOptionId }).ToHashSetAsync();
            return null;
        }

        public async Task<HashSet<PollLike_DTO>?> GetUserLikedPollsAsync(int Id)
        {
            if (Id > 0) return await _context.PollLikes.AsNoTracking().Where(pl => pl.UserId == Id && !pl.IsDeleted).Select(pl => new PollLike_DTO { PollId = pl.PollId }).ToHashSetAsync();
            else return null;
        }

        public async Task<HashSet<PollLike_DTO>?> GetUserPollsLikesQty(int Id)
        {
            if (Id > 0) return await _context.Polls.AsNoTracking().Where(p => p.UserId == Id && !p.IsDeleted).Select(p => new PollLike_DTO { PollId = p.Id, LikesQty = p.PollLikes.Count(p => !p.IsDeleted) }).ToHashSetAsync();
            else return null;
        }

        public async Task<List<PollOption>?> GetPollOptionsAsync(int PollId)
        {
            if (PollId > 0) return await _context.PollOptions.AsNoTracking().Where(p => p.PollId == PollId && !p.IsDeleted).Select(p => new PollOption { Id = p.Id, Option = p.Option }).ToListAsync();
            else return null;
        }

        public IQueryable<PollOptionVote>? GetPollVotesByOptionsAsync(int PollId)
        {
            if (PollId > 0) return _context.PollOptionVotes.AsNoTracking().Where(p => p.PollId == PollId && !p.IsDeleted).GroupBy(p => p.PollOptionId).Select(p => new PollOptionVote { PollOptionId = p.Key, GroupVotesQty = p.Count() });
            else return null;
        }

        public IQueryable<PollOptionVote>? GetPollVotesAsync(int PollId)
        {
            if (PollId > 0) return _context.PollOptionVotes.AsNoTracking().Where(p => p.PollId == PollId && !p.IsDeleted).Select(p => new PollOptionVote { Id = p.Id, PollOptionId = p.PollOptionId });
            else return null;
        }

        public async Task<int> GetLikesQtyAsync(int Id)
        {
            if (Id > 0) return await _context.PollLikes.AsNoTracking().CountAsync(p => p.PollId == Id && !p.IsDeleted);
            else return 0;
        }

        public async Task<int> GetTotalVotesQtyAsync(int PollId)
        {
            if (PollId > 0) return await _context.PollOptionVotes.AsNoTracking().CountAsync(p => p.Id == PollId && !p.IsDeleted);
            else return 0;
        }


        public async Task<int> CreateAsync(Poll_VM PollModel)
        {
            if(!String.IsNullOrWhiteSpace(PollModel.Question) && PollModel.Options is not null)
            {
                if (PollModel.Options.Count > 6) PollModel.Options.RemoveRange(5, PollModel.Options.Count);
                List<PollOption>? PollOptionsSample = [.. PollModel.Options.Where(o => o != null).Select(o => new PollOption { Option = o })];

                Poll pollSample = new Poll
                {
                    CreatedAt = DateTime.Now,             
                    Question = PollModel.Question,
                    IsAnonymous = PollModel.IsAnonym,
                    IsSkippable = PollModel.IsSkippable,
                    MaxChoicesQty = PollModel.MaxChoicesQty,
                    NecessaryVoicesQty = PollModel.NecessaryVoicesQty,
                    ExpiresAt = DateTime.Now.AddMinutes(PollModel.DurationInMinutes),
                    PostId = PollModel.PostId,
                    UserId = PollModel.UserId,
                    PollOptions = PollOptionsSample
                };
                await _context.AddAsync(pollSample);
                await _context.SaveChangesAsync();

                return pollSample.Id;
            }
            return 0;
        }

        public async Task<int> EndAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Polls.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted && !p.IsCompleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsCompleted, true).SetProperty(p => p.ForceFinishedAt, DateTime.Now));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> DeleteAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Polls.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> VoteAsync(int Id, int UserId, int OptionId)
        {
            if (Id > 0 && UserId > 0 && OptionId > 0)
            {
                bool IsPollStillAvailable = await _context.Polls.AsNoTracking().AnyAsync(p => p.Id == Id && !p.IsDeleted && !p.IsCompleted);
                if (IsPollStillAvailable)
                {
                    bool HasntVotedYet = await _context.PollOptionVotes.AsNoTracking().AnyAsync(p => p.PollId == Id && p.UserId == UserId && !p.IsDeleted);
                    if (!HasntVotedYet)
                    {
                        PollOptionVote pollOptionVoteSample = new PollOptionVote
                        {
                            PollId = Id,
                            UserId = UserId,
                            PollOptionId = OptionId,
                            VotedAt = DateTime.Now
                        };
                        await _context.AddAsync(pollOptionVoteSample);
                        await _context.SaveChangesAsync();

                        return pollOptionVoteSample.Id;
                    }
                }
            }
            return 0;
        }

        public async Task<int> LikeAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                PollLike? PollInfo = await _context.PollLikes.AsNoTracking().Where(l => l.PollId == Id && l.UserId == UserId).Select(l => new PollLike { Id = l.Id, IsDeleted = l.IsDeleted }).FirstOrDefaultAsync();
                if(PollInfo is not null)
                {
                    if(PollInfo.IsDeleted)
                    {
                        int Result = await _context.PollLikes.AsNoTracking().Where(l => l.Id == PollInfo.Id).ExecuteUpdateAsync(l => l.SetProperty(l => l.IsDeleted, false).SetProperty(l => l.LikedAt, DateTime.Now));
                        if (Result > 0)
                        {
                            await TempSaveLikeInfoAsync(new PollHasBeenLiked_VM { PollId = Id, UserId = UserId, LikedAt = DateTime.Now });
                            return Id;
                        }
                    }
                }
                else
                {
                    PollLike pollLikeSample = new PollLike
                    {
                        PollId = Id,
                        UserId = UserId,
                        LikedAt = DateTime.Now
                    };
                    await _context.AddAsync(pollLikeSample);
                    await _context.SaveChangesAsync();
                    await TempSaveLikeInfoAsync(new PollHasBeenLiked_VM { PollId = Id, UserId = UserId, LikedAt = DateTime.Now });

                    return pollLikeSample.Id;
                }
            }
            return 0;
        }

        public async Task<int> RemoveLikeAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.PollLikes.AsNoTracking().Where(l => l.PollId == Id && l.UserId == UserId && !l.IsDeleted).ExecuteUpdateAsync(l => l.SetProperty(l => l.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> UserVotedOptionIndexAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.PollOptionVotes.AsNoTracking().Where(p => p.PollId == Id && p.UserId == UserId && !p.IsDeleted).Select(p => p.PollOptionId).FirstOrDefaultAsync();
            else return 0;
        }

        public async Task<bool> CheckPollOwnership(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.Polls.AsNoTracking().AnyAsync(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted);
            else return false;
        }

        public async Task<bool> CheckPollDatasAvailabilityAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.Polls.AsNoTracking().AnyAsync(p => (p.Id == Id && !p.IsDeleted) && (p.IsSkippable || p.UserId == UserId));
            else return false;
        }

        public async Task<int> TempSaveLikeInfoAsync(PollHasBeenLiked_VM Model)
        {
            if(Model.UserId > 0 && Model.PollId > 0)
            {
                string? Key = "poll-likes-qty";
                string? JsonConverted = JsonConvert.SerializeObject(Model);
                if(JsonConverted != null)
                {
                    await _redisDb.ListRightPushAsync(Key, JsonConverted);
                    await _redisDb.KeyExpireAsync(Key, TimeSpan.FromMinutes(8));

                    return Model.Id;
                }
            }
            return 0;
        }

        public async Task<bool> UpdateLikesQtyAsync()
        {
            string? Key = "poll-likes-qty";
            RedisValue[]? Likes = await _redisDb.ListRangeAsync(Key);
            if (Likes != null)
            {
                HashSet<IGrouping<int, PollHasBeenLiked_VM?>> Events = Likes.Select(x => JsonConvert.DeserializeObject<PollHasBeenLiked_VM>(x!)).GroupBy(x => x!.PollId).ToHashSet();
                if (Events is not null)
                {
                    using(SqlConnection? connection = new SqlConnection(_connectionString))
                    {
                        await connection.OpenAsync();
                        //1. Creating TempLikes temporary table
                        using (var CreateTempTable = new SqlCommand(@"Create Table #TempLikes (PollId INT NOT NULL PRIMARY KEY, LikesQty INT NOT NULL);", connection))
                        {
                            await CreateTempTable.ExecuteNonQueryAsync();
                        }
                        //2. Preparing current values for temp table
                        DataTable? DataTable = new DataTable();
                        DataTable.Columns.Add("PollId", typeof(int));
                        DataTable.Columns.Add("LikesQty", typeof(int));
                        foreach(IGrouping<int, PollHasBeenLiked_VM?> Event in Events)
                        {
                            if(Event is not null) DataTable.Rows.Add(Event.Key, Event.Count());
                        }
                        //3. Bulk copying values to temp table
                        using(SqlBulkCopy bulkCopy= new SqlBulkCopy(connection))
                        {
                            bulkCopy.BatchSize = Events.Count;
                            bulkCopy.DestinationTableName = "#TempLikes";
                            await bulkCopy.WriteToServerAsync(DataTable);
                        }
                        //4. Update poll likes by copying from temp table
                        using (SqlCommand? updateCommand = new SqlCommand(@"UPDATE p Set p.LikesQty = p.LikesQty + t.LikesQty From Polls p Inner Join #TempLikes t On p.Id = t.PollId;", connection))
                        {
                            await updateCommand.ExecuteNonQueryAsync();
                        }
                    }
                }
                await _trackAnalytic.FlushAllRedisDb();

                return true;
            }
            return false;
        }

        public async Task<bool> UpdateCommsQtyAsync()
        {
            string? Key = "poll-comms-qty";
            RedisValue[]? Values = await _redisDb.ListRangeAsync(Key);
            if(Values is not null)
            {
                List<IGrouping<int, PollHasBeenLiked_VM?>> DeseralizedObject = Values.Select(x => JsonConvert.DeserializeObject<PollHasBeenLiked_VM>(x!)).GroupBy(x => x.PollId).ToList();
                if(DeseralizedObject is not null)
                {
                    using(SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        await connection.OpenAsync();
                    }

                    using (SqlCommand? connectionCommand = new SqlCommand(@"Create Table #TempComms (PollId PRIMARY KEY INT NOT NULL, LikesQty INT NOT NULL);"))
                    {
                        await connectionCommand.ExecuteNonQueryAsync();
                    }
                    DataTable? dataTable = new DataTable();
                    dataTable.Columns.Add("PollId", typeof(int));
                    dataTable.Columns.Add("LikesQty", typeof(int));
                    foreach(IGrouping<int, PollHasBeenLiked_VM?> Item in DeseralizedObject)
                    {
                        if(Item is not null) dataTable.Rows.Add(Item.Key, Item.Count());
                    }

                    using(SqlBulkCopy? bulkCopy = new SqlBulkCopy(_connectionString))
                    {
                        bulkCopy.DestinationTableName = "#TempComms";
                        await bulkCopy.WriteToServerAsync(dataTable);
                    }

                    using(SqlCommand? updCommand = new SqlCommand(@"Update p Set p.CommsQty = p.CommsQty + t.LikesQty From Polls p Inner Join #TempComms t On t.PollId = p.PollId;"))
                    {
                        await updCommand.ExecuteNonQueryAsync();
                    }
                    await _trackAnalytic.FlushAllRedisDb();
                    return true;
                }
            }
            return false;
        }

        public async Task<int> TempSaveCommsInfoAsync(PollHasBeenLiked_VM Model)
        {
            if(Model.PollId > 0 && Model.UserId > 0)
            {
                string? Key = "poll-comms-qty";
                string? JsonConverted = JsonConvert.SerializeObject(Model);
                if(JsonConverted is not null)
                {
                    await _redisDb.ListRightPushAsync(Key, JsonConverted);
                    await _redisDb.KeyExpireAsync(Key, TimeSpan.FromMinutes(8));

                    return Model.Id;
                }
            }
            return 0;
        }
    }
}
