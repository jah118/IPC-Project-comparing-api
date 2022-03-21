using MainApi.DataAccess;
using MainApi.DataAccess.Model;
using MainApi.DataAccess.Repo.Interface;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
configurationBuilder.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", false, true)
    .Build();
var configuration = configurationBuilder.Build();


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApiContext>(options =>
{
    //options.UseSqlServer("Server=JonasXPS\\SQLEXPRESS; Initial Catalog=EFCore; Integrated Security=True");
    //options.UseSqlServer("Server=10.10.1.62,1433; Database=EFCore; User Id=sa;Password=12341234;MultipleActiveResultSets=true");
    //options.UseSqlServer("Server=127.0.0.1,1443; Initial Catalog=EFCore; User Id=SA;Password=VerySecretPass1234; Integrated Security=False; MultipleActiveResultSets=True;");
    options.UseSqlServer("Server=mainpidb; Initial Catalog=EFCore; User Id=SA;Password=VerySecretPass1234; Integrated Security=False; MultipleActiveResultSets=True;");

    //options.UseSqlServer("Data Source=127.0.0.1,1443; Initial Catalog=EFCore; User Id=Sa;Password=Passw0rd2019; Integrated Security=False; MultipleActiveResultSets=True;");
});

//var service = ServiceLocator.ServiceProvider.GetService<MyServiceBase>();

builder.Services.AddTransient<IRepository<User>, UserRepo>();

var service = builder.Services.BuildServiceProvider().GetService<ApiContext>();
service.Database.EnsureCreated();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();



