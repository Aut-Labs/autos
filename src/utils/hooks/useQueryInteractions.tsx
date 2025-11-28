import { environment } from "@api/environment";
import {
  gql,
  QueryFunctionOptions,
  QueryResult,
  useQuery
} from "@apollo/client";
import { fetchMetadata } from "@aut-labs/sdk";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { interactionsClient, GET_ALL_INTERACTIONS, GET_INTERACTIONS_BY_CREATOR } from "@api/interactions-subgraph";

// Define the Interaction interface
export interface Interaction {
  id: string;
  tokenId: string;
  name: string;
  protocol: string;
  description: string;
  logo: string;
  actionUrl: string;
  targetContract: string;
  functionABI: string;
  networkId: string;
  uniqueHash: string;
  creator: string;
  transactionHash: string;
  createdAt: string;
  // UI tracking fields
  royaltyRecipient?: string;
  royaltiesModel?: number;
  price?: string;
  integrations?: number;
  earnings?: string;
}

// Process the raw data from the subgraph into our Interaction interface
const processInteraction = (interaction: any): Interaction => {
  return {
    id: interaction.id,
    tokenId: interaction.tokenId,
    name: interaction.name,
    protocol: interaction.protocol || "",
    description: interaction.description,
    logo: interaction.logo || "",
    actionUrl: interaction.actionUrl || "",
    targetContract: interaction.targetContract,
    functionABI: interaction.functionABI,
    networkId: interaction.networkId,
    uniqueHash: interaction.uniqueHash,
    creator: interaction.creator,
    transactionHash: interaction.transactionHash || "",
    createdAt: interaction.createdAt || "",
    // Mock values for royalties-related fields (to be implemented)
    royaltyRecipient: "",
    royaltiesModel: 0,
    price: "0",
    // Mock values for integrations and earnings (to be implemented)
    integrations: Math.floor(Math.random() * 10),
    earnings: "0.00 $AUT"
  };
};

// Custom hook to fetch user's created interactions
const useQueryUserInteractions = (
  creatorAddress?: string,
  props: QueryFunctionOptions<any, any> = {}
) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  const { data, loading: queryLoading, error, ...rest } = useQuery(
    GET_INTERACTIONS_BY_CREATOR,
    {
      skip: !creatorAddress,
      fetchPolicy: "cache-and-network",
      variables: {
        creator: creatorAddress?.toLowerCase()
      },
      client: interactionsClient,
      ...props
    }
  );

  useEffect(() => {
    const processData = async () => {
      if (data?.autIDInteractions) {
        try {
          // Extract the interaction data from each autIDInteraction
          const processedInteractions = data.autIDInteractions.map((item: any) => {
            const interaction = item.interaction;
            return processInteraction({
              ...interaction,
              blockNumber: item.blockNumber
            });
          });
          setInteractions(processedInteractions);
        } catch (error) {
          console.error("Error processing interactions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (data) {
      processData();
    }
  }, [data]);

  return {
    data: interactions,
    loading: loading || queryLoading,
    error,
    ...rest
  } as QueryResult<Interaction[]>;
};

// Custom hook to fetch all interactions
const useQueryAllInteractions = (props: QueryFunctionOptions<any, any> = {}) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  const { data, loading: queryLoading, error, ...rest } = useQuery(
    GET_ALL_INTERACTIONS,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        first: 100,
        skip: 0
      },
      client: interactionsClient,
      ...props
    }
  );

  useEffect(() => {
    const processData = async () => {
      if (data?.interactions) {
        try {
          const processedInteractions = data.interactions.map(processInteraction);
          setInteractions(processedInteractions);
        } catch (error) {
          console.error("Error processing interactions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (data) {
      processData();
    }
  }, [data]);

  return {
    data: interactions,
    loading: loading || queryLoading,
    error,
    ...rest
  } as QueryResult<Interaction[]>;
};

export { useQueryUserInteractions, useQueryAllInteractions }; 