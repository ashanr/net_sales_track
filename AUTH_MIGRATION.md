# Database Migration for Users Table

After adding authentication, you need to create and run a migration to add the Users table to your PostgreSQL database.

## Create Migration

```powershell
cd src/SalesTrackApi
dotnet ef migrations add AddUsersTable
```

## Apply Migration

The migration will be applied automatically when you run the API:

```powershell
dotnet run
```

Or apply manually:

```powershell
dotnet ef database update
```

## What Gets Created

The migration creates a `Users` table with:
- `Id` (Primary Key, auto-increment)
- `Name` (VARCHAR(200), required)
- `Email` (VARCHAR(255), required, unique index)
- `PasswordHash` (TEXT, required)
- `CreatedAt` (TIMESTAMP, default NOW())

## Verify Migration

After running the API, you can verify the table was created:

```sql
\c SalesTrackDb
\dt
SELECT * FROM "Users";
```

The API will automatically apply migrations on startup (configured in Program.cs).
