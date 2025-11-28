import { Button, Typography } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import DialogWrapper from "./DialogWrapper";
import { AutOsButton } from "@components/AutButton";

const ErrorDialog = ({
  height,
  width,
  open,
  hasRetry = false,
  handleClose,
  subtitle,
  message,
  fullScreen = false
}: any) => {
  return (
    <DialogWrapper
      open={open}
      height={height}
      width={width}
      fullScreen={fullScreen}
      actions={
        <AutOsButton
          onClick={() => handleClose("close")}
          type="button"
          color="primary"
          variant="outlined"
          sx={{
            width: "100px"
          }}
        >
          <Typography fontWeight="normal" fontSize="16px" lineHeight="26px">
            Dismiss
          </Typography>
        </AutOsButton>
      }
    >
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}
      >
        <Typography
          sx={{ color: "red", textAlign: "center", mt: 2 }}
          component="div"
          variant="subtitle2"
        >
          {message}
        </Typography>
        <Typography
          sx={{
            color: "offWhite.main",
            textAlign: "center",
            mt: 2
          }}
          component="div"
          variant="body1"
        >
          {subtitle}
        </Typography>
      </div>
    </DialogWrapper>
  );
};

export default ErrorDialog;
