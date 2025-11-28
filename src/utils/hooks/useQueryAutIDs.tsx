import { AutIDNFT, fetchMetadata, Hub } from "@aut-labs/sdk";
import {
  gql,
  QueryFunctionOptions,
  QueryResult,
  useQuery
} from "@apollo/client";
import { AutIdJoinedHubState } from "@lib/d-aut";
import { useEffect, useState } from "react";
import { environment } from "@api/environment";
import { AutOSAutID } from "@api/models/aut.model";

const GET_AUTIDS = gql`
  query GeAutIDs($skip: Int, $first: Int, $where: AutID_filter) {
    autIDs(skip: $skip, first: $first, where: $where) {
      id
      owner
      tokenID
      username
      metadataUri
      joinedHubs {
        id
        role
        commitment
        hubAddress
      }
    }
  }
`;

const useGetAutIDs = (props: QueryFunctionOptions<any, any> = {}) => {
  const { data, loading, ...rest } = useQuery(GET_AUTIDS, {
    fetchPolicy: "cache-and-network",
    ...props
  });

  const [autIDs, setAutIDs] = useState<AutOSAutID[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  useEffect(() => {
    if (data?.autIDs?.length) {
      const fetchAutIDsMetadata = () => {
        return data.autIDs.map(async ({ id, metadataUri, joinedHubs }) => {
          let metadata = await fetchMetadata<AutIDNFT>(
            metadataUri,
            environment.ipfsGatewayUrl
          );
          metadata = metadata || ({ properties: {} } as AutIDNFT);
          joinedHubs = [...joinedHubs].map((hub: AutIdJoinedHubState) => ({
            id: hub.id,
            role: hub.role,
            commitment: hub.commitment,
            hubAddress: hub.hubAddress.toLowerCase(),
            isAdmin: false
          }));
          return new AutOSAutID({
            ...metadata,
            properties: {
              ...metadata.properties,
              address: id,
              hubs: [],
              interactions: [],
              joinedHubs,
              ethDomain: null,
              network: null
            }
          } as AutOSAutID);
        });
      };
      const fetch = async () => {
        setLoadingMetadata(true);
        const autIds = await Promise.all([...fetchAutIDsMetadata()]);
        setLoadingMetadata(false);
        setAutIDs(autIds);
      };
      fetch();
    }
  }, [data]);

  return {
    data: autIDs || [],
    ...rest,
    loading: loadingMetadata || loading
  } as QueryResult<AutOSAutID[]>;
};

export default useGetAutIDs;
