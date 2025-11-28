import { Box, Typography } from "@mui/material";
import AutLoading from "../AutLoading";
import DialogWrapper from "./DialogWrapper";

const LoadingDialog = ({
  open,
  message = null,
  fullScreen = false,
  backdropFilter = false
}: any) => {
  return (
    <DialogWrapper
      open={open}
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
        {message && (
          <Box>
            <Typography
              sx={{
                textAlign: "center",
                mt: 2
              }}
              component="div"
              color="offWhite.main"
              variant="subtitle1"
            >
              {message}
            </Typography>
          </Box>
        )}
        <Box
          style={{
            flex: 1
          }}
        >
          <AutLoading />
        </Box>
      </div>
    </DialogWrapper>
  );
};

export default LoadingDialog;
