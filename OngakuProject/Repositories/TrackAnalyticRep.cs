using Newtonsoft.Json;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using StackExchange.Redis;
using System.Data;

namespace OngakuProject.Repositories
{
    public class TrackAnalyticRep : ITrackAnalytic
    {
        private readonly Context _context;
        private readonly IDatabase _redisDb;
        private readonly IConnectionMultiplexer _connectionMultiplexer;

        public TrackAnalyticRep(Context context, IConnectionMultiplexer connectionMultiplexer)
        {
            _context = context;
            _connectionMultiplexer = connectionMultiplexer;
            _redisDb = connectionMultiplexer.GetDatabase();
        }

        public async Task<int> AddTrackListenQueueAsync(int UserId, int TrackId)
        {
            if(UserId > 0 && TrackId > 0)
            {
                TrackListenEvent_VM ListenEvent = new TrackListenEvent_VM()
                {
                    UserId = UserId,
                    TrackId = TrackId,
                    Timestamp = DateTime.UtcNow
                };
                string? JsonObject = JsonConvert.SerializeObject(ListenEvent);

                string? Rediska = "track-listen-queue";
                await _redisDb.ListRightPushAsync(Rediska, JsonObject);
                await _redisDb.KeyExpireAsync(Rediska, TimeSpan.FromMinutes(30));

                return TrackId;
            }
            return 0;
        }

        public async Task<List<TrackListenEvent_VM?>?> GetTrackListenQueueAsync(int FetchAllDataWithin_X_Min = 15)
        {
            string? Rediska = "track-listen-queue";
            long Qty = await _redisDb.ListLengthAsync(Rediska);
            if(Qty > 0)
            {
                RedisValue[]? Items = await _redisDb.ListRangeAsync(Rediska);
                if(Items != null)
                {
                    List<TrackListenEvent_VM?>? Events = Items.Select(x => JsonConvert.DeserializeObject<TrackListenEvent_VM>(x!)).ToList();
                    if (Events != null) return Events;
                }
            }
            return null;
        }

        public async Task<bool> UpdateStreamingHistoryAsync(List<TrackListenEvent_VM?>? ListenEvents)
        {
            if (ListenEvents is not null)
            {
                List<TrackHistory> HistoryList = new List<TrackHistory>();
                foreach (TrackListenEvent_VM? Item in ListenEvents)
                {
                    if (Item != null)
                    {
                        TrackHistory trackHistorySample = new TrackHistory()
                        {
                            UserId = Item.UserId,
                            TrackId = Item.TrackId,
                            Duration = Item.Duration,
                            ListenedAt = Item.Timestamp,
                            DeviceType = 0,
                            IsValid = Item.Duration > 30 ? true : false
                        };
                        HistoryList.Add(trackHistorySample);
                    }
                }

                if (HistoryList.Count > 0)
                {
                    IServer Server = _connectionMultiplexer.GetServer("localhost", 6379);
                    await _context.AddRangeAsync(HistoryList);
                    await _context.SaveChangesAsync();
                    await foreach (RedisKey Key in Server.KeysAsync(pattern: "track-listen-queue"))
                    {
                        await _redisDb.KeyDeleteAsync(Key);
                    }
                    return true;
                }
            }
            return false;
        }

        public async Task<bool> GetAndUpdateStreamingHistoryAsync(int FetchAllDataWithin_X_Min = 15)
        {
            List<TrackListenEvent_VM?>? GetResult = await GetTrackListenQueueAsync(FetchAllDataWithin_X_Min);
            if(GetResult is not null)
            {
                bool FinalResult = await UpdateStreamingHistoryAsync(GetResult);
                return FinalResult;
            }
            return false;
        }

        public async Task<bool> FlushAllRedisDb()
        {
            IServer Server = _connectionMultiplexer.GetServer("localhost", 6379);
            if(Server.IsConnected)
            {
                await Server.FlushDatabaseAsync();
                return true;
            }
            return false;
        }
    }
}
