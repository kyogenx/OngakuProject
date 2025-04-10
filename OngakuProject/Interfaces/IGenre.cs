using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IGenre
    {
        public Task<GenreStats_VM?> GetGenreStatsAsync(int Id);
        public IQueryable<Genre>? GetAllGenres();
        public IQueryable<Genre>? GetAllGenres(string? Keyword);
    }
}
