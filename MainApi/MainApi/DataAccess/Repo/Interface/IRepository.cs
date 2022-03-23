namespace MainApi.DataAccess.Repo.Interface
{
    using MainApi.DataAccess.Model;
    using System.Diagnostics.CodeAnalysis;

    /// <summary>
    /// The Repository interface.
    /// </summary>
    /// <typeparam name="TEntity">
    /// </typeparam>
    [SuppressMessage("StyleCop.CSharp.DocumentationRules", "SA1622:GenericTypeParameterDocumentationMustHaveText", Justification = "Reviewed. Suppression is OK here.")]
    public interface IRepository<TEntity>
    {
        /// <summary>
        /// The get all.
        /// </summary>
        /// <returns>
        /// The <see cref="IEnumerable"/>.
        /// </returns>
        Task<List<User>> GetAll();

        /// <summary>
        /// The get by id.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <returns>
        /// The <see cref="TEntity?"/>.
        /// </returns>
        TEntity? GetById(int id);

        /// <summary>
        /// The create.
        /// </summary>
        /// <param name="obj">
        /// The obj.
        /// </param>
        /// <returns>
        /// The <see cref="TEntity?"/>.
        /// </returns>
        TEntity? Create(TEntity obj);

        /// <summary>
        /// The update.
        /// </summary>
        /// <param name="obj">
        /// The obj.
        /// </param>
        /// <returns>
        /// The <see cref="TEntity"/>.
        /// </returns>
        TEntity Update(TEntity obj);

        /// <summary>
        /// The delete.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        void Delete(int id);
    }
}