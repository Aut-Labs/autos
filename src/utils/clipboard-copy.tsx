import React from "react";
import { useState } from "react";
import { styled, Typography } from "@mui/material";
import { pxToRem } from "./text-size";

const CopyWrapper = styled("div")(
  ({ theme }) => `
  display: flex;
  align-content: center;
  text-transform: none;
  width: 100%;
  justify-content: space-between;
  line-height: 48px;
  height: 48px;
  border-width: 1px;
  border-style: solid;
  padding: 0 15px;
  margin-top: 5px;
  align-items: center;
  cursor: pointer;
  background-color: ${theme.palette.background.paper} !important;

`
);

function AutClipboardCopy({ url, sx = {}, trim = (v) => v }) {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand("copy", true, text);
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(url)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 2500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <CopyWrapper
      style={sx}
      className={`copy-wrapper`}
      onClick={handleCopyClick}
    >
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "80%"
        }}
      >
        <Typography
          noWrap
          sx={{
            textAlign: "center",
            flex: 1
          }}
          color="info.dark"
          component="span"
          variant="caption"
        >
          {trim(url)}
        </Typography>
      </div>

      <div
        className="copy-text"
        style={{
          transition: "all 0.3s ease-in",
          opacity: isCopied ? "0.7" : "1",
          minWidth: "50px",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Typography fontSize={pxToRem(18)} color="info.dark" component="span">
          {isCopied ? "Copied!" : "COPY"}
        </Typography>
      </div>
    </CopyWrapper>
  );
}

export default AutClipboardCopy;
