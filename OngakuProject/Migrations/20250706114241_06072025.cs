using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _06072025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AreCommsOpen",
                table: "Tracks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "TrackRecomments",
                type: "nvarchar(750)",
                maxLength: 750,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1500)",
                oldMaxLength: 1500,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditedAt",
                table: "TrackRecomments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditedAt",
                table: "TrackComments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPinned",
                table: "TrackComments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Webpage",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(230)",
                oldMaxLength: 230,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOfficial",
                table: "AspNetUsers",
                type: "bit",
                maxLength: 230,
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AreCommsOpen",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "EditedAt",
                table: "TrackRecomments");

            migrationBuilder.DropColumn(
                name: "EditedAt",
                table: "TrackComments");

            migrationBuilder.DropColumn(
                name: "IsPinned",
                table: "TrackComments");

            migrationBuilder.DropColumn(
                name: "IsOfficial",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "TrackRecomments",
                type: "nvarchar(1500)",
                maxLength: 1500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(750)",
                oldMaxLength: 750,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Webpage",
                table: "AspNetUsers",
                type: "nvarchar(230)",
                maxLength: 230,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
