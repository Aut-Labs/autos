import { AutOsButton } from "@components/AutButton";
import { Avatar, Typography, Box, useTheme, Tooltip } from "@mui/material";
import { memo, useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  AddedInteractions,
  InteractionForAction,
  InteractionStatus,
  addInteraction,
  updateInteractionState
} from "@store/interactions/interactions.reducer";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import { useAuthenticatedApi } from "@api/aut.api";

const InteractionListItem = memo(
  ({ interaction, verify }: { interaction: any; verify: any }) => {
    const addedInteractions = useSelector(AddedInteractions);
    const theme = useTheme();
    const status = useSelector(InteractionStatus);
    const chosenInteractionForACtion = useSelector(InteractionForAction);

    const isSameInteraction = useMemo(() => {
      const _id = `${chosenInteractionForACtion?.protocol}_${chosenInteractionForACtion?.description}`;
      const id = `${interaction?.protocol}_${interaction?.description}`;

      return _id === id;
    }, [chosenInteractionForACtion, interaction]);

    const isLoading = useMemo(() => {
      return status === ResultState.Loading && isSameInteraction;
    }, [status, isSameInteraction]);

    const isActive = useMemo(() => {
      return addedInteractions.some(({ interaction: int }) => {
        const _id = `${int?.protocol}_${int?.description}`;
        const id = `${interaction?.protocol}_${interaction?.description}`;
        return _id === id;
      });
    }, [interaction, addedInteractions]);

    const isIdle = useMemo(() => {
      return !isLoading && !isActive;
    }, [status, isLoading, isActive]);

    return (
      <Box
        sx={{
          display: "flex",
          border: "1px solid",
          borderColor: "#576176",
          minWidth: "170px",
          boxShadow: 3,
          opacity: "0.7",
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
            <Avatar
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
              src={interaction.image}
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
                {interaction.protocol}
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
            <Typography
              variant="caption"
              color="offWhite.main"
              textAlign="center"
            >
              {interaction.description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: theme.spacing(3)
            }}
          >
            <Tooltip title="Coming soon!">
              <AutOsButton
                type="button"
                disabled={true}
                sx={{
                  "&.MuiButton-root": {
                    background: "#576176",
                    ":hover": {
                      background: "#576176",
                      color: "#818CA2",
                      opacity: "1"
                    },
                    "&.Mui-disabled": {
                      color: "#818CA2",
                      pointerEvents: "auto",
                      opacity: "1"
                    }
                  }
                }}
                variant="outlined"
              >
                <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                  Verify
                </Typography>
              </AutOsButton>
            </Tooltip>

            {/* <AutOsButton
              type="button"
              onClick={verify}
              disabled={isLoading || isActive}
              sx={{
                "&.MuiButton-root": {
                  background: isActive ? "#4caf50" : "#576176",
                  "&.Mui-disabled": {
                    color: isActive ? "white" : "#818CA2",
                    opacity: "1"
                  }
                }
              }}
              variant="outlined"
            >
              {isActive ? (
                <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                  Verified
                </Typography>
              ) : (
                <>
                  {isIdle && (
                    <Typography
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="26px"
                    >
                      Verify
                    </Typography>
                  )}
                  {isLoading && (
                    <CircularProgress
                      size={23}
                      color="secondary"
                    ></CircularProgress>
                  )}
                </>
              )}
            </AutOsButton> */}
          </Box>
        </Box>
      </Box>
    );
  }
);

const InteractionList = ({ isLoading = false, interactions = [] }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [verifySuccess, setVerifySuccess] = useState(null);
  const { authenticatedAction } = useAuthenticatedApi();

  const verifyInteraction = async (interaction) => {
    dispatch(
      updateInteractionState({
        interaction,
        status: ResultState.Loading
      })
    );
    await authenticatedAction(async (jwt) => {
      setTimeout(() => {
        setVerifySuccess(true);
        dispatch(
          updateInteractionState({
            status: ResultState.Idle,
            interaction: null
          })
        );
        dispatch(
          addInteraction({
            interaction
          })
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
    });
  };

  return (
    <PerfectScrollbar
      style={{
        height: "calc(100%)",
        display: "flex",
        flexDirection: "column",
        paddingBottom: theme.spacing(4),
        width: "100%"
      }}
    >
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
          border: "none",
          my: theme.spacing(3)
        }}
      >
        {/* <ErrorDialog
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
      /> */}{" "}
        <Box
          className="swiper-no-swiping"
          sx={{
            minWidth: {
              xs: "unset",
              md: "700px"
            },
            padding: "10px",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr 1fr",
              md: "1fr 1fr 1fr",
              xl: "1fr 1fr 1fr 1fr 1fr"
            },
            gap: theme.spacing(2)
          }}
        >
          {interactions?.map((interaction, index) => (
            <InteractionListItem
              key={`hub-row-${index}`}
              interaction={interaction}
              verify={() => verifyInteraction(interaction)}
            />
          ))}
        </Box>
      </Box>
    </PerfectScrollbar>
  );
};

export default InteractionList;
