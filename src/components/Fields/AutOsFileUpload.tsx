import {
  Avatar,
  Box,
  SvgIcon,
  Typography,
  styled,
  useTheme
} from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const UploadWrapper = styled(Box)(({ theme, color }) => {
  return {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: "100px"
  };
});

const Action = styled("div")(({ theme, color }) => ({
  opacity: 0,
  "&.show": {
    opacity: 1
  },
  width: "100%",
  height: "100%",
  position: "absolute",
  display: "flex",
  top: 0,
  left: 0,
  alignItems: "center",
  justifyContent: "center",
  transition: theme.transitions.create(["opacity", "transform"]),
  ".MuiAvatar-fallback": {
    fill: theme.palette[color].dark
  },
  ".MuiSvgIcon-root": {
    width: "1.2em",
    height: "1.2em",
    "&.remove": {
      color: theme.palette.error.main
    },
    "&.upload": {
      fill: theme.palette.primary.main
    }
  }
}));

const AutOsFileUpload = ({
  fileChange = (file: File) => null,
  initialPreviewUrl = null,
  color = null
}) => {
  const [preview, setPreview] = useState(initialPreviewUrl);
  const [showAction, setShowAction] = useState(false);
  const theme = useTheme();
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    multiple: false,
    noKeyboard: true,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"]
    },
    onDrop: ([file]) => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      fileChange(file);
    }
  });

  const handleActionClick = () => {
    if (preview) {
      setPreview(null);
      fileChange(null);
    } else {
      open();
    }
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    fileChange(null);
  };

  const handleAddAvatar = () => {
    open();
  };

  const toggleActions = (show: boolean) => {
    setShowAction(show);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <UploadWrapper color={color}>
        <Avatar
          alt="Avatar"
          variant="rounded"
          src={preview}
          sx={{
            cursor: "pointer",
            background: "transparent",
            height: "64px",
            width: "64px",
            borderRadius: "100px",
            border: "1px solid white",
            "&.MuiAvatar-root": {
              justifyContent: "center"
            }
          }}
          imgProps={{
            style: {
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "cover"
            }
          }}
        ></Avatar>
      </UploadWrapper>

      <Box
        onClick={handleAddAvatar}
        sx={{ cursor: "pointer", ml: theme.spacing(2) }}
      >
        <Typography color="offWhite.main" fontSize="16px">
          Upload new Photo
        </Typography>
      </Box>
      {preview && (
        <Box
          onClick={handleRemoveAvatar}
          sx={{ cursor: "pointer", ml: theme.spacing(2) }}
        >
          <Typography color="red" fontSize="16px">
            Remove Existing
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AutOsFileUpload;
