using MainApi.DataAccess.Model;
using MainApi.DataAccess.Repo.Interface;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MainApi.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IRepository<User?> userRepo;
        private const string? HelloWorldPayload = "Hello, World!";

        // GET: api/<UserController>
        public UserController(IRepository<User?> userRepo)
        {
            this.userRepo = userRepo;
        }

        [HttpGet(nameof(users))]
        public IEnumerable<User> users()
        {
            var list = new List<User>(1000);
            for (int index = 1; index < 1001; index++)
            {
                list.Add(new User
                {
                    Id = index,
                    Age = 25,
                    FirstName = "First_Name" + index,
                    LastName = "Last_Name" + index,
                    Email = "Email" + index,
                    Framework = "minimal"
                }
                );
            }

            return list;
        }

        [HttpGet(nameof(getEfCore))]
        public async Task<IEnumerable<User>> getEfCore()
        {
            return await userRepo.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet(nameof(getEfCoreById))]
        public User? getEfCoreById(int id)
        {
            return userRepo.GetById(id);
        }

        [HttpGet(nameof(hello))]
        public string? hello()
        {
            return "Hello World!";
        }

        [HttpGet(nameof(plain))]
        public IResult plain()
        {
            Results.StatusCode(200);
            Results.Content("text/plain");
            return Results.Text(HelloWorldPayload);
        }
    }
}