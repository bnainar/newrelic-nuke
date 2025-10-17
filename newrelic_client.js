import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

class NewRelicClient {
  constructor() {
    this.apiKey = process.env.NEW_RELIC_API_KEY;
    this.accountId = process.env.NEW_RELIC_ACCOUNT_ID;
    this.region = process.env.NEW_RELIC_REGION || "US";
    this.dryRun = process.env.DRY_RUN === "true";

    if (!this.apiKey || !this.accountId) {
      throw new Error(
        "NEW_RELIC_API_KEY and NEW_RELIC_ACCOUNT_ID are required"
      );
    }

    const baseURL =
      this.region === "EU"
        ? "https://api.eu.newrelic.com/graphql"
        : "https://api.newrelic.com/graphql";

    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "API-Key": this.apiKey,
      },
    });

    // REST API client
    const restBaseURL =
      this.region === "EU"
        ? "https://api.eu.newrelic.com"
        : "https://api.newrelic.com";

    this.restClient = axios.create({
      baseURL: restBaseURL,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.apiKey,
      },
    });
  }

  async makeGraphQLRequest(query, variables = {}) {
    try {
      const response = await this.client.post("", {
        query,
        variables,
      });

      if (response.data.errors) {
        throw new Error(
          `GraphQL errors: ${JSON.stringify(response.data.errors)}`
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("GraphQL request failed:", error.message);
      throw error;
    }
  }

  async getAllAlertPolicies() {
    const query = `
      query GetAlertPolicies($accountId: Int!) {
        actor {
          account(id: $accountId) {
            alerts {
              policiesSearch {
                policies {
                  id
                  name
                  incidentPreference
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.makeGraphQLRequest(query, {
      accountId: parseInt(this.accountId),
    });
    return data.actor.account.alerts.policiesSearch.policies;
  }

  async deleteAlertPolicy(policyId) {
    if (this.dryRun) {
      console.log(`[DRY RUN] Would delete alert policy: ${policyId}`);
      return { success: true, dryRun: true };
    }

    const mutation = `
      mutation DeleteAlertPolicy($accountId: Int!, $policyId: ID!) {
        alertsPolicyDelete(accountId: $accountId, id: $policyId) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        accountId: parseInt(this.accountId),
        policyId: policyId.toString(),
      });

      return { success: true, data: data.alertsPolicyDelete };
    } catch (error) {
      console.error(
        `Failed to delete alert policy ${policyId}:`,
        error.message
      );
      return { success: false, error: error.message };
    }
  }

  async getAllWorkflows() {
    const query = `
      query GetWorkflows($accountId: Int!) {
        actor {
          account(id: $accountId) {
            aiWorkflows {
              workflows {
                entities {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.makeGraphQLRequest(query, {
      accountId: parseInt(this.accountId),
    });
    return data.actor.account.aiWorkflows.workflows.entities;
  }

  async deleteWorkflow(workflowId) {
    if (this.dryRun) {
      console.log(`[DRY RUN] Would delete workflow: ${workflowId}`);
      return { success: true, dryRun: true };
    }

    const mutation = `
      mutation DeleteWorkflow($accountId: Int!, $workflowId: ID!) {
        aiWorkflowsDeleteWorkflow(accountId: $accountId, id: $workflowId) {
          id
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        accountId: parseInt(this.accountId),
        workflowId: workflowId.toString(),
      });

      return { success: true, data: data.aiWorkflowsDeleteWorkflow };
    } catch (error) {
      console.error(`Failed to delete workflow ${workflowId}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async getAllChannels() {
    const query = `
      query GetChannels($accountId: Int!) {
        actor {
          account(id: $accountId) {
            aiNotifications {
              channels {
                entities {
                  id
                  name
                  destinationId
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.makeGraphQLRequest(query, {
      accountId: parseInt(this.accountId),
    });
    return data.actor.account.aiNotifications.channels.entities;
  }

  async deleteChannel(channelId) {
    if (this.dryRun) {
      console.log(`[DRY RUN] Would delete channel: ${channelId}`);
      return { success: true, dryRun: true };
    }

    const mutation = `
      mutation DeleteChannel($accountId: Int!, $channelId: ID!) {
        aiNotificationsDeleteChannel(accountId: $accountId, channelId: $channelId) {
          ids
          error {
            details
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(mutation, {
        accountId: parseInt(this.accountId),
        channelId: channelId.toString(),
      });

      if (data.aiNotificationsDeleteChannel.error) {
        return {
          success: false,
          error: data.aiNotificationsDeleteChannel.error.details,
        };
      }

      return { success: true, data: data.aiNotificationsDeleteChannel };
    } catch (error) {
      console.error(`Failed to delete channel ${channelId}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async getAllAlertDestinations() {
    const query = `
      query GetAlertDestinations($accountId: Int!) {
        actor {
          account(id: $accountId) {
            aiNotifications {
              destinations {
                entities {
                  id
                  name
                  type
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.makeGraphQLRequest(query, {
      accountId: parseInt(this.accountId),
    });
    return data.actor.account.aiNotifications.destinations.entities;
  }

  async deleteAlertDestination(destinationId) {
    if (this.dryRun) {
      console.log(`[DRY RUN] Would delete alert destination: ${destinationId}`);
      return { success: true, dryRun: true };
    }

    try {
      // Try REST API first
      const response = await this.restClient.delete(
        `/v2/alerts_destinations/${destinationId}.json`
      );

      if (response.status === 200 || response.status === 204) {
        return { success: true, data: { id: destinationId } };
      } else {
        throw new Error(`REST API returned status ${response.status}`);
      }
    } catch (restError) {
      console.log(
        `REST API failed, trying GraphQL for destination ${destinationId}`
      );

      // Fallback to GraphQL
      const mutation = `
        mutation DeleteAlertDestination($accountId: Int!, $destinationId: ID!) {
          aiNotificationsDeleteDestination(accountId: $accountId, destinationId: $destinationId) {
            ids
            error {
              details
            }
          }
        }
      `;

      try {
        const data = await this.makeGraphQLRequest(mutation, {
          accountId: parseInt(this.accountId),
          destinationId: destinationId.toString(),
        });

        if (data.aiNotificationsDeleteDestination.error) {
          return {
            success: false,
            error: data.aiNotificationsDeleteDestination.error.details,
          };
        }

        return { success: true, data: data.aiNotificationsDeleteDestination };
      } catch (graphqlError) {
        console.error(
          `Both REST and GraphQL failed for destination ${destinationId}:`,
          graphqlError.message
        );
        return { success: false, error: graphqlError.message };
      }
    }
  }
}

export default NewRelicClient;
