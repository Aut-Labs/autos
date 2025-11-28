import { AutOSAutID } from "@api/models/aut.model";
import { Box, Button, Popover, PopoverProps, Typography } from "@mui/material";
import { updateAutState } from "@store/aut/aut.reducer";
import { useAppDispatch } from "@store/store.model";
import { useNavigate } from "react-router-dom";

interface FollowPopoverProps {
  type: "anchor" | "custom";
  anchorEl?: HTMLElement | null;
  anchorPos?: { x: number; y: number };
  data: AutOSAutID;
  open: boolean;
  handleClose?: any;
  onMouseEnter?: any;
  onMouseLeave?: any;
  onView?: any;
}

export const FollowPopover = ({
  type,
  anchorPos = null,
  anchorEl,
  data,
  open,
  handleClose = null,
  onMouseEnter = null,
  onMouseLeave = null
}: FollowPopoverProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const anchorProps: Partial<PopoverProps> =
    type == "anchor"
      ? {
          anchorEl,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        }
      : {
          anchorReference: "anchorPosition",
          transformOrigin: {
            vertical: "top",
            horizontal: "center"
          },
          anchorPosition: {
            left: anchorPos?.x || 0,
            top: anchorPos?.y || 0
          }
        };

  return (
    <Popover
      open={open}
      hideBackdrop
      onClose={handleClose}
      {...anchorProps}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      slotProps={{
        root: {
          style: {
            background: "transparent",
            width: "200px",
            height: "200px",
            overflow: "visible"
          }
        }
      }}
      PaperProps={{
        style: {
          borderRadius: "16px",
          width: "145px",
          height: "126px",
          background: "#2F3746",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "visible"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "4px",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <Typography
          fontFamily="FractulAltBold"
          fontWeight="900"
          variant="subtitle1"
          color="white"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "80%",
            display: "block"
          }}
        >
          {data?.name || "Name"}
        </Typography>
        <Typography
          fontWeight="400"
          fontFamily="FractulAltLight"
          variant="body"
          sx={{
            color: "#A7B1C4",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "90%",
            display: "block"
          }}
        >
          @{data?.name || "Unknown"}
        </Typography>
      </Box>
      <Box>
        <Button
          onClick={async () => {
            await dispatch(updateAutState({ autID: data }));
            navigate({
              pathname: `/${data?.name}`
            });
          }}
          sx={{
            mx: 0.5,
            mb: 0.5,
            width: "calc(100% - 0.5rem)",
            borderRadius: "8px",
            height: "40px",
            background: "#576176",
            "&:hover": {
              background: "#818CA2"
            }
          }}
        >
          <Typography
            fontFamily="FractulAltBold"
            fontWeight="900"
            variant="subtitle2"
            color="white"
          >
            View
          </Typography>
        </Button>
      </Box>
    </Popover>
  );
};
