using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class GenreRep : IGenre
    {
        private readonly Context _context;
        public GenreRep(Context context)
        {
            _context = context;
        }

        public async Task<List<Genre?>?> GetTrackGenresAsync(int Id)
        {
            if (Id > 0) return await _context.TrackGenres.AsNoTracking().Where(g => g.TrackId == Id && !g.IsDeleted).Select(g => g.Genre != null ? new Genre { Id = g.Id, Name = g.Genre.Name } : null).ToListAsync();
            else return null;
        }

        public IQueryable<Genre>? GetAllGenres()
        {
            return _context.Genres.AsNoTracking().Where(g => !g.IsDeleted).Select(g => new Genre { Id = g.Id, Name = g.Name });
        }

        public IQueryable<Genre>? GetAllGenres(string? Keyword)
        {
            return _context.Genres.AsNoTracking().Where(g=> Keyword != null && (g.Name != null && g.Name.ToLower().Contains(Keyword.ToLower())) && !g.IsDeleted).Select(g => new Genre { Id = g.Id, Name = g.Name });
        }

        public async Task<GenreStats_VM?> GetGenreStatsAsync(int Id)
        {
            if (Id > 0) return await _context.Genres.AsNoTracking().Where(g => g.Id == Id && !g.IsDeleted).Select(g => new GenreStats_VM { Id = Id, Name = g.Name, Popularity = g.Popularity, TracksQty = g.Tracks != null ? g.Tracks.Count : 0, MonthlyListenersQty = g.Tracks != null ? g.Tracks.Sum(g => g.StreamsQty) : 0 }).FirstOrDefaultAsync();
            else return null;
        }
    }
}
