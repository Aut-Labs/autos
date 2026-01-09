import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch } from "@store/store.model";
import { Init } from "@lib/d-aut";
import { useSelector } from "react-redux";
import {
  NetworksConfig,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { debounce } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { EnvMode, environment } from "@api/environment";
import AutSDK, { MultiSigner } from "@aut-labs/sdk";
import { NetworkConfig } from "@api/models/network.config";
import { useAutConnector } from "@lib/connector";
import axios from "axios";
import { extractDomain } from "@utils/helpers";
import { AutOSAutID } from "@api/models/aut.model";

function DAutConnect({
  setLoading
}: {
  setLoading: (loading: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const networks = useSelector(NetworksConfig);
  const dAutInitialized = useRef<boolean>(false);
  const {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    setStateChangeCallback,
    multiSigner,
    connectors,
    multiSignerId,
    chainId,
    status,
    address
  } = useAutConnector();

  const onAutInit = async () => {
    setLoading(false);
    const [, username] = location.pathname.split("/");
    if (username) {
      navigate({
        pathname: location.pathname
      });
    } else {
      const connetectedAlready = localStorage.getItem("aut-data");
      if (!connetectedAlready) {
        setLoading(false);
      }
      navigate({
        pathname: `/`
      });
    }
  };

  const _parseAutId = async (profile: any): Promise<AutOSAutID> => {
    const autID = new AutOSAutID(profile);
    // const ethDomain = await fetchHolderEthEns(autID.properties.address);
    // autID.properties.ethDomain = ethDomain;
    // autID.properties.hubs = [];
    autID.properties.interactions = [];
    return autID;
  };

  const onAutLogin = async ({ detail }: any) => {
    const profile = JSON.parse(JSON.stringify(detail));
    const autID = await _parseAutId(profile);

    if (autID.properties.network) {
      const [, username] = location.pathname.split("/");

      // if (username === autID.name) {
      //   await dispatch(
      //     updateAutState({
      //       // autID: autID,
      //       // selectedAutAddress: autID.properties.address,
      //       fetchStatus: ResultState.Success,
      //       status: ResultState.Idle
      //     })
      //   );
      // }

      setLoading(false);
    }
  };

  const onDisconnected = () => {
    localStorage.removeItem("interactions-api-jwt");
    const [, username] = window.location.pathname.split("/");
    const params = new URLSearchParams(window.location.search);
    if (username) {
      navigate({
        pathname: `/${username}`
      });
    } else {
      params.delete("network");
      navigate({
        pathname: `/`
      });
    }
  };

  const onAutMenuProfile = async () => {
    const profile = JSON.parse(localStorage.getItem("aut-data"));
    const autID = await _parseAutId(profile);

    // await dispatch(
    //   updateAutState({
    //     // autID: autID,
    //     // selectedAutIDAddress: autID.properties.address,
    //     fetchStatus: ResultState.Success,
    //     status: ResultState.Idle
    //   })
    // );

    navigate({
      pathname: `/${autID.name}`
    });
  };

  const initialiseSDK = async (
    network: NetworkConfig,
    multiSigner: MultiSigner
  ) => {
    const sdk = await AutSDK.getInstance(false);
    const itemsToUpdate = {
      selectedNetwork: network
    };
    await dispatch(updateWalletProviderState(itemsToUpdate));
    await sdk.init(multiSigner, {
      hubRegistryAddress: network.contracts.hubRegistryAddress,
      autIDAddress: network.contracts.autIDAddress
    });
  };

  useEffect(() => {
    if (multiSignerId && Array.isArray(networks) && networks.length > 0) {
      let network = networks.find((d) => d.chainId === chainId);
      if (!network) {
        network = networks.filter((d) => !d.disabled)[0];
      }
      if (network) {
        initialiseSDK(network, multiSigner);
      }
    }
  }, [multiSignerId, networks, chainId, multiSigner]);

  async function connectInterceptor(c) {
    const newState = await connect(c);

    if (!newState) return;

    if (environment.interactionsApiUrl == "NOT_SET") {
      return newState;
    }

    const { signer } = newState.multiSigner ?? multiSigner;
    const message = {
      timestamp: Math.floor(Date.now() / 1000), // Subtract one hour (3600 seconds)
      signer: newState.address,
      domain: extractDomain(environment.interactionsApiUrl)
    };
    const signature = await signer.signMessage(JSON.stringify(message));

    const response = await axios.post(
      `${environment.interactionsApiUrl}/auth/token`,
      { message, signature }
    );
    const data = await response.data;
    localStorage.setItem("interactions-api-jwt", data.token);

    return newState;
  }

  useEffect(() => {
    window.addEventListener("aut_profile", onAutMenuProfile);
    window.addEventListener("aut-onDisconnected", onDisconnected);
    if (!dAutInitialized.current && multiSignerId) {
      window.addEventListener("aut-Init", onAutInit);
      window.addEventListener("aut-onConnected", onAutLogin);
      dAutInitialized.current = true;

      const config: any = {
        defaultText: "Connect Wallet",
        textAlignment: "right",
        menuTextAlignment: "left",
        theme: {
          color: "offWhite",
          type: "main"
        },
        size: {
          width: 220,
          height: 45,
          padding: 3
        }
      };
      Init({
        config,
        envConfig: {
          API_URL: environment.apiUrl,
          GRAPH_API_URL: environment.graphApiUrl,
          IPFS_API_KEY: environment.ipfsApiKey,
          IPFS_API_SECRET: environment.ipfsApiSecret,
          IPFS_GATEWAY_URL: environment.ipfsGatewayUrl,
          ENV: environment.env as EnvMode
        },
        connector: {
          connect: connectInterceptor,
          disconnect,
          setStateChangeCallback,
          connectors,
          networks,
          state: {
            chainId,
            multiSignerId,
            multiSigner,
            isConnected,
            isConnecting,
            status,
            address
          }
        }
      });
    }

    return () => {
      window.removeEventListener("aut_profile", onAutMenuProfile);
      window.removeEventListener("aut-Init", onAutInit);
      window.removeEventListener("aut-onConnected", onAutLogin);
      window.removeEventListener("aut-onDisconnected", onAutLogin);
    };
  }, [dAutInitialized, multiSignerId]);

  const [flowMode, setFlowMode] = useState<string>('signup'); // Default to signup

  useEffect(() => {
    const checkAutIDExistence = async () => {
      if (address) {
        const { hasAutID } = await import('@utils/autid-checker');
        const hasID = await hasAutID(address);
        setFlowMode(hasID ? 'signin' : 'signup');
      }
    };
    checkAutIDExistence();
  }, [address]);

  return (
    <>
      <d-aut
        style={{
          display: "none",
          position: "absolute",
          zIndex: 999
        }}
        use-dev={environment.env == EnvMode.Development}
        id="d-aut"
        menu-items='[{"name":"Profile","actionType":"event_emit","eventName":"aut_profile"}]'
        flow-config={`{"mode" : "${flowMode}", "customCongratsMessage": ""}`}
        ipfs-gateway={environment.ipfsGatewayUrl}
      />
    </>
  );
}

export const DautPlaceholder = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let dautEl: HTMLElement = document.querySelector("#d-aut");
    dautEl.style.display = "none";
    dautEl.style.left = "0";
    dautEl.style.top = "0";
    const updateDautPosition = () => {
      if (!dautEl) {
        dautEl = document.querySelector("#d-aut");
      }
      if (!dautEl || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      dautEl.style.left = `${rect.left}px`;
      dautEl.style.top = `${rect.top}px`;
      dautEl.style.display = "inherit";
    };
    const debounceFn = debounce(updateDautPosition, 10);
    window.addEventListener("resize", debounceFn);
    debounceFn();
    return () => {
      window.removeEventListener("resize", debounceFn);
      dautEl.style.display = "none";
    };
  }, [ref.current]);

  return (
    <div
      ref={ref}
      style={{
        width: "220px",
        height: "45px",
        position: "relative",
        zIndex: -1
      }}
      className="web-component-placeholder"
    />
  );
});

export default DAutConnect;
