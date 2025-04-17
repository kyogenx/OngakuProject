using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _14042025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_Genres_GenreId",
                table: "Tracks");

            migrationBuilder.DropTable(
                name: "TrackGenres");

            migrationBuilder.DropTable(
                name: "TrackMoods");

            migrationBuilder.DropIndex(
                name: "IX_Tracks_GenreId",
                table: "Tracks");

            migrationBuilder.RenameColumn(
                name: "GenreId",
                table: "Tracks",
                newName: "CreditId");

            migrationBuilder.AddColumn<int>(
                name: "TrackId",
                table: "TrackCredits",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GenreTrack",
                columns: table => new
                {
                    GenresId = table.Column<int>(type: "int", nullable: false),
                    TracksId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenreTrack", x => new { x.GenresId, x.TracksId });
                    table.ForeignKey(
                        name: "FK_GenreTrack_Genres_GenresId",
                        column: x => x.GenresId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenreTrack_Tracks_TracksId",
                        column: x => x.TracksId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MoodTagTrack",
                columns: table => new
                {
                    MoodTagsId = table.Column<int>(type: "int", nullable: false),
                    TracksId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoodTagTrack", x => new { x.MoodTagsId, x.TracksId });
                    table.ForeignKey(
                        name: "FK_MoodTagTrack_MoodTags_MoodTagsId",
                        column: x => x.MoodTagsId,
                        principalTable: "MoodTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MoodTagTrack_Tracks_TracksId",
                        column: x => x.TracksId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_CreditId",
                table: "Tracks",
                column: "CreditId",
                unique: true,
                filter: "[CreditId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TrackCredits_TrackId",
                table: "TrackCredits",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_GenreTrack_TracksId",
                table: "GenreTrack",
                column: "TracksId");

            migrationBuilder.CreateIndex(
                name: "IX_MoodTagTrack_TracksId",
                table: "MoodTagTrack",
                column: "TracksId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackCredits_Tracks_TrackId",
                table: "TrackCredits",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_TrackCredits_CreditId",
                table: "Tracks",
                column: "CreditId",
                principalTable: "TrackCredits",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackCredits_Tracks_TrackId",
                table: "TrackCredits");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_TrackCredits_CreditId",
                table: "Tracks");

            migrationBuilder.DropTable(
                name: "GenreTrack");

            migrationBuilder.DropTable(
                name: "MoodTagTrack");

            migrationBuilder.DropIndex(
                name: "IX_Tracks_CreditId",
                table: "Tracks");

            migrationBuilder.DropIndex(
                name: "IX_TrackCredits_TrackId",
                table: "TrackCredits");

            migrationBuilder.DropColumn(
                name: "TrackId",
                table: "TrackCredits");

            migrationBuilder.RenameColumn(
                name: "CreditId",
                table: "Tracks",
                newName: "GenreId");

            migrationBuilder.CreateTable(
                name: "TrackGenres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GenreId = table.Column<int>(type: "int", nullable: false),
                    TrackId = table.Column<int>(type: "int", nullable: false),
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
                    MoodTagId = table.Column<int>(type: "int", nullable: false),
                    TrackId = table.Column<int>(type: "int", nullable: false),
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
                name: "IX_Tracks_GenreId",
                table: "Tracks",
                column: "GenreId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_Genres_GenreId",
                table: "Tracks",
                column: "GenreId",
                principalTable: "Genres",
                principalColumn: "Id");
        }
    }
}
