using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _07042025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LabelId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MonthlyListeners",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Popularity = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Labels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1050)", maxLength: 1050, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lyrics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Language = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lyrics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrackCredits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Composer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Lyricist = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Producer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Arranger = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MainVocalist = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FeaturedArtists = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Instrumentalist = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MixingEngineer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MasteringEngineer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RecordingEngineer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SoundDesigner = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MainArtistId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackCredits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackCredits_AspNetUsers_MainArtistId",
                        column: x => x.MainArtistId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Albums",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Popularity = table.Column<int>(type: "int", nullable: false),
                    CoverImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AddedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReleasedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GenreId = table.Column<int>(type: "int", nullable: true),
                    LabelId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Albums", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Albums_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Albums_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Albums_Labels_LabelId",
                        column: x => x.LabelId,
                        principalTable: "Labels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AlbumGenres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlbumId = table.Column<int>(type: "int", nullable: false),
                    GenreId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumGenres", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlbumGenres_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlbumGenres_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Discs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    AlbumId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Discs_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MoodTags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AlbumId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoodTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MoodTags_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Tracks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(90)", maxLength: 90, nullable: true),
                    ISRC_Code = table.Column<string>(type: "nvarchar(12)", maxLength: 12, nullable: true),
                    HasExplicit = table.Column<bool>(type: "bit", nullable: false),
                    TrackFileUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CoverImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Popularity = table.Column<int>(type: "int", nullable: false),
                    Tempo = table.Column<int>(type: "int", nullable: false),
                    Mode = table.Column<bool>(type: "bit", nullable: false),
                    Key = table.Column<int>(type: "int", nullable: false),
                    StreamsQty = table.Column<int>(type: "int", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReleasedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    AlbumId = table.Column<int>(type: "int", nullable: true),
                    LabelId = table.Column<int>(type: "int", nullable: true),
                    LyricsId = table.Column<int>(type: "int", nullable: true),
                    GenreId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tracks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tracks_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tracks_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tracks_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tracks_Labels_LabelId",
                        column: x => x.LabelId,
                        principalTable: "Labels",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tracks_Lyrics_LyricsId",
                        column: x => x.LyricsId,
                        principalTable: "Lyrics",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TrackArtist",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrackId = table.Column<int>(type: "int", nullable: false),
                    ArtistId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackArtist", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackArtist_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TrackArtist_Tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrackGenres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrackId = table.Column<int>(type: "int", nullable: false),
                    GenreId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackGenres", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackGenres_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackGenres_Tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrackMoods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrackId = table.Column<int>(type: "int", nullable: false),
                    MoodTagId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackMoods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackMoods_MoodTags_MoodTagId",
                        column: x => x.MoodTagId,
                        principalTable: "MoodTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackMoods_Tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_LabelId",
                table: "AspNetUsers",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumGenres_AlbumId",
                table: "AlbumGenres",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumGenres_GenreId",
                table: "AlbumGenres",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_GenreId",
                table: "Albums",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_LabelId",
                table: "Albums",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_UserId",
                table: "Albums",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Discs_AlbumId",
                table: "Discs",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_MoodTags_AlbumId",
                table: "MoodTags",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackArtist_TrackId",
                table: "TrackArtist",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackArtist_UserId",
                table: "TrackArtist",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackCredits_MainArtistId",
                table: "TrackCredits",
                column: "MainArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackGenres_GenreId",
                table: "TrackGenres",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackGenres_TrackId",
                table: "TrackGenres",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackMoods_MoodTagId",
                table: "TrackMoods",
                column: "MoodTagId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackMoods_TrackId",
                table: "TrackMoods",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_AlbumId",
                table: "Tracks",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_GenreId",
                table: "Tracks",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_LabelId",
                table: "Tracks",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_LyricsId",
                table: "Tracks",
                column: "LyricsId");

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_UserId",
                table: "Tracks",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Labels_LabelId",
                table: "AspNetUsers",
                column: "LabelId",
                principalTable: "Labels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Labels_LabelId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "AlbumGenres");

            migrationBuilder.DropTable(
                name: "Discs");

            migrationBuilder.DropTable(
                name: "TrackArtist");

            migrationBuilder.DropTable(
                name: "TrackCredits");

            migrationBuilder.DropTable(
                name: "TrackGenres");

            migrationBuilder.DropTable(
                name: "TrackMoods");

            migrationBuilder.DropTable(
                name: "MoodTags");

            migrationBuilder.DropTable(
                name: "Tracks");

            migrationBuilder.DropTable(
                name: "Albums");

            migrationBuilder.DropTable(
                name: "Lyrics");

            migrationBuilder.DropTable(
                name: "Genres");

            migrationBuilder.DropTable(
                name: "Labels");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_LabelId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LabelId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MonthlyListeners",
                table: "AspNetUsers");
        }
    }
}
