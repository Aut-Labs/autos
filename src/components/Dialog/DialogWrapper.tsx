import {
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  useTheme,
  IconButton,
  styled
} from "@mui/material";
import { pxToRem } from "@utils/text-size";
import CloseIcon from "@mui/icons-material/Close";
import { he } from "date-fns/locale";

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    border: "none",
    backgroundColor: "#1E2430",
    width: "420px",
    height: "420px",
    borderRadius: "30px",
    ".MuiDialogContent-root": {
      width: "100%",
      height: "100%"
    },
    boxShadow:
      "0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)"
  },
  [theme.breakpoints.down("md")]: {
    ".MuiPaper-root": {
      margin: "0",
      height: "100%",
      width: "100%",
      border: "none"
    }
  }
}));

export const DialogWrapper = ({
  children,
  actions = null,
  open,
  onClose = null,
  fullScreen = false,
  backdropFilter = false,
  height = "420px",
  width = "420px"
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <AutStyledDialog
      open={open}
      fullScreen={isMobile || fullScreen}
      {...(onClose && {
        onClose
      })}
      sx={{
        backdropFilter: backdropFilter ? "blur(30px)" : "none"
      }}
    >
      <DialogContent
        sx={{
          maxWidth: {
            xs: "100%",
            sm: width
          },
          minWidth: {
            xs: "100%",
            sm: width
          },
          maxHeight: {
            xs: "100%",
            sm: height
          },
          minHeight: {
            xs: "100%",
            sm: height
          },
          padding: {
            xs: "20px"
          },
          display: "flex",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        {!!onClose && (
          <IconButton
            size="small"
            aria-label="close"
            onClick={() => {
              onClose();
            }}
            type="button"
            sx={{
              color: "white",
              position: "absolute",
              right: "15px",
              top: "15px"
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}

        {children}

        {actions && (
          <DialogActions
            sx={{
              backgroundColor: "#1E2430",
              py: "30px",
              justifyContent: "center",
              height: "80px"
            }}
          >
            {actions}
          </DialogActions>
        )}
      </DialogContent>
    </AutStyledDialog>
  );
};

export default DialogWrapper;
