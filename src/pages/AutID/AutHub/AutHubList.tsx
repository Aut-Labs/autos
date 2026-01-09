import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import CopyAddress from "@components/CopyAddress";

import {
  Box,
  Link as BtnLink,
  Paper,
  Tooltip,
  styled,
  Avatar,
  Typography,
  useTheme,
  SvgIcon
} from "@mui/material";
import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { SubtitleWithInfo } from "@components/SubtitleWithInfoIcon";
import { AutOSHub } from "@api/models/hub.model";
import { useAccount } from "wagmi";
import {
  CommitmentTemplate,
  RoleName,
  SelectedAutID
} from "@store/aut/aut.reducer";
import { useSelector } from "react-redux";
import { EditContentElements } from "@components/EditContentElements";
import { socialsWithIcons } from "@utils/social-icons";
import { SocialUrls } from "@aut-labs/sdk";
import useQueryHubPeriod from "@utils/hooks/useQueryHubPeriod";

export const HubTopWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "24px",
  borderBottom: "1px solid",
  borderColor: "inherit",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px"
  }
}));
export const HubBottomWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "4fr 4fr 2fr 2fr",
  borderColor: "inherit",

  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "column"
  }
}));

export const PropertiesWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px 8px"
}));

const { IconContainer } = EditContentElements;

const HubListItem = memo(({ row }: { row: AutOSHub }) => {
  const { data: periodData } = useQueryHubPeriod(row?.properties?.address);
  console.log("periodData", periodData);
  const theme = useTheme();
  const { address } = useAccount();
  const autID = useSelector(SelectedAutID);
  console.log("autID", autID);
  const roleName = useSelector(RoleName(row.properties.address));
  const commitmentTemplate = useSelector(
    CommitmentTemplate(row.properties.address)
  );

  const isAddressTheConnectedUser = useMemo(() => {
    return autID.isAutIDOwner(address);
  }, [autID, address]);

  const socials = useMemo(() => {
    return socialsWithIcons(row?.properties?.socials);
  }, [row]);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "#576176",
        transition: theme.transitions.create(["border-color"]),
        ":hover": {
          borderColor: "#14ECEC"
        }
      }}
    >
      <HubTopWrapper
        sx={{
          flexDirection: "row"
        }}
      >
        <Box
          sx={{
            display: "flex"
          }}
        >
          <Avatar
            sx={{
              width: {
                xs: "80px",
                xxl: "80px"
              },
              height: {
                xs: "80px",
                xxl: "80px"
              },
              borderRadius: "6px"
            }}
            aria-label="hub-avatar"
            src={ipfsCIDToHttpUrl(row.image as string)}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column"
              },
              justifyContent: {
                xs: "space-between",
                md: "space-between"
              },
              marginLeft: theme.spacing(3)
            }}
          >
            <Tooltip
              disableHoverListener={!isAddressTheConnectedUser}
              title={isAddressTheConnectedUser ? "View Hub details" : ""}
            >
              <BtnLink
                color="offWhite.main"
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  textDecoration: "none"
                }}
                {...(isAddressTheConnectedUser && {
                  to: `hub/${row.properties.address}`,
                  component: Link
                })}
              >
                {row?.name || "n/a"}
              </BtnLink>
            </Tooltip>
            <CopyAddress address={row.properties.address} />
          </Box>
        </Box>
        <IconContainer>
          {socials.map((social, index) => {
            return (
              <BtnLink
                key={`social-icon-${index}`}
                {...(!!social.link && {
                  component: "a",
                  href: social.link,
                  target: "_blank",
                  sx: {
                    svg: {
                      color: theme.palette.offWhite.main
                    }
                  }
                })}
                {...((!social.link ||
                  social.link === SocialUrls[social.type].prefix) && {
                  sx: {
                    component: "a",
                    pointerEvents: "none",
                    // display: "none",
                    svg: {
                      color: theme.palette.divider
                    }
                  },
                  disabled: true
                })}
              >
                <SvgIcon
                  sx={{
                    height: {
                      xs: "25px",
                      xxl: "30px"
                    },
                    width: {
                      xs: "25px",
                      xxl: "30px"
                    },
                    mr: {
                      xs: "10px",
                      xxl: "15px"
                    }
                  }}
                  key={`socials.${index}.icon`}
                  component={social.Icon}
                />
              </BtnLink>
            );
          })}
        </IconContainer>
      </HubTopWrapper>
      <HubBottomWrapper>
        <PropertiesWrapper
          sx={{
            borderRight: {
              xs: "0",
              md: "1px solid"
            },
            borderBottom: {
              xs: "1px solid",
              md: "0"
            },
            borderRightColor: {
              xs: "transparent",
              md: "inherit"
            },
            borderBottomColor: {
              xs: "inherit",
              md: "transparent"
            }
          }}
        >
          <Typography
            variant="subtitle2"
            color="offWhite.main"
            fontWeight="normal"
          >
            {roleName}
          </Typography>
          <SubtitleWithInfo
            title="role"
            description={
              isAddressTheConnectedUser
                ? "This is your role"
                : `This is ${autID?.name}'s role`
            }
          ></SubtitleWithInfo>
        </PropertiesWrapper>
        <PropertiesWrapper
          sx={{
            borderRight: {
              xs: "0",
              md: "1px solid"
            },
            borderBottom: {
              xs: "1px solid",
              md: "0"
            },
            borderRightColor: {
              xs: "transparent",
              md: "inherit"
            },
            borderBottomColor: {
              xs: "inherit",
              md: "transparent"
            }
          }}
        >
          <Typography
            variant="subtitle2"
            color="offWhite.main"
            fontWeight="normal"
          >
            {commitmentTemplate}
          </Typography>
          <SubtitleWithInfo
            title="commitment"
            description={
              isAddressTheConnectedUser
                ? "This is your commitment"
                : `This is ${autID?.name}'s commitment`
            }
          ></SubtitleWithInfo>
        </PropertiesWrapper>
        <PropertiesWrapper
          sx={{
            borderRight: {
              xs: "0",
              md: "1px solid"
            },
            borderBottom: {
              xs: "1px solid",
              md: "0"
            },
            borderRightColor: {
              xs: "transparent",
              md: "inherit"
            },
            borderBottomColor: {
              xs: "inherit",
              md: "transparent"
            }
          }}
        >
          <Typography
            variant="subtitle2"
            color="offWhite.main"
            fontWeight="normal"
          >
            {periodData?.score || 100}
          </Typography>
          <SubtitleWithInfo
            title="participation score"
            description=""
          // description={
          //   isAddressTheConnectedUser
          //     ? "This is your participation score"
          //     : `This is ${autID?.name}'s participation score`
          // }
          ></SubtitleWithInfo>
        </PropertiesWrapper>
        <PropertiesWrapper sx={{}}>
          <Typography
            variant="subtitle2"
            color="offWhite.main"
            fontWeight="normal"
          >
            {periodData?.pointsGiven || 0}
          </Typography>
          <SubtitleWithInfo
            title="contribution points"
            description=""
          // description={
          //   isAddressTheConnectedUser
          //     ? "These are your contribution points"
          //     : `These are ${autID?.name}'s contribution points`
          // }
          ></SubtitleWithInfo>
        </PropertiesWrapper>
      </HubBottomWrapper>
    </Box>
  );
});

interface TableParamsParams {
  isLoading: boolean;
  hubs: AutOSHub[];
}

const AutHubList = ({ isLoading = false, hubs = [] }: TableParamsParams) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minWidth: {
          sm: "100%"
        },
        width: {
          xs: "100%",
          sm: "unset"
        },
        backgroundColor: "transparent",
        border: "none"
      }}
      component={Paper}
    >
      <Box sx={{ display: "flex", my: theme.spacing(3) }}>
        <Typography color="offWhite.main" variant="h3">
          Hubs
        </Typography>
        <Typography
          color="offWhite.dark"
          variant="h3"
          fontWeight="normal"
          sx={{
            ml: theme.spacing(1)
          }}
        >{`(${hubs.length})`}</Typography>
      </Box>
      <Box
        className="swiper-no-swiping"
        sx={{
          minWidth: {
            xs: "unset",
            lg: "700px"
          },
          display: "grid",
          gap: theme.spacing(2)
        }}
      >
        {hubs?.map((hub, index) => (
          <HubListItem key={`hub-row-${index}`} row={hub} />
        ))}
      </Box>
    </Box>
  );
};

export default memo(AutHubList);
