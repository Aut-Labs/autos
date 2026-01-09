import CalendarCheckIcon from "@assets/autos/calendar-check.svg?react";
import {
  Avatar,
  Box,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Tooltip,
  Typography
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  UpdateErrorMessage,
  updateAutState,
  AutUpdateStatus,
  SelectedAutID
} from "@store/aut/aut.reducer";
import { ResultState } from "@store/result-status";
import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { SelectedNetwork } from "@store/WalletProvider/WalletProvider";
import { EditContentElements } from "@components/EditContentElements";
import CopyAddress from "@components/CopyAddress";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@store/store.model";
import { AutOsButton } from "@components/AutButton";
import { SubtitleWithInfo } from "@components/SubtitleWithInfoIcon";
import { IsEditingProfile, setOpenEditProfile } from "@store/ui-reducer";
import { useAccount } from "wagmi";
import AutEditProfileDialog from "@components/AutEditProfileDialog";
import AutTabs from "@components/AutTabs";
import AutMap from "./AutIDMap";
import PluginList from "./AutPlugins";
import AutID3DBadgeDialog from "./AutIDBadge/AutID3DBadgeDialog";
import AutBadge2DDialog from "./AutIDBadge/2DBadge";
import { socialsWithIcons } from "@utils/social-icons";
import AutHubList from "./AutHub/AutHubList";
import OpenTask from "../Tasks/OpenTask/OpenTask";
import DiscordTask from "../Tasks/DiscordTask/JoinDiscordTask";
import { SocialUrls } from "@aut-labs/sdk";

const { FormWrapper, FollowWrapper, IconContainer } = EditContentElements;

const AutIDProfile = () => {
  const dispatch = useAppDispatch();
  const { connections } = useSelector((state: any) => state.ui);
  const selectedNetwork = useSelector(SelectedNetwork);
  const isEditingProfile = useSelector(IsEditingProfile);
  const [view3DModel, setView3DModel] = useState(false);
  const [viewCard, setViewCard] = useState(false);
  const status = useSelector(AutUpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const { address } = useAccount();
  const autID = useSelector(SelectedAutID);
  const [tabs, setTabs] = useState<any[]>([]);

  const isAddressTheConnectedUser = useMemo(() => {
    return autID.isAutIDOwner(address);
  }, [autID, address]);

  const parsedTimeStamp = useMemo(() => {
    return autID?.properties?.timestamp;
  }, [autID]);

  const blockExplorer = useMemo(() => {
    return selectedNetwork?.explorerUrls?.[0];
  }, [selectedNetwork]);

  const onSubmit = (data: any) => { };

  const { handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: autID?.properties?.avatar,
      bio: autID?.properties?.bio
    }
  });

  const handleDialogClose = () => {
    dispatch(
      updateAutState({
        status: ResultState.Idle
      })
    );
    dispatch(setOpenEditProfile(false));
  };

  const handleClose = () => {
    dispatch(setOpenEditProfile(false));
  };

  const openEditProfileModal = () => {
    dispatch(setOpenEditProfile(true));
  };

  useEffect(() => {
    const tabs = [
      {
        label: "Map",
        key: "map-tab",
        props: {
          hubs: autID.properties.hubs
        },
        component: AutMap
      },
      {
        label: "Hubs",
        // label: (
        //   <>
        //     <Tooltip title="Coming soon!" key="hub-label-tooltip">
        //       <Typography key="hub-label-typography">Hubs 🔒</Typography>
        //     </Tooltip>
        //   </>
        // ),
        disabled: false,
        props: {
          hubs: autID.properties.hubs
        },
        component: AutHubList
      },
      {
        label: "Plugins 🔒",
        // label: (
        //   <Tooltip title="Coming soon!">
        //     <Typography>Plugins 🔒</Typography>
        //   </Tooltip>
        // ),
        disabled: true,
        props: {
          hubs: autID.properties.hubs
        },
        component: PluginList
      }
    ];
    setTabs(tabs);
  }, [autID]);

  const socials = useMemo(() => {
    return socialsWithIcons(autID?.properties?.socials);
  }, [autID]);

  return (
    <>
      <AutEditProfileDialog
        open={isEditingProfile}
        hideCloseBtn={false}
        title="Edit Profile"
        onClose={handleClose}
      />

      {autID.image && typeof autID.image == "string" && (
        <AutID3DBadgeDialog
          open={view3DModel}
          onClose={() => setView3DModel(false)}
          url={ipfsCIDToHttpUrl(autID.image)}
        />
      )}

      <AutBadge2DDialog
        open={viewCard}
        onClose={() => setViewCard(false)}
        url={ipfsCIDToHttpUrl(autID?.image as string)}
      />
      <FormWrapper
        sx={{
          flex: "1",
          flexDirection: "column"
        }}
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ErrorDialog
          handleClose={handleDialogClose}
          open={status === ResultState.Failed}
          message={errorMessage}
        />
        <LoadingDialog
          handleClose={handleDialogClose}
          open={status === ResultState.Loading}
          message="Editing profile..."
        />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row"
            },
            flex: "1",
            gap: {
              xs: "10px",
              md: "30px",
              xxl: "40px"
            }
          }}
        >
          <Box
            sx={{
              minWidth: "400px",
              width: {
                xs: "100%",
                md: "30%"
              },
              marginTop: {
                md: "50px"
              },
              padding: "24px",
              borderRadius: "72px",
              background: "rgba(240, 245, 255, 0.01)",
              backdropFilter: "blur(12px)",
              height: "fit-content",
              flex: 1
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Stack>
                <Stack
                  sx={{
                    position: "relative"
                  }}
                >
                  <Avatar
                    sx={{
                      height: {
                        xs: "150px",
                        md: "160px",
                        xxl: "160px"
                      },
                      width: {
                        xs: "150px",
                        md: "160px",
                        xxl: "160px"
                      },
                      borderRadius: "50%"
                    }}
                    aria-label="avatar"
                    src={ipfsCIDToHttpUrl(
                      autID?.properties?.thumbnailAvatar as string
                    )}
                  />
                  {autID?.image && typeof autID.image == "string" && (
                    <Box
                      onClick={() => setView3DModel(true)}
                      sx={{
                        position: "absolute",
                        cursor: "pointer",
                        bottom: "-20px",
                        left: "100px",
                        transform: "rotate(7deg)",
                        height: {
                          xs: "130px",
                          md: "140px",
                          xxl: "140px"
                        }
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain"
                        }}
                        aria-label="card"
                        src={ipfsCIDToHttpUrl(autID?.image as string)}
                      />
                    </Box>
                  )}
                </Stack>

                <Stack
                  sx={{
                    marginTop: 3
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start"
                      }}
                    >
                      <Typography
                        color="offWhite.main"
                        textAlign="left"
                        lineHeight={1}
                        variant="h2"
                      >
                        {autID.name}{" "}
                      </Typography>
                    </div>

                    <Stack
                      sx={{
                        marginTop: 3
                      }}
                      direction="row"
                      alignItems="center"
                    >
                      <CopyAddress address={autID?.properties?.address} />
                      {selectedNetwork?.name && (
                        <Tooltip title={`Explore in ${selectedNetwork?.name}`}>
                          <IconButton
                            sx={{ p: 0, ml: 1 }}
                            href={`${blockExplorer}/address/${autID?.properties?.address}`}
                            target="_blank"
                            color="offWhite"
                          >
                            <OpenInNewIcon
                              sx={{ cursor: "pointer", width: "20px" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      {isAddressTheConnectedUser && (
                        <AutOsButton
                          onClick={openEditProfileModal}
                          type="button"
                          color="primary"
                          variant="outlined"
                          sx={{
                            ml: 3
                          }}
                        >
                          <Typography
                            fontWeight="700"
                            fontSize="16px"
                            lineHeight="26px"
                          >
                            Edit Profile
                          </Typography>
                        </AutOsButton>
                      )}
                    </Stack>
                  </div>
                </Stack>

                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                    marginTop: 3
                  }}
                >
                  <FollowWrapper>
                    <Typography
                      variant="subtitle1"
                      color="offWhite.main"
                      fontSize="24px"
                      fontWeight="bold"
                    >
                      100
                    </Typography>
                    <SubtitleWithInfo
                      title="reputation"
                      description={
                        isAddressTheConnectedUser
                          ? "This is your reputation"
                          : `This is ${autID?.name}'s reputation`
                      }
                    ></SubtitleWithInfo>
                  </FollowWrapper>
                  <FollowWrapper>
                    <Typography
                      variant="subtitle1"
                      fontSize="24px"
                      color="offWhite.main"
                      fontWeight="bold"
                    >
                      {connections}
                    </Typography>
                    <SubtitleWithInfo
                      title="connections"
                      description={null}
                    ></SubtitleWithInfo>
                  </FollowWrapper>
                </Stack>

                <Box
                  sx={{
                    marginTop: 2
                  }}
                >
                  <Box sx={{ padding: "16.5px 0px" }}>
                    <Typography
                      color="offWhite.main"
                      textAlign="left"
                      variant="body"
                    >
                      {autID?.properties?.bio || "No bio yet..."}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    marginTop: 2
                  }}
                >
                  <IconContainer>
                    {socials.map((social, index) => {
                      return (
                        <Link
                          key={`social-icon-${index}`}
                          {...(!!social.link && {
                            component: "a",
                            href: social.link,
                            target: "_blank",
                            sx: {
                              svg: {
                                color: (theme) => theme.palette.offWhite.main
                              }
                            }
                          })}
                          {...((!social.link ||
                            social.link === SocialUrls[social.type].prefix) && {
                            sx: {
                              display: "none",
                              svg: {
                                color: (theme) => theme.palette.divider
                              }
                            },
                            component: "button",
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
                        </Link>
                      );
                    })}
                  </IconContainer>
                </Box>
                <Box
                  sx={{
                    marginTop: 2,
                    display: "flex"
                  }}
                >
                  <SvgIcon
                    sx={{
                      height: {
                        xs: "20px",
                        xxl: "20px"
                      },
                      width: {
                        xs: "20px",
                        xxl: "20px"
                      },
                      fill: "transparent"
                    }}
                    key={"joined-on"}
                    component={CalendarCheckIcon}
                  />
                  <Typography
                    color="offWhite.main"
                    textAlign="left"
                    variant="caption"
                  >
                    {`Joined ${parsedTimeStamp}`}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "70%"
              }
            }}
          >
            <AutTabs tabs={tabs} />
          </Box>
        </Box>
      </FormWrapper>
    </>
  );
};

export default memo(AutIDProfile);
