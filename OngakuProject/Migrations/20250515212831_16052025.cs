using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _16052025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TrackId",
                table: "DailyStreamAggregations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserListeners",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArtistId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    LastListenedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserListeners", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserListeners_AspNetUsers_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyStreamAggregations_TrackId",
                table: "DailyStreamAggregations",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_UserListeners_ArtistId",
                table: "UserListeners",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_DailyStreamAggregations_Tracks_TrackId",
                table: "DailyStreamAggregations",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DailyStreamAggregations_Tracks_TrackId",
                table: "DailyStreamAggregations");

            migrationBuilder.DropTable(
                name: "UserListeners");

            migrationBuilder.DropIndex(
                name: "IX_DailyStreamAggregations_TrackId",
                table: "DailyStreamAggregations");

            migrationBuilder.DropColumn(
                name: "TrackId",
                table: "DailyStreamAggregations");
        }
    }
}
