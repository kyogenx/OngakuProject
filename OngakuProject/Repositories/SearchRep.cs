using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Repositories
{
    public class SearchRep : ISearch
    {
        private readonly Context _context;
        public SearchRep(Context context)
        {
            _context = context;
        }

        public IQueryable<Playlist>? GetAllPlaylists()
        {
            return _context.Playlists.AsNoTracking().Select(p => new Playlist { Id = p.Id, User = p.User != null ? new User { Id = p.UserId, Nickname = p.User.Nickname } : null, Name = p.Name, ImageUrl = p.ImageUrl, SongsQty = p.TrackPlaylists != null ? p.TrackPlaylists.Count : 0 });
        }

        public IQueryable<Playlist>? SearchForPlaylists(string? Keyword, int Skip, int Load = 25)
        {
            return null;
        }
    }
}
