using MainApi.DataAccess;
using MainApi.DataAccess.Model;
using MainApi.DataAccess.Repo.Interface;
using Microsoft.EntityFrameworkCore;

public class UserRepo : IRepository<User>
{
    private readonly ApiContext _context;

    public UserRepo(ApiContext context)
    {
        this._context = context;
    }

    public Task<List<User>> GetAll()
    {
        var user = _context.Users!.ToListAsync();
        return user;
    }

    public User? GetById(int id)
    {
        var user = _context.Users!.AsNoTracking().SingleOrDefault(p => p.Id == id);
        return user;
    }

    public User? Create(User obj)
    {
        throw new NotImplementedException();
    }

    public User Update(User obj)
    {
        throw new NotImplementedException();
    }

    public void Delete(int id)
    {
        var userToDelete = _context.Users.Find(id);
        if (userToDelete is not null)
        {
            _context.Users.Remove(userToDelete);
            _context.SaveChanges();
        }
    }
}