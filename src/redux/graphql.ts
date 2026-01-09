import { ApolloClient, InMemoryCache } from "@apollo/client";

// AutIDs Subgraph - Identity layer
export const autidsClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/110723/autids/v0.3.0",
  connectToDevTools: true,
  cache: new InMemoryCache()
});

// Hubs Subgraph - Community & tasks layer
export const hubsClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/110723/hubs/v0.3.0",
  connectToDevTools: true,
  cache: new InMemoryCache()
});

// Interactions Subgraph - Interaction templates
export const interactionsClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/110723/interactions/v0.3.0",
  connectToDevTools: true,
  cache: new InMemoryCache()
});

// Legacy export (defaults to autids for compatibility)
export const apolloClient = autidsClient;
