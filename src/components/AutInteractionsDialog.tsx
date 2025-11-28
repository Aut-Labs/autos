import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { AutOSCommitmentSlider } from "@theme/commitment-slider-styles";
import { Controller, useForm } from "react-hook-form";
import { AutOsButton } from "./AutButton";
import { useAppDispatch } from "@store/store.model";
import { useState } from "react";
import { editCommitment } from "@api/data.api";
import { setOpenCommitment } from "@store/ui-reducer";
import AutTabs from "./AutTabs";
import AutInteractionTabs from "@components/AutInteractionTabs/AutInteractionTabs";
import { useAutConnector, useWalletConnector } from "@lib/connector";
import axios from "axios";
import { environment } from "@api/environment";

export interface InteractionsDialogProps {
  title: string;
  description?: React.ReactElement;
  open?: boolean;
  onClose?: () => void;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "80%",
    height: "80%",
    border: "none",
    backgroundColor: "#1E2430",
    borderRadius: "30px",
    padding: "30px 0px",
    boxShadow:
      "0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)"
  },
  [theme.breakpoints.down("md")]: {
    ".MuiPaper-root": {
      margin: "0",
      height: "100%",
      width: "100%",
      border: "none",
      borderRadius: "0",
      boxShadow: "none"
    }
  }
}));

export function useBackendJwt() {
  // const [jwt, setJwt] = useState(() => {
  //   const lsValue = window.localStorage.getItem("interactions-api-jwt");
  //   return lsValue;
  // });
  // useEffect(() => {
  //   const handleStorageChange = (e) => {
  //     if (e.key === "interactions-api-jwt") {
  //       setJwt(e.newValue);
  //     }
  //   };
  //   window.addEventListener("storage", handleStorageChange);

  //   // Cleanup function to remove the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   const getJwt = async () => {
  //     const message = {
  //       timestamp: Math.floor(Date.now() / 1000) - 7200, // Subtract one hour (3600 seconds)
  //       signer: "0x7660aa261d27A2A32d4e7e605C1bc2BA515E5f81",
  //       domain: "localhost:5001"
  //     };
  //     const response = await axios.post(
  //       `${environment.interactionsApiUrl}/api/auth/jwt`,
  //       message
  //     );
  //     const data = await response.data;
  //   };

  //   if (!jwt) {
  //     getJwt();
  //   }
  // }, []);

  const {
    state: { multiSigner, address }
  } = useWalletConnector();

  async function doAuthenticatedAction(action) {
    const jwt = window.localStorage.getItem("interactions-api-jwt");
    if (jwt) {
      action(jwt);
    } else {
      const { signer } = multiSigner;
      const message = {
        timestamp: Math.floor(Date.now() / 1000), // Subtract one hour (3600 seconds)
        signer: address,
        domain: "localhost:5001"
      };
      const signature = await signer.signMessage(JSON.stringify(message));

      const response = await axios.post(
        `${environment.interactionsApiUrl}/auth/token`,
        { message, signature }
      );
      const data = await response.data;
      localStorage.setItem("interactions-api-jwt", data.token);

      await action(data.token);
    }
  }

  return { doAuthenticatedAction };
}

export function AutInteractionsDialog(props: InteractionsDialogProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={props.onClose}
      open={props.open}
    >
      <DialogContent
        sx={{
          border: 0,
          padding: "0px 30px",
          mb: theme.spacing(2),
          height: "100%",
          overflow: "hidden"
        }}
      >
        <AutInteractionTabs></AutInteractionTabs>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          width: "100%",
          padding: "0px 30px"
        }}
      >
        <AutOsButton
          onClick={props.onClose}
          type="button"
          color="primary"
          variant="outlined"
          sx={{
            width: "100px",
            "&.MuiButton-root": {
              background: "#2F3746"
            }
          }}
        >
          <Typography fontWeight="normal" fontSize="16px" lineHeight="26px">
            Close
          </Typography>
        </AutOsButton>
      </DialogActions>
    </AutStyledDialog>
  );
}
