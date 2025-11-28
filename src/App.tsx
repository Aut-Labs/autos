import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { updateWalletProviderState } from "@store/WalletProvider/WalletProvider";
import useQueryTaskTypes from "@utils/hooks/useQueryTaskTypes";
import AutLoading from "@components/AutLoading";
import Web3DautConnect from "@components/DAutConnect";
import SWSnackbar from "./components/snackbar";
import { environment } from "@api/environment";
import { getAppConfig } from "@api/aut.api";
import AutSDK from "@aut-labs/sdk";
import "./App.scss";

const AutID = lazy(() => import("./pages/AutID"));
const Callback = lazy(() => import("./pages/Oauth2/Callback"));
const AutHome = lazy(() => import("./pages/AutHome"));

function App() {
  const dispatch = useAppDispatch();
  const [appLoading, setAppLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const { refetch } = useQueryTaskTypes({
    variables: {
      skip: 0,
      take: 1000
    }
  });

  useEffect(() => {
    getAppConfig()
      .then(async (networks) => {
        dispatch(
          updateWalletProviderState({
            networksConfig: networks
          })
        );
        const sdk = new AutSDK({
          ipfs: {
            apiKey: environment.ipfsApiKey,
            secretApiKey: environment.ipfsApiSecret,
            gatewayUrl: environment.ipfsGatewayUrl
          }
        });
      })
      .finally(() => setAppLoading(false));
  }, []);

  const scrollHeight = useMemo(() => {
    if (mobile) {
      return `${window?.innerHeight}px`;
    }
    return "100%";
  }, [mobile, window?.innerHeight]);

  return (
    <>
      {appLoading ? (
        <AutLoading />
      ) : (
        <>
          <Web3DautConnect setLoading={setLoading} />
          <SWSnackbar />
          <Box
            sx={{
              height: scrollHeight
            }}
          >
            {isLoading ? (
              <AutLoading />
            ) : (
              <Suspense fallback={<AutLoading />}>
                <Routes>
                  <Route path="/" element={<AutHome />} />
                  <Route path="callback" element={<Callback />} />
                  <Route path="/:autAddress/*" element={<AutID />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            )}
          </Box>
        </>
      )}
    </>
  );
}

export default App;
