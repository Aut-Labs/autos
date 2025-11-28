
import {
  Box,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useSelector } from "react-redux";
import InteractionMap from "@components/InteractionMap";
import { memo, useMemo, useRef } from "react";
import { AutOsButton } from "@components/AutButton";
import { useAppDispatch } from "@store/store.model";
import { setOpenInteractions } from "@store/ui-reducer";
import { AddedInteractions } from "@store/interactions/interactions.reducer";
import { useAccount } from "wagmi";
import { AutIdInteractions, MapAutID, MapData } from "@api/models/map.model";
import { AutIDs, SelectedAutID } from "@store/aut/aut.reducer";
import { autUrls } from "@utils/aut-urls";
import { AutOSAutID } from "@api/models/aut.model";

const mockInteractions: AutIdInteractions[] = [
  {
    name: "interactionA",
    status: "Complete",
    weight: "1",
    type: "typeA",
    description: "descriptionA"
  },
  {
    name: "interactionB",
    status: "Complete",
    weight: "1",
    type: "typeB",
    description: "descriptionB"
  },
  {
    name: "interactionC",
    status: "Complete",
    weight: "1",
    type: "typeC",
    description: "descriptionC"
  },
  {
    name: "interactionD",
    status: "Complete",
    weight: "1",
    type: "typeD",
    description: "descriptionD"
  },
  {
    name: "interactionE",
    status: "Complete",
    weight: "1",
    type: "typeE",
    description: "descriptionE"
  }
];

const AutIDMap = () => {
  const ref = useRef(null);
  const dispatch = useAppDispatch();
  const addedInteractions = useSelector(AddedInteractions);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { address } = useAccount();
  const autID = useSelector(SelectedAutID);
  const autIDs = useSelector(AutIDs);

  const mapData = useMemo(() => {
    if (autIDs.length > 0) {
      const central = new MapAutID({
        id: autID.properties.address,
        ...autID
      } as MapAutID);

      const members = autIDs.map((autID: AutOSAutID) => {
        return new MapAutID({
          id: autID.properties.address,
          ...autID
        } as MapAutID);
      });

      const _mapData: MapData = {
        centralNode: central,
        members
      };

      _mapData.centralNode.properties.interactions = [
        mockInteractions[0],
        mockInteractions[1]
      ];

      const randomIndexes = [];
      if (members?.length > 0) {
        for (let i = 0; i < 3; i++) {
          randomIndexes.push(Math.floor(Math.random() * members.length));
        }
      }
      members.forEach((member, index) => {
        if (randomIndexes.includes(index) && member?.id != central?.id) {
          member.properties.interactions = [
            mockInteractions[0],
            mockInteractions[1],
            mockInteractions[2]
          ];
        }
      });
      // dispatch(setConnections(members?.length > 0 ? members?.length - 1 : 0));
      return _mapData;
    }
  }, [autIDs]);

  const isWalletAddressPartOfMembers = useMemo(() => {
    return (
      (mapData?.members || []).some((v) => v.isAutIDOwner(address)) ||
      autID.isAutIDOwner(address)
    );
  }, [mapData, address]);

  const showInteractionLayer = useMemo(() => {
    if (mobile) return true;
    return !addedInteractions.length && !isWalletAddressPartOfMembers;
  }, [addedInteractions, isWalletAddressPartOfMembers, mobile]);

  const joinedHubsAddresses = useMemo(() => {
    return autID.properties.joinedHubs.map((hub) => hub.hubAddress).join(",");
  }, [autID]);

  const handleClose = () => {
    dispatch(setOpenInteractions(false));
  };

  const openInteractionsModal = () => {
    dispatch(setOpenInteractions(true));
  };
  return (
    <>
      {showInteractionLayer && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gridGap: "12px",
            textAlign: "center",
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            zIndex: 99,
            background: "rgba(87, 97, 118, 0.3)",
            borderRadius: "72px"
          }}
        >
          {mobile ? (
            <Typography
              color="white"
              fontWeight="700"
              fontSize="16px"
              lineHeight="26px"
              component="div"
            >
              Open in desktop to see <br />
              <Typography
                color="white"
                fontWeight="900"
                fontSize="18px"
                lineHeight="26px"
              >
                Interaction Map
              </Typography>
            </Typography>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path
                  d="M32.0013 34.6667C39.3651 34.6667 45.3346 28.6971 45.3346 21.3333C45.3346 13.9695 39.3651 8 32.0013 8C24.6375 8 18.668 13.9695 18.668 21.3333C18.668 28.6971 24.6375 34.6667 32.0013 34.6667Z"
                  stroke="#717BBC"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M53.3346 56C53.3346 50.342 51.087 44.9158 47.0862 40.915C43.0855 36.9142 37.6593 34.6666 32.0013 34.6666C26.3434 34.6666 20.9171 36.9142 16.9164 40.915C12.9156 44.9158 10.668 50.342 10.668 56"
                  stroke="#717BBC"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Typography
                color="white"
                fontWeight="700"
                fontSize="16px"
                lineHeight="26px"
              >
                Connect with this user to see their <br /> map of connections
              </Typography>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <AutOsButton
                  onClick={openInteractionsModal}
                  type="button"
                  color="primary"
                  size="small"
                  variant="outlined"
                >
                  <Typography
                    fontWeight="700"
                    fontSize="16px"
                    lineHeight="26px"
                  >
                    Create a Link
                  </Typography>
                </AutOsButton>
                <Typography
                  color="white"
                  fontWeight="700"
                  fontSize="16px"
                  lineHeight="26px"
                >
                  or
                </Typography>
                <AutOsButton
                  type="button"
                  color="primary"
                  size="small"
                  variant="outlined"
                >
                  <Link
                    href={`${autUrls.hub}project/${joinedHubsAddresses}`}
                    target="_blank"
                    key={"hub-link"}
                    underline="none"
                    color="inherit"
                  >
                    <Typography
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="26px"
                    >
                      Join their Hub
                    </Typography>
                  </Link>
                </AutOsButton>
              </Stack>
            </>
          )}
        </Box>
      )}
      <Box
        ref={ref}
        className="map-wrapper"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "100%",
          "& > DIV": {
            width: "100%"
          },
          ...(showInteractionLayer && {
            mixBlendMode: "plus-lighter",
            opacity: 0.6,
            filter: "blur(20px)"
          })
        }}
      >
        {mapData?.centralNode && (
          <InteractionMap
            mapData={mapData}
            isActive={!showInteractionLayer}
            parentRef={ref}
          />
        )}
      </Box>
    </>
  );
};

export default memo(AutIDMap);
