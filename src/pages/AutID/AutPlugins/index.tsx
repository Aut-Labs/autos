 
import KeyIcon from "@assets/autos/lock-keyhole.svg?react";

import {
  Box,
  Paper,
  Typography,
  useTheme,
  SvgIcon,
  Tooltip
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AutOsButton } from "@components/AutButton";
import OverflowTooltip from "@components/OverflowTooltip";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { ResultState } from "@store/result-status";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useAppDispatch } from "@store/store.model";
import {
  AddedPlugins,
  PluginErrorMessage,
  PluginForAction,
  PluginStatus,
  addPlugin,
  updatePluginState
} from "@store/plugins/plugins.reducer";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { useAccount } from "wagmi";
import { SelectedAutID } from "@store/aut/aut.reducer";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CollectionsIcon from "@mui/icons-material/Collections";
import Groups3Icon from "@mui/icons-material/Groups3";
import ForumIcon from "@mui/icons-material/Forum";
import SmsIcon from "@mui/icons-material/Sms";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { AutOSHub } from "@api/models/hub.model";

const plugins = [
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Message in a bottle",
    id: "message-in-a-bottle",
    description:
      "Allows anyone with an ĀutID to write a message, a statement, a proposal, a bio, an SOS, an ad, an eulogy or anything, really - to anyone who is connected to them in a customizable degree of proximity (i.e.: min. 4/5/200 interactions)",
    reputation: 100,
    icon: MailOutlineIcon
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Portfolio ",
    id: "portfolio",
    description:
      "Highlight your favorite on-chain works, contributions or interactions in a custom-widget page.",
    reputation: 100,
    icon: CollectionsIcon
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Propose Collab",
    id: "propose-collab",
    description:
      "You have one shot to connect to and work together with the most interesting stranger you've found in the entire decentralized world. What will you say to them?",
    reputation: 100,
    icon: Groups3Icon
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Private Thread",
    id: "private-thread",
    description:
      'Create a decentralized, Reddit-like thread with custom rules such as ["same Role"; "same Hub"; "min Reputation"; etc.]. And start a conversation with provably like-minded people.',
    reputation: 100,
    icon: SmsIcon
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Accept Tips",
    id: "accept-tips",
    description:
      'Add a fancy, customizable "Tip me" button to your profile - and accept support, funding or donations from anyone.',
    reputation: 100,
    icon: RequestQuoteIcon
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Multi-sig Thread",
    id: "multi-sig-thread",
    description:
      "Some conversations are more important than others. Create and export a multi-sig thread, in the form of an NFT that all the participants can own and create rules of distribution for. Think of it as a decentralized, portable protocol to record and enforce IPs.",
    reputation: 100,
    icon: ForumIcon
  }
];

const PluginListItem = memo(
  ({
    plugin,
    holderReputation,
    canUpdateProfile,
    activate
  }: {
    plugin: any;
    holderReputation: number;
    canUpdateProfile: boolean;
    activate: any;
  }) => {
    const addedPlugins = useSelector(AddedPlugins);
    const status = useSelector(PluginStatus);
    const chosenPluginForAction = useSelector(PluginForAction);

    const isSamePlugin = useMemo(() => {
      const _id = chosenPluginForAction?.id;
      const id = plugin.id;

      return _id === id;
    }, [chosenPluginForAction, plugin]);

    const isLoading = useMemo(() => {
      return status === ResultState.Loading && isSamePlugin;
    }, [status, isSamePlugin]);

    const isActive = useMemo(() => {
      return addedPlugins.some(({ plugin: p }) => {
        const _id = p?.id;
        const id = plugin?.id;
        return _id === id;
      });
    }, [plugin, addedPlugins]);

    const isIdle = useMemo(() => {
      return !isLoading && !isActive;
    }, [status, isLoading, isActive]);
    const theme = useTheme();
    return (
      <Box
        sx={{
          display: "flex",
          border: "1px solid",
          borderColor: "#576176",
          minWidth: "170px",
          boxShadow: 3,
          borderRadius: "8.5px",
          padding: theme.spacing(3)
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "row"
              },
              justifyContent: {
                xs: "flex-start"
              },
              alignItems: "center"
            }}
          >
            {/* <Avatar
              sx={{
                width: {
                  xs: "40px",
                  md: "50px"
                },
                height: {
                  xs: "40px",
                  md: "50px"
                },
                borderRadius: "0"
              }}
              aria-label="hub-avatar"
              src={plugin.icon}
            /> */}
            <SvgIcon
              sx={{
                width: {
                  xs: "40px",
                  md: "50px"
                },
                height: {
                  xs: "40px",
                  md: "50px"
                },
                cursor: "pointer",
                background: "transparent",
                fill: "white"
              }}
              component={plugin.icon}
            />
            <Box
              sx={{
                marginLeft: {
                  xs: theme.spacing(3),
                  sm: theme.spacing(1),
                  md: theme.spacing(2),
                  xxl: theme.spacing(3)
                },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Typography variant="subtitle2" color="offWhite.main">
                {plugin.title}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: theme.spacing(3),
              justifyContent: "center",
              display: "flex"
            }}
          >
            {/* <Typography
              variant="caption"
              color="offWhite.main"
              textAlign="center"
            >
              {plugin.description}
            </Typography> */}

            <OverflowTooltip
              typography={{
                maxWidth: "240px",
                fontSize: "12px",
                fontWeight: "400",
                letterSpacing: "0.66px"
              }}
              maxLine={6}
              text={plugin?.description}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: theme.spacing(3)
            }}
          >
            {isActive ? (
              <AutOsButton
                type="button"
                disabled={true}
                sx={{
                  "&.MuiButton-root": {
                    background: "#4caf50",
                    "&.Mui-disabled": {
                      color: "white",
                      opacity: "1"
                    }
                  }
                }}
                variant="outlined"
              >
                <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                  Activated
                </Typography>
              </AutOsButton>
            ) : (
              <>
                {holderReputation < plugin.reputation ? (
                  <Tooltip
                    disableHoverListener={false}
                    title={`Unlock at ${plugin.reputation} REP`}
                  >
                    <Box>
                      <AutOsButton
                        type="button"
                        disabled={true}
                        onClick={activate}
                        sx={{
                          "&.MuiButton-root": {
                            background: "#576176",
                            "&.Mui-disabled": {
                              color: "#818CA2",
                              opacity: "1"
                            }
                          }
                        }}
                        variant="outlined"
                      >
                        <Typography
                          fontWeight="700"
                          fontSize="16px"
                          lineHeight="26px"
                        >
                          Activate
                        </Typography>
                        <SvgIcon
                          sx={{
                            height: {
                              xs: "16px"
                            },
                            width: {
                              xs: "16px"
                            },

                            fill: "transparent"
                          }}
                          viewBox="0 0 16 16"
                          key={`activate-lock`}
                          component={KeyIcon}
                        />
                      </AutOsButton>
                    </Box>
                  </Tooltip>
                ) : (
                  <AutOsButton
                    type="button"
                    disabled={holderReputation < plugin.reputation}
                    onClick={activate}
                    sx={{
                      "&.MuiButton-root": {
                        background: "#576176",
                        "&.Mui-disabled": {
                          color: "#818CA2",
                          opacity: "1"
                        }
                      }
                    }}
                    variant="outlined"
                  >
                    <Typography
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="26px"
                    >
                      Activate
                    </Typography>
                  </AutOsButton>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);

interface TableParamsParams {
  isLoading: boolean;
  hubs: AutOSHub[];
}

const AutPlugins = ({ isLoading = false, hubs = [] }: TableParamsParams) => {
  const theme = useTheme();
  const holderReputation = 0;
  const dispatch = useAppDispatch();
  const status = useSelector(PluginStatus);
  const errorMessage = useSelector(PluginErrorMessage);
  const [successMessage, setSuccessMessage] = useState("");
  const [activateSuccess, setActivateSuccess] = useState(null);
  const { address } = useAccount();
  const autID = useSelector(SelectedAutID);

  const isAddressTheConnectedUser = useMemo(() => {
    return autID.isAutIDOwner(address);
  }, [autID, address]);

  const handleDialogClose = () => {
    dispatch(
      updatePluginState({
        status: ResultState.Idle
      })
    );
  };

  const openDialog = (plugin) => {
    dispatch(
      updatePluginState({
        status: ResultState.Loading
      })
    );
    setTimeout(() => {
      setSuccessMessage(
        `The plugin ${plugin?.title} has been successfully activated!`
      );
      dispatch(
        updatePluginState({
          status: ResultState.Success
        })
      );
    }, 2000);
  };

  const activatePlugin = (plugin) => {
    dispatch(
      updatePluginState({
        plugin,
        status: ResultState.Loading
      })
    );
    setTimeout(() => {
      setActivateSuccess(true);
      dispatch(
        updatePluginState({
          status: ResultState.Idle,
          interaction: null
        })
      );
      dispatch(
        addPlugin({
          plugin
        })
      );
      setSuccessMessage(
        `The plugin ${plugin?.title} has been successfully activated!`
      );
      // if (interaction?.protocol === "Ethereum") {

      // } else {
      //   if (interaction?.protocol === "Ethereum") {
      //     setVerifySuccess(false);
      //     dispatch(
      //       updateInteractionState({
      //         interaction: null,
      //         status: ResultState.Failed,
      //         errorMessage:
      //           "Sorry, it seems like you have not completed this interaction yet!"
      //       })
      //     );
      //   }
      // }
    }, 2000);
  };

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
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Loading}
        message="Activating plugin..."
      />
      <SuccessDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Success}
        message={successMessage}
        subtitle="Congratulations!"
      />
      <Box sx={{ display: "flex", my: theme.spacing(3) }}>
        <Typography color="offWhite.main" variant="h3">
          Plugins
        </Typography>
        <Typography
          color="offWhite.dark"
          variant="h3"
          fontWeight="normal"
          sx={{
            ml: theme.spacing(1)
          }}
        >{`(${plugins.length})`}</Typography>
      </Box>
      <Box
        className="swiper-no-swiping"
        sx={{
          minWidth: {
            xs: "unset",
            md: "700px"
          },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            xxl: "1fr 1fr 1fr 1fr"
          },
          gap: theme.spacing(2)
        }}
      >
        {plugins?.map((plugin, index) => (
          <PluginListItem
            canUpdateProfile={isAddressTheConnectedUser}
            activate={() => activatePlugin(plugin)}
            key={`hub-row-${index}`}
            plugin={plugin}
            holderReputation={holderReputation}
          />
        ))}
      </Box>
    </Box>
  );
};

export default memo(AutPlugins);
