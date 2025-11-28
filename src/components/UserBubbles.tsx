import { Box } from "@mui/material";
import theme from "@theme/theme";
import { FollowPopover } from "./FollowPopover";
import { useState } from "react";
import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import { AutOSAutID } from "@api/models/aut.model";

interface BubbleProps {
  user: AutOSAutID;
}

export const Bubble = ({ user }: BubbleProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  let leaveTimeout = null;

  const handlePopoverOpen = (event) => {
    clearTimeout(leaveTimeout);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    leaveTimeout = setTimeout(() => {
      setAnchorEl(null);
    }, 100);
  };

  const cancelPopoverClose = () => {
    clearTimeout(leaveTimeout);
  };

  const popoverOpen = Boolean(anchorEl);

  return (
    <Box
      onMouseLeave={handlePopoverClose}
      sx={{
        willChange: "transform",
        position: "relative"
      }}
    >
      <img
        src={ipfsCIDToHttpUrl(user?.properties?.thumbnailAvatar)}
        onMouseEnter={handlePopoverOpen}
        style={{
          borderRadius: "50%",
          width: `64px`,
          height: `64px`,
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.00) 100%)",
          boxShadow:
             
            `0px 16px 80px 0px ${theme.palette.primary.main}, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)`,
          backdropFilter: "blur(8px)"
        }}
        draggable="false"
        alt="Profile"
      />
      <FollowPopover
        type="anchor"
        open={popoverOpen}
        anchorEl={anchorEl}
        onMouseEnter={cancelPopoverClose}
        onMouseLeave={handlePopoverClose}
        data={user}
      />
    </Box>
  );
};

// const UserBubbles = ({ users }) => {
//   const sizes = [180, 90, 100, 90, 60, 150]; // size of bubbles
//   const positions = [
//     // positions of bubbles
//     { top: 15, left: 75 }, // left top corner
//     { top: 70, left: 85 }, // middle top
//     { top: 80, left: 70 }, // right top corner
//     { top: 70, left: 5 }, // left middle
//     { top: 85, left: 15 }, // left middle
//     { top: 25, left: 10 } // right middle
//   ];

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100%",
//         position: "absolute"
//       }}
//     >
//       {users.map((user, index) => (
//         <Bubble user={user} key={index} />
//       ))}
//     </Box>
//   );
// };

// export default UserBubbles;
