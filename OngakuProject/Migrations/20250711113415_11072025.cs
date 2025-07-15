using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _11072025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Webpage",
                table: "AspNetUsers",
                type: "nvarchar(230)",
                maxLength: 230,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FormedAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GenreId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "Type",
                table: "AspNetUsers",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_GenreId",
                table: "AspNetUsers",
                column: "GenreId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Genres_GenreId",
                table: "AspNetUsers",
                column: "GenreId",
                principalTable: "Genres",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Genres_GenreId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_GenreId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FormedAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "GenreId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Webpage",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(230)",
                oldMaxLength: 230,
                oldNullable: true);
        }
    }
}
