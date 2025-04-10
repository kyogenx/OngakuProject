using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _070420250 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoodTags_Albums_AlbumId",
                table: "MoodTags");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackMoods_MoodTags_MoodTagId",
                table: "TrackMoods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MoodTags",
                table: "MoodTags");

            migrationBuilder.RenameTable(
                name: "MoodTags",
                newName: "MoodTag");

            migrationBuilder.RenameIndex(
                name: "IX_MoodTags_AlbumId",
                table: "MoodTag",
                newName: "IX_MoodTag_AlbumId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MoodTag",
                table: "MoodTag",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MoodTag_Albums_AlbumId",
                table: "MoodTag",
                column: "AlbumId",
                principalTable: "Albums",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackMoods_MoodTag_MoodTagId",
                table: "TrackMoods",
                column: "MoodTagId",
                principalTable: "MoodTag",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoodTag_Albums_AlbumId",
                table: "MoodTag");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackMoods_MoodTag_MoodTagId",
                table: "TrackMoods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MoodTag",
                table: "MoodTag");

            migrationBuilder.RenameTable(
                name: "MoodTag",
                newName: "MoodTags");

            migrationBuilder.RenameIndex(
                name: "IX_MoodTag_AlbumId",
                table: "MoodTags",
                newName: "IX_MoodTags_AlbumId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MoodTags",
                table: "MoodTags",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MoodTags_Albums_AlbumId",
                table: "MoodTags",
                column: "AlbumId",
                principalTable: "Albums",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackMoods_MoodTags_MoodTagId",
                table: "TrackMoods",
                column: "MoodTagId",
                principalTable: "MoodTags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
