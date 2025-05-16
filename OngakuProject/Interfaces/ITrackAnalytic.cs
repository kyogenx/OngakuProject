using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface ITrackAnalytic
    {
        public Task<bool> FlushAllRedisDb();
        public Task<int> AddTrackListenQueueAsync(int UserId, int TrackId);
        public Task<List<TrackListenEvent_VM?>?> GetTrackListenQueueAsync(int FetchAllDataWithin_X_Min = 15);
        public Task<bool> UpdateStreamingHistoryAsync(List<TrackListenEvent_VM?>? ListenEvents);
        public Task<bool> GetAndUpdateStreamingHistoryAsync(int FetchAllDataWithin_X_Min = 15);
    }
}
