using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.Repositories;
using OngakuProject.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddIdentity<User, IdentityRole<int>>(Opt =>
{
    Opt.Password.RequiredUniqueChars = 0;
    Opt.Password.RequiredLength = 9;
    Opt.Password.RequireNonAlphanumeric = false;
    Opt.Password.RequireDigit = true;
    Opt.Password.RequireLowercase = false;
    Opt.Password.RequireUppercase = false;
}).AddEntityFrameworkStores<Context>().AddRoles<IdentityRole<int>>().AddTokenProvider<DataProtectorTokenProvider<User>>(TokenOptions.DefaultProvider);
builder.Services.AddDbContext<Context>(Opt => Opt.UseSqlServer(builder.Configuration.GetConnectionString("Database")));

builder.Services.AddHangfire(Opt => Opt.UseSqlServerStorage(builder.Configuration.GetConnectionString("Database")));
builder.Services.AddHangfireServer();

builder.Services.AddTransient(typeof(IBase<>), typeof(BaseRep<>));

builder.Services.AddTransient<IUser, UserRep>();
builder.Services.AddTransient<IProfile, ProfileRep>();
builder.Services.AddTransient<IAccount, AccountRep>();
builder.Services.AddTransient<IProfileEdit, ProfileEdit>();

builder.Services.AddTransient<IAlbum, AlbumRep>();
builder.Services.AddTransient<IGenre, GenreRep>();
builder.Services.AddTransient<ILyric, LyricRep>();
builder.Services.AddTransient<ITrack, TrackRep>();
builder.Services.AddTransient<IPlaylist, PlaylistRep>();
builder.Services.AddTransient<ISubscribtion, SubscribtionRep>();
builder.Services.AddScoped<ITrackAnalytic, TrackAnalyticRep>();
builder.Services.AddTransient<ITrackComment, TrackCommentRep>();
builder.Services.AddTransient<IPost, PostRep>();
builder.Services.AddTransient<IPoll, PollRep>();
builder.Services.AddTransient<IPollComment, PollCommentRep>();

builder.Services.AddTransient<ISearch, SearchRep>();
builder.Services.AddTransient<ICountry, CountryRep>();
builder.Services.AddTransient<IArtistInfo, ArtistInfoRep>();

builder.Services.AddTransient<IMail, MailRep>();
builder.Services.AddScoped<IMiscellaneous, MiscellaneousRep>();
builder.Services.AddTransient<IBackgroundWorker, BackgroundWorker>();

builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(builder.Configuration.GetValue<string>("Redis:ConnectionString", "localhost:6379,allowAdmin=true")));
builder.Services.AddMemoryCache();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseStaticFiles();
app.UseAuthorization();
app.UseAuthentication();
app.UseHangfireDashboard();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    //pattern: "{controller=Account}/{action=Initiate}/{id?}")
    .WithStaticAssets();

RecurringJob.AddOrUpdate<TrackAnalyticRep>("track-history-update-job",
    Job => Job.GetAndUpdateStreamingHistoryAsync(1), CronHelper.RunEvery_N_Minutes(15));
RecurringJob.AddOrUpdate<PollRep>("poll-likes-qty-update-job",
    Job => Job.UpdateLikesQtyAsync(), CronHelper.RunEvery_N_Minutes(1));
RecurringJob.AddOrUpdate<PollRep>("poll-commd-qty-update-job",
    Job => Job.UpdateCommsQtyAsync(), CronHelper.RunEvery_N_Minutes(1));

app.Run();
