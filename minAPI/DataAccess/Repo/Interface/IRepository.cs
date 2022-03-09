namespace DataAccess.Repositories.Interfaces
{
    public interface IRepository<TEntity>
    {
        IEnumerable<TEntity> GetAll();

        TEntity? GetById(object id);

        TEntity? Create(TEntity obj);

        TEntity Update(TEntity obj);
    }
}