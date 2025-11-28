import { memo, useState } from "react";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { TaskStatus } from "@store/model";
import { AutOsButton } from "@components/AutButton";
import TaskDetails from "../Shared/TaskDetails";
import SubmitDialog from "@components/Dialog/SubmitDialog";
import AutLoading from "@components/AutLoading";
import { useOAuthSocials } from "@components/OAuth";
import { useWalletConnector } from "@lib/connector";
import { ContributionCommit } from "@utils/hooks/useQueryContributionCommits";
import { useCommitAnyContributionMutation } from "@api/contributions.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { JoinDiscordContribution } from "@api/models/contribution-types/join-discord.model";

const DiscordJoinContent = ({
  contribution,
  commit
}: {
  contribution: JoinDiscordContribution;
  commit: ContributionCommit;
}) => {
  const { state } = useWalletConnector();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { autAddress, hubAddress } = useParams();
  const { getAuthDiscord } = useOAuthSocials();

  const [commitContribution, { error, isError, isSuccess, isLoading, reset }] =
    useCommitAnyContributionMutation();

  const contributionSubmissionContent = (() => {
    let userSubmit = null;
    try {
      userSubmit = JSON.parse(commit?.data || "{}");
    } catch (e) {
      // pass
    }
    return userSubmit;
  })();

  const handleSubmit = async () => {
    await getAuthDiscord(
      async (data) => {
        const { access_token } = data;

        const discordMessage = {
          accessToken: access_token,
          guildId: contribution?.properties?.guildId
        };

        commitContribution({
          autSig: state.authSig,
          contribution,
          message: JSON.stringify(discordMessage),
          hubAddress
        });
      },
      () => {
        // Handle auth failure
      }
    );
  };

  return (
    <Stack
      direction="column"
      gap={4}
      sx={{
        flex: 1,
        justifyContent: "space-between",
        margin: "0 auto",
        width: {
          xs: "100%",
          sm: "600px",
          xxl: "800px"
        }
      }}
    >
      <ErrorDialog
        handleClose={() => reset()}
        open={isError}
        message={(error as { message: string })?.message || "An error occurred"}
      />

      <SubmitDialog
        open={isSuccess || isLoading}
        mode={isSuccess ? "success" : "loading"}
        backdropFilter={true}
        message={isLoading ? "" : "Congratulations!"}
        titleVariant="h2"
        subtitle={
          isLoading
            ? "Submitting contribution..."
            : "Your submission has been successful!"
        }
        subtitleVariant="subtitle1"
        handleClose={() => {
          if (!isLoading) {
            reset();
            navigate({
              pathname: `/${autAddress}/hub/${hubAddress}`,
              search: searchParams.toString()
            });
          }
        }}
      />

      {!commit ? (
        <Card
          sx={{
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px"
            }}
          >
            <Typography
              color="white"
              variant="body"
              textAlign="center"
              marginBottom="24px"
            >
              {contribution?.description}
            </Typography>

            <Typography
              color="white"
              variant="body2"
              textAlign="center"
              marginBottom="32px"
            >
              Please join the Discord server and authenticate to verify your
              contribution
            </Typography>

            <Stack direction="column" spacing={2} alignItems="center">
              <AutOsButton
                type="button"
                color="primary"
                variant="outlined"
                onClick={() =>
                  window.open(
                    contribution?.properties?.inviteUrl,
                    "_blank"
                  )
                }
                sx={{
                  width: "160px"
                }}
              >
                <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                  Join Discord
                </Typography>
              </AutOsButton>

              <AutOsButton
                type="button"
                color="primary"
                variant="outlined"
                onClick={handleSubmit}
                sx={{
                  width: "160px"
                }}
              >
                <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                  Submit
                </Typography>
              </AutOsButton>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            boxShadow: 3
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
          <Stack direction="column" alignItems="center" mb="15px">
              <Typography
                color="white"
                variant="subtitle2"
                textAlign="center"
                p="5px"
              >
                {contributionSubmissionContent?.discordServer}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Discord Server
              </Typography>
            </Stack>
            <Stack direction="column" alignItems="center" mb="15px">
              <Typography
                color="white"
                variant="subtitle2"
                textAlign="center"
                p="5px"
              >
                {contributionSubmissionContent?.authenticatedUser}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Authenticated User
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

const JoinDiscordTask = ({
  contribution,
  commit
}: {
  contribution: JoinDiscordContribution;
  commit: ContributionCommit;
}) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {contribution ? (
        <>
          <TaskDetails contribution={contribution} />
          <DiscordJoinContent contribution={contribution} commit={commit} />
        </>
      ) : (
        <AutLoading width="130px" height="130px" />
      )}
    </Container>
  );
};

export default memo(JoinDiscordTask);
