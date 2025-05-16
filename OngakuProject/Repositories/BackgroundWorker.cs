using Hangfire;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Services;

namespace OngakuProject.Repositories
{
    public class BackgroundWorker : IBackgroundWorker
    {
        private readonly Context _context;
        private readonly ITrackAnalytic _trackAnalytic;

        public BackgroundWorker(Context context, ITrackAnalytic trackAnalytic)
        {
            _context = context;
            _trackAnalytic = trackAnalytic;
        }

        public void TrackHistoryUpdaterAsync(int RunEvery_N_Minutes = 15)
        {
            RecurringJob.AddOrUpdate<TrackAnalyticRep>("track-history-update-job",
                Job => Job.GetAndUpdateStreamingHistoryAsync(15), CronHelper.RunEvery_N_Minutes(RunEvery_N_Minutes));
        }
    }
}
