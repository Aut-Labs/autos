import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import AutSDK, { Hub } from "@aut-labs/sdk";
import { SelectedAutID, SelectedHubAddress } from "@store/aut/aut.reducer";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useWalletConnector } from "@lib/connector";
import { AutOSAutID } from "@api/models/aut.model";

export interface HubPeriodData {
  hub: string;
  who: string;
  periodId: number;
  startDate: Date;
  endDate: Date;
  pointsGiven: number;
  score: number;
  performance: number;
  expectedPoints: number;
}

const fetchHubPeriodData = async (
  hubAddress: string,
  who: string,
  autID: AutOSAutID
): Promise<HubPeriodData> => {
  const sdk = await AutSDK.getInstance();
  const hubService: Hub = sdk.initService<Hub>(Hub, hubAddress);
  const taskManager = await hubService.getTaskManager();
  const participationScore = await hubService.getParticipationScoreFactory();
  const periodId = await taskManager.functions.currentPeriodId();
  const selectedHub = autID.joinedHub(hubAddress);

  const [startDate, endDate, pointsGiven, participation, expectedPoints] =
    await Promise.all([
      taskManager.functions.currentPeriodStart(),
      taskManager.functions.currentPeriodEnd(),
      taskManager.functions.getMemberPointsGiven(who, Number(periodId)),
      participationScore.functions.memberActivities(who, Number(periodId)), // {participationScore: number; performance: number}
      participationScore.functions.calcExpectedContributionPoints(
        +selectedHub.commitment,
        Number(periodId)
      )
    ]);

  return {
    hub: hubAddress,
    who,
    periodId: Number(periodId),
    startDate: new Date(Number(startDate) * 1000),
    endDate: new Date(Number(endDate) * 1000),
    pointsGiven: Number(pointsGiven),
    score: Number(participation.participationScore) || 100,
    performance: Number(participation.performance),
    expectedPoints: Number(expectedPoints)
  };
};

const useQueryHubPeriod = (address?: any) => {

  const selectedHubAddress = useSelector(SelectedHubAddress);
  const autID = useSelector(SelectedAutID);
  const { state } = useWalletConnector();
  const { hubAddress: _hubAddress } = useParams<{ hubAddress: string }>();

  const hubAddress = useMemo(() => {
    return selectedHubAddress || _hubAddress || address;
  }, [_hubAddress, selectedHubAddress, address]);

  const {
    data: periodData,
    isLoading: loadingMetadata,
    error
  } = useQuery<HubPeriodData>({
    queryKey: ["hubPeriodData", hubAddress],
    queryFn: () => fetchHubPeriodData(hubAddress, state.address, autID),
    enabled: !!hubAddress && !!state?.address
  });

  return {
    data: periodData,
    loading: loadingMetadata,
    error
  };
};

export default useQueryHubPeriod;
