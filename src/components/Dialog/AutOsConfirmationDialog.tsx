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
import { useAppDispatch } from "@store/store.model";
import { useState } from "react";
import { editCommitment } from "@api/data.api";
import { setOpenCommitment } from "@store/ui-reducer";
import { AutOsButton } from "@components/AutButton";

export interface ConfirmDialogProps {
  title: string;
  open: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  hideCloseBtn?: boolean;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "420px",
    height: "420px",
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

export function AutConfirmDialog(props: ConfirmDialogProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
      open={props.open}
    >
      <DialogContent
        sx={{
          border: 0,
          padding: "0px 30px",
          mt: {
            xs: "64px",
            md: "0"
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%"
            }}
          >
            <Typography
              variant="subtitle1"
              color="offWhite.main"
              fontWeight="bold"
            >
              {props?.title}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "flex-start",
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
            Cancel
          </Typography>
        </AutOsButton>
        <AutOsButton
          onClick={props.onSubmit}
          type="button"
          color="primary"
          variant="outlined"
          sx={{
            width: "100px"
          }}
        >
          <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
            Confirm
          </Typography>
        </AutOsButton>
      </DialogActions>
    </AutStyledDialog>
  );
}
