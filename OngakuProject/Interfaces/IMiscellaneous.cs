using OngakuProject.Models;

namespace OngakuProject.Interfaces
{
    public interface IMiscellaneous
    {
        public Task<List<Language>?> GetLanguages(string? Keyword);
    }
}
