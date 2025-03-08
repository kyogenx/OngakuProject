namespace OngakuProject.Interfaces
{
    public interface IBase<T> where T : class
    {
        public Task<List<T>?> GetValuesAsync();
        public Task<T?> GetValueByIdAsync(int Id);
    }
}
