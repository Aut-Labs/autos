import { FC, useMemo } from "react";
import { Box, Popover, PopoverProps, Typography } from "@mui/material";
import { calculateIS } from "./InteractionMap/misc/is-calculator";

interface LinkStatsPopoverProps {
  type: "anchor" | "custom";
  anchorEl?: HTMLElement | null;
  anchorPos?: { x: number; y: number };
  data: any;
  open: boolean;
  handleClose?: any;
  onMouseEnter?: any;
  onMouseLeave?: any;
}

const LinkStatsPopover: FC<LinkStatsPopoverProps> = ({
  type,
  anchorPos = null,
  anchorEl,
  data,
  open,
  handleClose = null,
  onMouseEnter = null,
  onMouseLeave = null
}: LinkStatsPopoverProps) => {
  const anchorProps: Partial<PopoverProps> =
    type === "anchor"
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

  const { link, centralNode } = useMemo(() => {
    const link = data?.link;
    const centralNode = data?.centralNode;
    return { link, centralNode };
  }, [data]);

  const getIsStrength = useMemo(() => {
    return calculateIS(data?.source, data?.target, centralNode) || 0;
  }, [data, centralNode]);

  if (!link || !centralNode) {
    return null;
  }

  return (
    <Popover
      open={open}
      hideBackdrop
      onClose={handleClose}
      {...anchorProps}
      onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
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
          width: "180px",
          height: "126px",
          background: "#2F3746",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "visible",
          pointerEvents: "auto"
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
          variant="subtitle2"
          color="white"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "90%",
            display: "block"
          }}
        >
          {link?.source?.name || link?.source?.username || "Name"}
        </Typography>
        <Box
          sx={{
            transform: "rotate(90deg)",
            color: "#A7B1C4",
            width: "100%",
            textAlign: "center",
            fontSize: "24px"
          }}
        >{`->`}</Box>
        <Typography
          fontFamily="FractulAltBold"
          fontWeight="900"
          variant="subtitle2"
          color="white"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "90%",
            display: "block"
          }}
        >
          {link?.target?.name || link?.target?.username || "Name"}
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
          {`IS: ${getIsStrength.toFixed(2)}%`}
        </Typography>
      </Box>
    </Popover>
  );
};

export default LinkStatsPopover;
