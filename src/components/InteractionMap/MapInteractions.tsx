import { AutOsButton } from "@components/AutButton";
import {
  Badge,
  BadgeProps,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Tooltip,
  Typography
} from "@mui/material";
import { memo } from "react";
import { PLConfig } from "./misc/pl-generator";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PeopleIcon from "@mui/icons-material/People";

interface MapInteractionProps {
  pLevels: PLConfig[];
  totalMembers: number;
  setHighlightedPl: (level: number) => void;
  openInteractionsModal: () => void;
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0"
  }
}));

const MapInteractions = ({
  pLevels,
  totalMembers,
  setHighlightedPl,
  openInteractionsModal
}: MapInteractionProps) => {
  return (
    <Box>
      <Box
        sx={{
          borderRadius: "8px",
          p: 1,
          overflow: "hidden",
          position: "absolute",
          // minWidth: "200px",
          top: "0",
          right: "0",
          boxShadow: 2,
          background: "rgba(240, 245, 255, 0.05)",
          backdropFilter: "blur(12px)",
          zIndex: 10
        }}
      >
        <List
          sx={{
            py: 0
          }}
        >
          {pLevels.map(({ level, name, description, members }) => {
            return (
              <ListItem
                key={`pl-${level}`}
                disablePadding
                onMouseEnter={() => totalMembers > 2 && setHighlightedPl(level)}
                onMouseLeave={() => setHighlightedPl(null)}
              >
                <ListItemButton
                  sx={{
                    pt: 0
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      sx: {
                        display: "flex"
                      }
                    }}
                    primary={
                      <>
                        <StyledBadge
                          badgeContent={
                            <Tooltip title={description}>
                              <HelpOutlineIcon
                                color="primary"
                                sx={{ width: "12px", ml: 1 }}
                              />
                            </Tooltip>
                          }
                        >
                          <Typography
                            color="white"
                            textAlign="center"
                            variant="subtitle2"
                          >
                            {name}
                          </Typography>
                        </StyledBadge>
                      </>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center"
                          }}
                          variant="caption"
                          display="block"
                          color="white"
                        >
                          <PeopleIcon
                            sx={{
                              fontSize: "12px",
                              mr: 0.5
                            }}
                          />
                          Members: {members?.length || 0}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pb: 1
          }}
        >
          <AutOsButton
            onClick={() => openInteractionsModal()}
            type="button"
            color="primary"
            size="small"
            variant="outlined"
            sx={{
              width: "180px",
              "&.MuiButton-root": {
                background: "transparent",
                border: "1px solid #A7B1C4"
              }
            }}
          >
            <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
              Interactions
            </Typography>
          </AutOsButton>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(MapInteractions);
