import {
  Dialog,
  DialogContent,
  styled,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton
} from "react-share";
import { pxToRem } from "@utils/text-size";
import { AutButton } from "@components/AutButton";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ClipboardCopy from "@utils/clipboard-copy";

export interface SimpleDialogProps {
  title: string;
  url: string;
  description?: React.ReactElement;
  open?: boolean;
  onClose?: () => void;
  twitterProps?: any;
  linkedinProps?: any;
  telegramProps?: any;
  hideCloseBtn?: boolean;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    ".MuiPaper-root": {
      margin: "0",
      // opacity: '0.8',
      border: "none"
    }
  }
}));

const AutShare = (props: SimpleDialogProps) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const {
    onClose,
    title,
    description,
    url,
    twitterProps,
    linkedinProps,
    telegramProps,
    hideCloseBtn
  } = props;
  return (
    <div
      style={{
        width: desktop ? pxToRem(700) : "100%",
        minHeight: desktop ? pxToRem(400) : "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        borderWidth: desktop ? "5px" : "0px",
        backgroundColor: "#141414",

        borderColor: "#439EDD",
        borderStyle: "solid",
        padding: pxToRem(50)
      }}
    >
      {!hideCloseBtn && (
        <CloseIcon
          onClick={onClose}
          sx={{
            position: "absolute",
            cursor: "pointer",
            top: 8,
            right: 8,
            color: "white",
            width: "25px",
            height: "25px"
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          height: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            flex: 1,
            width: "100%",
            padding: pxToRem(30)
          }}
        >
          <Typography
            sx={{ textAlign: "center", mt: "20px", mb: pxToRem(50) }}
            color="white"
            component="span"
            fontSize={pxToRem(40)}
          >
            {title}
          </Typography>
          <div
            className="links"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "330px",
              margin: "10px auto 0 auto"
            }}
          >
            <LinkedinShareButton
              url={url}
              className="social-button"
              {...linkedinProps}
            >
              <LinkedInIcon
                sx={{
                  width: "85px",
                  height: "85px",
                  color: "white"
                }}
              />
            </LinkedinShareButton>
            <TelegramShareButton
              url={url}
              className="social-button"
              {...telegramProps}
            >
              <TelegramIcon
                sx={{
                  width: "85px",
                  height: "85px",
                  color: "white"
                }}
              />
            </TelegramShareButton>
            <TwitterShareButton
              url={url}
              className="social-button"
              {...twitterProps}
            >
              <TwitterIcon
                sx={{
                  width: "85px",
                  height: "85px",
                  color: "white"
                }}
              />
            </TwitterShareButton>
          </div>
          <div
            className="copy-link"
            style={{
              width: "330px",
              margin: "20px auto 0 auto"
            }}
          >
            <Typography
              sx={{
                marginTop: "20px",
                marginBottom: "8px"
              }}
              color="white"
              fontSize={pxToRem(18)}
            >
              Copy link
            </Typography>
            <ClipboardCopy url={url} />
          </div>
        </div>
      </div>
    </div>
  );
};

export function AutShareDialog(props: SimpleDialogProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={props.onClose}
      open={props.open}
      BackdropProps={{ style: { backdropFilter: "blur(5px)" } }}
    >
      <DialogContent
        sx={{
          border: 0,
          padding: 0
        }}
      >
        <AutShare {...props} />
      </DialogContent>
    </AutStyledDialog>
  );
}

export default AutShare;
