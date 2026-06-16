using evoHike.Backend;
using evoHike.Backend.Middleware;
using evoHike.Backend.Repositories;
using evoHike.Backend.DataAccess;
using evoHike.Backend.DataAccess.Interfaces;
using evoHike.Backend.Models.DTO;
using evoHike.Backend.Services;
using evoHike.Backend.Services.Interfaces;
using OpenMeteo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());
    });

builder.Services.AddHttpClient<WeatherService>();

builder.Services.AddApplicationCors(builder.Configuration);
builder.Services.AddApplicationSwagger();
builder.Services.AddApplicationDatabase(builder.Configuration);
builder.Services.AddScoped<IUserDataAccess, UserDataAccess>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddApplicationAuthentication(builder.Configuration); 

builder.Services.AddScoped<ITrailService, TrailService>();
builder.Services.AddScoped<ITrailsDataAccess, TrailsDataAccess>();
builder.Services.AddScoped<IPlannedHikeDataAccess, PlannedHikeDataAccess>();
builder.Services.AddScoped<IDataImportDataAccess, DataImportDataAccess>();
builder.Services.AddScoped<IPlannedHikeService, PlannedHikeService>();
builder.Services.AddScoped<IEmailService, GmailService>();

builder.Services.AddScoped<DataImportService>();
builder.Services.AddScoped<OpenMeteoClient>();

builder.Services.Configure<GmailOptions>(
    builder.Configuration.GetSection(GmailOptions.GmailOptionKey));

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.RegisterMiddlewares();
app.InitializeDatabase();
app.MapControllers();

app.Run();