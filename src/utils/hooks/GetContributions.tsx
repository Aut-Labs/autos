import AutSDK, {
  BaseNFTModel,
  fetchMetadata,
  Hub,
  TaskContributionNFT,
  TaskFactoryContract
} from "@aut-labs/sdk";
import {
  gql,
  QueryFunctionOptions,
  QueryResult,
  useQuery
} from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { environment } from "@api/environment";
import { useSelector } from "react-redux";
import { SelectedHubAddress, SelectedHub } from "@store/aut/aut.reducer";
import { TaskType } from "@api/models/task-type";
import { TaskTypes } from "@store/contributions/contributions.reducer";
import { ContributionFactory } from "@api/models/contribution.model";
import { useParams } from "react-router-dom";

const GET_HUB_CONTRIBUTIONS = gql`
  query GetContributions($skip: Int, $first: Int, $where: Contribution_filter) {
    contributions(skip: $skip, first: $first, where: $where) {
      id
      taskId
      role
      startDate
      endDate
      points
      quantity
      uri
    }
  }
`;

const contributionsMetadata = (
  contributions: any[],
  taskFactory: TaskFactoryContract,
  taskTypes: TaskType[]
) => {
  return contributions.map(async (contribution) => {
    let metadata = await fetchMetadata<BaseNFTModel<any>>(
      contribution.uri,
      environment.ipfsGatewayUrl
    );
    metadata = metadata || ({ properties: {} } as BaseNFTModel<any>);
    return ContributionFactory(metadata, contribution, taskTypes);
  });
};

const useQueryContributions = (props: QueryFunctionOptions<any, any> = {}) => {
  const taskTypes = useSelector(TaskTypes);
  const selectedHubAddress = useSelector(SelectedHubAddress);
  const { hubAddress: _hubAddress } = useParams<{ hubAddress: string }>();

  const hubAddress = useMemo(() => {
    return selectedHubAddress || _hubAddress;
  }, [_hubAddress, selectedHubAddress]);
  const { data, loading, ...rest } = useQuery(GET_HUB_CONTRIBUTIONS, {
    skip: !hubAddress && !taskTypes.length,
    fetchPolicy: "cache-and-network",
    variables: {
      ...props.variables,
      where: {
        hubAddress: hubAddress,
        ...(props.variables?.where || {})
      }
    }
    // ...props
  });

  const [contributions, setContributions] = useState<TaskContributionNFT[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  useEffect(() => {
    if (hubAddress && data?.contributions?.length && taskTypes.length) {
      const fetch = async () => {
        const sdk = await AutSDK.getInstance();
        const hubService: Hub = sdk.initService<Hub>(Hub, hubAddress);
        const taskFactory = await hubService.getTaskFactory();
        setLoadingMetadata(true);
        const contributions = await Promise.all(
          contributionsMetadata(data?.contributions, taskFactory, taskTypes)
        );
        setLoadingMetadata(false);
        setContributions(contributions);
      };
      fetch();
    }
  }, [hubAddress, data, taskTypes]);

  return {
    data: contributions || [],
    ...rest,
    loading: loading || loadingMetadata
  } as QueryResult<TaskContributionNFT[]>;
};

export default useQueryContributions;
