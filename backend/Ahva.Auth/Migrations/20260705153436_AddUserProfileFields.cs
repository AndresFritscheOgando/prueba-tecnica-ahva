using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ahva.Auth.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "BirthDate",
                table: "Users",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ContractDate",
                table: "Users",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContractType",
                table: "Users",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentNumber",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentType",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaternalSurname",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MobilePhone",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaternalSurname",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryEmail",
                table: "Users",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryPhone",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryPhoneType",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sex",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ContractDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ContractType",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DocumentNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DocumentType",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MaternalSurname",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MobilePhone",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PaternalSurname",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecondaryEmail",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecondaryPhone",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecondaryPhoneType",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Users");
        }
    }
}
