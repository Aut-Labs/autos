import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { isAddress } from "viem";

interface AutIdFilterResponse {
  address?: string;
  username?: string;
}

const useGetAutIdFilter = () => {
  const params = useParams<{
    autAddress: string;
  }>();

  const filter = useMemo(() => {
    if (!params?.autAddress) {
      return null;
    }
    if (isAddress(params?.autAddress)) {
      return { address: params.autAddress };
    }
    return { username: params.autAddress };
  }, [params?.autAddress]);

  return filter as AutIdFilterResponse;
};

export default useGetAutIdFilter;
