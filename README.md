# New Relic Nuker 💥

A Node.js application that nukes (deletes) all alert policies and alert destinations from a New Relic account.

## ⚠️ WARNING

This tool will **permanently delete** all alert policies and alert destinations in your New Relic account. Use with extreme caution!

## Features

- 🚀 Deletes all alert policies
- 🎯 Deletes all alert destinations  
- 🔍 Dry run mode for safe testing
- 📊 Detailed logging and progress tracking
- 🛡️ Error handling and validation
- 🌍 Supports both US and EU regions

## Prerequisites

- Node.js 18 or higher
- New Relic API key with appropriate permissions
- New Relic account ID

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/nuke-newrelic.git
   cd nuke-newrelic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your New Relic credentials:
   ```env
   NEW_RELIC_API_KEY=your_api_key_here
   NEW_RELIC_ACCOUNT_ID=your_account_id_here
   NEW_RELIC_REGION=US  # or EU
   DRY_RUN=false  # Set to true for safe testing
   ```

### Getting Your API Key

1. Go to [New Relic API Keys](https://one.newrelic.com/admin-portal/api-keys/home)
2. Create a new API key with the following permissions:
   - `AlertsRead`
   - `AlertsWrite`
   - `AlertsPolicyDelete`
   - `AlertsDestinationDelete`

### Getting Your Account ID

1. Go to your New Relic account
2. Click on your account name in the top right
3. The Account ID is displayed in the dropdown

## Usage

### Dry Run (Recommended First)

Test the tool without actually deleting anything:

```bash
# Set DRY_RUN=true in your .env file, then:
npm start
```

### Live Run

⚠️ **This will actually delete resources!**

```bash
# Set DRY_RUN=false in your .env file, then:
npm start
```

### Development Mode

Run with auto-restart on file changes:

```bash
npm run dev
```

## What Gets Deleted

### Alert Policies
- All alert policies in the account
- Includes policies with any incident preference setting
- Policies are deleted regardless of their current state

### Alert Destinations
- All alert destinations in the account
- Includes email, Slack, webhook, and other destination types
- Destinations are deleted regardless of their current usage

## Output

The tool provides detailed logging including:

- Number of resources found
- Progress for each deletion
- Success/failure status for each operation
- Final summary with totals

Example output:
```
💥 NEW RELIC NUKER 💥
====================
🔍 DRY RUN MODE - No actual deletions will occur
Account ID: 123456
Region: US

🚀 Starting to nuke alert policies...
Found 5 alert policies
Deleting policy: Critical Alerts (ID: 123)
  ✅ [DRY RUN] Would delete: Critical Alerts
...

📊 Alert Policies Summary:
  Deleted: 5
  Failed: 0
  Total: 5

🎉 NUKING COMPLETE! 🎉
=====================
Alert Policies - Deleted: 5, Failed: 0
Alert Destinations - Deleted: 3, Failed: 0

Total Resources - Deleted: 8, Failed: 0
```

## Error Handling

The tool includes comprehensive error handling:

- Validates required environment variables
- Handles API rate limits and timeouts
- Continues processing even if individual deletions fail
- Provides detailed error messages
- Exits with appropriate status codes

## Security Notes

- Never commit your `.env` file to version control
- Use API keys with minimal required permissions
- Consider using dry run mode first to verify behavior
- Keep backups of important alert configurations

## Troubleshooting

### Common Issues

1. **"NEW_RELIC_API_KEY and NEW_RELIC_ACCOUNT_ID are required"**
   - Ensure your `.env` file exists and contains the required variables

2. **"GraphQL errors: [object Object]"**
   - Check that your API key has the required permissions
   - Verify your account ID is correct

3. **"Failed to delete" errors**
   - Some resources may be protected or in use
   - Check the New Relic UI for any restrictions

### Getting Help

If you encounter issues:

1. Check the error messages in the console output
2. Verify your API key permissions
3. Test with dry run mode first
4. Check the New Relic documentation for API limitations

## License

MIT License - Use at your own risk!
