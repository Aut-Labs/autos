import { Box, Typography } from "@mui/material";
import DialogWrapper from "./DialogWrapper";
import AutLoading from "@components/AutLoading";
import AutConfetti from "@components/AutConfetti";

const SuccessDialog = ({
  open,
  handleClose,
  subtitle,
  message,
  backdropFilter = false,
  fullScreen = false
}: any) => {
  return (
    <DialogWrapper
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      backdropFilter={backdropFilter}
    >
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          width: "100%"
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              mt: 2
            }}
            component="div"
            variant="subtitle1"
          >
            {subtitle}
          </Typography>
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              mt: 2
            }}
            component="div"
            variant="body"
          >
            {message}
          </Typography>
        </Box>

        <Box sx={{
          flex: 1
        }}>
          <AutConfetti />
        </Box>
      </div>
    </DialogWrapper>
  );
};

export default SuccessDialog;
