import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "transparent",
    boxShadow: "none",
    width: "50%",
    height: "70%",
    border: "none",
    outline: "none",
    [theme.breakpoints.down("md")]: {
      width: "60%",
      height: "70%"
    }
  }
}));

const StyledImage = styled("img")(({ theme }) => ({
  height: "80%",
  [theme.breakpoints.down("md")]: {
    height: "60%"
  }
}));

const AutBadge2DDialog = ({ open, onClose, url }) => {
  return (
    <StyledDialog
      onClick={onClose}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }
      }}
    >
      {/* <CloseIcon
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
      /> */}
      <StyledImage src={url}></StyledImage>
    </StyledDialog>
  );
};

export default AutBadge2DDialog;
