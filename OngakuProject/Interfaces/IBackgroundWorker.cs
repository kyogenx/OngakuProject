namespace OngakuProject.Interfaces
{
    public interface IBackgroundWorker
    {
        public void TrackHistoryUpdaterAsync(int RunEvery_N_Minutes = 15);
    }
}
