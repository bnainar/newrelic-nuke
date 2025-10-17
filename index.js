import NewRelicClient from "./newrelic_client.js";

class NewRelicNuker {
  constructor() {
    this.client = new NewRelicClient();
    this.dryRun = this.client.dryRun;
  }

  async nukeAlertPolicies() {
    console.log("🚀 Starting to nuke alert policies...");

    try {
      const policies = await this.client.getAllAlertPolicies();
      console.log(`Found ${policies.length} alert policies`);

      if (policies.length === 0) {
        console.log("✅ No alert policies found to delete");
        return { deleted: 0, failed: 0 };
      }

      let deleted = 0;
      let failed = 0;

      for (const policy of policies) {
        console.log(`Deleting policy: ${policy.name} (ID: ${policy.id})`);
        const result = await this.client.deleteAlertPolicy(policy.id);

        if (result.success) {
          deleted++;
          if (result.dryRun) {
            console.log(`  ✅ [DRY RUN] Would delete: ${policy.name}`);
          } else {
            console.log(`  ✅ Deleted: ${policy.name}`);
          }
        } else {
          failed++;
          console.log(
            `  ❌ Failed to delete: ${policy.name} - ${result.error}`
          );
        }
      }

      console.log(`\n📊 Alert Policies Summary:`);
      console.log(`  Deleted: ${deleted}`);
      console.log(`  Failed: ${failed}`);
      console.log(`  Total: ${policies.length}`);

      return { deleted, failed };
    } catch (error) {
      console.error("❌ Error nuking alert policies:", error.message);
      throw error;
    }
  }

  async nukeWorkflows() {
    console.log("\n🚀 Starting to nuke workflows...");

    try {
      const workflows = await this.client.getAllWorkflows();
      console.log(`Found ${workflows.length} workflows`);

      if (workflows.length === 0) {
        console.log("✅ No workflows found to delete");
        return { deleted: 0, failed: 0 };
      }

      let deleted = 0;
      let failed = 0;

      for (const workflow of workflows) {
        console.log(
          `Deleting workflow: ${workflow.name} (ID: ${workflow.id}, Enabled: ${workflow.enabled})`
        );
        const result = await this.client.deleteWorkflow(workflow.id);

        if (result.success) {
          deleted++;
          if (result.dryRun) {
            console.log(`  ✅ [DRY RUN] Would delete: ${workflow.name}`);
          } else {
            console.log(`  ✅ Deleted: ${workflow.name}`);
          }
        } else {
          failed++;
          console.log(
            `  ❌ Failed to delete: ${workflow.name} - ${result.error}`
          );
        }
      }

      console.log(`\n📊 Workflows Summary:`);
      console.log(`  Deleted: ${deleted}`);
      console.log(`  Failed: ${failed}`);
      console.log(`  Total: ${workflows.length}`);

      return { deleted, failed };
    } catch (error) {
      console.error("❌ Error nuking workflows:", error.message);
      throw error;
    }
  }

  async nukeChannels() {
    console.log("\n🚀 Starting to nuke channels...");

    try {
      const channels = await this.client.getAllChannels();
      console.log(`Found ${channels.length} channels`);

      if (channels.length === 0) {
        console.log("✅ No channels found to delete");
        return { deleted: 0, failed: 0 };
      }

      let deleted = 0;
      let failed = 0;

      for (const channel of channels) {
        console.log(
          `Deleting channel: ${channel.name} (ID: ${channel.id}, Destination: ${channel.destinationId})`
        );
        const result = await this.client.deleteChannel(channel.id);

        if (result.success) {
          deleted++;
          if (result.dryRun) {
            console.log(`  ✅ [DRY RUN] Would delete: ${channel.name}`);
          } else {
            console.log(`  ✅ Deleted: ${channel.name}`);
          }
        } else {
          failed++;
          console.log(
            `  ❌ Failed to delete: ${channel.name} - ${result.error}`
          );
        }
      }

      console.log(`\n📊 Channels Summary:`);
      console.log(`  Deleted: ${deleted}`);
      console.log(`  Failed: ${failed}`);
      console.log(`  Total: ${channels.length}`);

      return { deleted, failed };
    } catch (error) {
      console.error("❌ Error nuking channels:", error.message);
      throw error;
    }
  }

  async nukeAlertDestinations() {
    console.log("\n🚀 Starting to nuke alert destinations...");

    try {
      const destinations = await this.client.getAllAlertDestinations();
      console.log(`Found ${destinations.length} alert destinations`);

      if (destinations.length === 0) {
        console.log("✅ No alert destinations found to delete");
        return { deleted: 0, failed: 0 };
      }

      let deleted = 0;
      let failed = 0;

      for (const destination of destinations) {
        console.log(
          `Deleting destination: ${destination.name} (ID: ${destination.id}, Type: ${destination.type})`
        );
        const result = await this.client.deleteAlertDestination(destination.id);

        if (result.success) {
          deleted++;
          if (result.dryRun) {
            console.log(`  ✅ [DRY RUN] Would delete: ${destination.name}`);
          } else {
            console.log(`  ✅ Deleted: ${destination.name}`);
          }
        } else {
          failed++;
          console.log(
            `  ❌ Failed to delete: ${destination.name} - ${result.error}`
          );
        }
      }

      console.log(`\n📊 Alert Destinations Summary:`);
      console.log(`  Deleted: ${deleted}`);
      console.log(`  Failed: ${failed}`);
      console.log(`  Total: ${destinations.length}`);

      return { deleted, failed };
    } catch (error) {
      console.error("❌ Error nuking alert destinations:", error.message);
      throw error;
    }
  }

  async nuke() {
    console.log("💥 NEW RELIC NUKER 💥");
    console.log("====================");

    if (this.dryRun) {
      console.log("🔍 DRY RUN MODE - No actual deletions will occur");
    } else {
      console.log("⚠️  LIVE MODE - This will actually delete resources!");
    }

    console.log(`Account ID: ${this.client.accountId}`);
    console.log(`Region: ${this.client.region}`);
    console.log("");

    try {
      // Nuke alert policies first
      const policiesResult = await this.nukeAlertPolicies();

      // Then nuke workflows (required before destinations)
      const workflowsResult = await this.nukeWorkflows();

      // Then nuke channels (required before destinations)
      const channelsResult = await this.nukeChannels();

      // Finally nuke alert destinations
      const destinationsResult = await this.nukeAlertDestinations();

      console.log("\n🎉 NUKING COMPLETE! 🎉");
      console.log("=====================");
      console.log(
        `Alert Policies - Deleted: ${policiesResult.deleted}, Failed: ${policiesResult.failed}`
      );
      console.log(
        `Workflows - Deleted: ${workflowsResult.deleted}, Failed: ${workflowsResult.failed}`
      );
      console.log(
        `Channels - Deleted: ${channelsResult.deleted}, Failed: ${channelsResult.failed}`
      );
      console.log(
        `Alert Destinations - Deleted: ${destinationsResult.deleted}, Failed: ${destinationsResult.failed}`
      );

      const totalDeleted =
        policiesResult.deleted +
        workflowsResult.deleted +
        channelsResult.deleted +
        destinationsResult.deleted;
      const totalFailed =
        policiesResult.failed +
        workflowsResult.failed +
        channelsResult.failed +
        destinationsResult.failed;

      console.log(
        `\nTotal Resources - Deleted: ${totalDeleted}, Failed: ${totalFailed}`
      );

      if (totalFailed > 0) {
        console.log(
          "\n⚠️  Some resources failed to delete. Check the logs above for details."
        );
        process.exit(1);
      }
    } catch (error) {
      console.error("\n💥 NUKING FAILED! 💥");
      console.error("===================");
      console.error("Error:", error.message);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  try {
    const nuker = new NewRelicNuker();
    await nuker.nuke();
  } catch (error) {
    console.error("Failed to initialize nuker:", error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run the nuker
main();
