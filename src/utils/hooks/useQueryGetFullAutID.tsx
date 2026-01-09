import { AutIDNFT, fetchMetadata, HubNFT } from "@aut-labs/sdk";
import {
  gql,
  NetworkStatus,
  QueryFunctionOptions,
  QueryResult,
  useQuery
} from "@apollo/client";
import { AutIdJoinedHubState } from "@lib/d-aut";
import { useEffect, useMemo, useState } from "react";
import useGetAutIdFilter from "@utils/hooks/useAutIdFilter";
import { useAppDispatch } from "@store/store.model";
import { updateAutState } from "@store/aut/aut.reducer";
import { environment } from "@api/environment";
import { AutOSAutID } from "@api/models/aut.model";
import { AutOSHub } from "@api/models/hub.model";

const fetchAutIDsMetadata = async ({
  id,
  metadataUri,
  joinedHubs
}: any): Promise<AutOSAutID> => {
  let metadata = await fetchMetadata<AutIDNFT>(
    metadataUri,
    environment.ipfsGatewayUrl
  );
  joinedHubs = [...(joinedHubs || [])].map((hub: AutIdJoinedHubState) => ({
    id: hub.id,
    role: hub.role,
    commitment: hub.commitment,
    hubAddress: hub.hubAddress.toLowerCase(),
    isAdmin: false
  }));
  metadata = metadata || ({ properties: {} } as AutIDNFT);
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
};

const fetchHubsAndAutIdsMetadata = async (hubs: any[], autIds: any[]) => {
  return Promise.all([
    ...hubs.map(
      async ({ address, domain, metadataUri, deployer, minCommitment }) => {
        let metadata = await fetchMetadata<HubNFT>(
          metadataUri,
          environment.ipfsGatewayUrl
        );
        metadata = metadata || ({ properties: {} } as HubNFT);
        return new AutOSHub({
          ...metadata,
          properties: {
            ...metadata.properties,
            minCommitment,
            metadataUri,
            deployer,
            members: [],
            address,
            domain
          }
        } as AutOSHub);
      }
    ),
    ...autIds.map(fetchAutIDsMetadata)
  ]);
};

const buildClasses = async (
  selectedAutID: AutOSAutID,
  partialHubs: any[],
  partialAutIds: any[]
) => {
  const hubsAndMembers = await fetchHubsAndAutIdsMetadata(
    partialHubs,
    partialAutIds
  );
  const {
    hubs,
    autIDs
  }: {
    hubs: AutOSHub[];
    autIDs: AutOSAutID[];
  } = hubsAndMembers.reduce(
    (acc, curr) => {
      if (curr instanceof AutOSHub) {
        acc.hubs.push(curr);
      } else if (
        curr instanceof AutOSAutID &&
        curr.properties.address?.toLowerCase() !==
        selectedAutID.properties.address?.toLowerCase()
      ) {
        acc.autIDs.push(curr);
      }
      return acc;
    },
    { hubs: [], autIDs: [] }
  );

  const allAutIDs = [selectedAutID, ...autIDs];
  const allHubs = [...hubs];

  allHubs.forEach((hub) => {
    hub.properties.members = allAutIDs.filter(
      (autID) => !!autID.joinedHub(hub.properties.address)
    );
  });

  allAutIDs.forEach((autID) => {
    autID.properties.hubs = allHubs.filter(
      (hub) => !!hub.isMember(autID.properties.address)
    );
  });
  return { autID: allAutIDs[0], hubs: allHubs, autIDs: allAutIDs };
};
// @ts-ignore
const GET_HUBS_AND_AUTIDS = gql`
  query GetHubsAndAutIds($hub_filter: Hub_filter, $autid_filter: AutID_filter) {
    hubs(skip: 0, first: 100, where: $hub_filter) {
      address
      domain
      deployer
      minCommitment
      metadataUri
    }
    autIDs(skip: 0, first: 100, where: $autid_filter) {
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

const GET_AUTID = gql`
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

const useQueryGetFullAutID = (props: QueryFunctionOptions<any, any> = {}) => {
  const dispatch = useAppDispatch();
  const [fullData, setFullData] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const filter = useGetAutIdFilter();

  const {
    data,
    loading: autIDLoading,
    error: autIDError,
    ...rest
  } = useQuery(GET_AUTID, {
    skip: !filter,
    fetchPolicy: "cache-and-network",
    variables: {
      first: 1,
      skip: 0,
      where: filter
    },
    ...props
  });

  const foundAutID = useMemo(() => {
    return data?.autIDs?.[0];
  }, [data?.autIDs]);

  const joinedHubs = useMemo(() => {
    if (!foundAutID) {
      return [];
    }
    return foundAutID.joinedHubs.map((h) => h.hubAddress);
  }, [foundAutID]);

  const autIdFinishedOk = useMemo(() => {
    return rest.networkStatus === NetworkStatus.ready;
  }, [rest?.networkStatus]);

  const autIdFinishedWithError = useMemo(() => {
    return rest.networkStatus === NetworkStatus.error;
  }, [rest?.networkStatus]);

  const autIdLoadingFinished = useMemo(() => {
    return autIdFinishedOk || autIdFinishedWithError;
  }, [autIdFinishedOk, autIdFinishedWithError]);

  const {
    data: hubsAndMembersData,
    loading: hubsLoading,
    error: hubError,
    ...restHubsAndMembers
  } = useQuery(GET_HUBS_AND_AUTIDS, {
    skip: !joinedHubs?.length,
    fetchPolicy: props?.fetchPolicy ?? "cache-and-network",
    variables: {
      hub_filter: {
        address_in: joinedHubs
      },
      autid_filter: {
        joinedHubs_: {
          hubAddress_in: joinedHubs
        }
      }
    }
  });

  const hubsAndMembersFinishedOk = useMemo(() => {
    return restHubsAndMembers.networkStatus === NetworkStatus.ready;
  }, [restHubsAndMembers?.networkStatus]);

  const hubsAndMembersFinishedWithError = useMemo(() => {
    return restHubsAndMembers.networkStatus === NetworkStatus.error;
  }, [restHubsAndMembers?.networkStatus]);

  const hubsAndMembersLoadingFinished = useMemo(() => {
    return hubsAndMembersFinishedOk || hubsAndMembersFinishedWithError;
  }, [hubsAndMembersFinishedOk, hubsAndMembersFinishedWithError]);

  const hasData = useMemo(() => {
    return foundAutID && hubsAndMembersData?.hubs?.length;
  }, [foundAutID, hubsAndMembersData?.hubs]);

  useEffect(() => {
    const fetchData = async () => {
      if (foundAutID && hubsAndMembersData?.hubs?.length) {
        try {
          setLoadingMetadata(true);
          const autID = await fetchAutIDsMetadata(foundAutID);
          const fullDataResult = await buildClasses(
            autID,
            hubsAndMembersData.hubs,
            hubsAndMembersData.autIDs
          );
          dispatch(updateAutState(fullDataResult));
          setFullData(fullDataResult);
        } catch (e) {
          console.log(e);
        } finally {
          setLoadingMetadata(false);
        }
      }
    };
    fetchData();
  }, [foundAutID, hubsAndMembersData]);

  const error = useMemo(() => {
    return autIDError || hubError;
  }, [autIDError, hubError]);

  const loading = useMemo(() => {
    return (
      !autIdLoadingFinished ||
      !hubsAndMembersLoadingFinished ||
      loadingMetadata ||
      autIDLoading ||
      hubsLoading ||
      (hasData && !fullData)
    );
  }, [
    autIdLoadingFinished,
    hubsAndMembersLoadingFinished,
    loadingMetadata,
    autIDLoading,
    hubsLoading,
    fullData,
    hasData
  ]);

  return {
    data: fullData,
    error,
    loading
  } as QueryResult<{
    autID: AutOSAutID;
    hubs: AutOSHub[];
    autIDs: AutOSAutID[];
  }>;
};

export default useQueryGetFullAutID;
