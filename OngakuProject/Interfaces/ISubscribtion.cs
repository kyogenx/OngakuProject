namespace OngakuProject.Interfaces
{
    public interface ISubscribtion
    {
        public Task<int> SubscribeAsync(int Id, int SubscriberId);
        public Task<bool> UnsubscribeAsync(int Id, int SubscriberId);
        public Task<bool> IsSubscribedAsync(int Id, int SubscriberId);
    }
}
