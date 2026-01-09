import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { AutTextField } from "@theme/field-text-styles";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { FormHelperText } from "@components/Fields/AutFields";
import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import { TaskFileUpload } from "@components/FileUpload";
import { AutOsButton } from "@components/AutButton";
import { TaskStatus } from "@store/model";
import SubmitDialog from "@components/Dialog/SubmitDialog";
import { OpenTaskContribution } from "@api/models/contribution-types/open-task.model";
import { ContributionCommit } from "@utils/hooks/useQueryContributionCommits";
import { useCommitAnyContributionMutation } from "@api/contributions.api";
import { useWalletConnector } from "@lib/connector";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import TaskDetails from "../Shared/TaskDetails";

interface UserSubmitContentProps {
  contribution: OpenTaskContribution;
  commit: ContributionCommit;
}

const errorTypes = {
  pattern: "Invalid url."
};

const UserSubmitContent = ({
  contribution,
  commit
}: UserSubmitContentProps) => {
  const { state } = useWalletConnector();
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const { control, handleSubmit, formState, setValue, getValues } = useForm({
    mode: "onChange",
    defaultValues: {
      description: "",
      attachment: ""
    }
  });

  const { autAddress, hubAddress } = useParams();

  const contributionSubmissionContent = useMemo(() => {
    let userSubmit = null;
    try {
      userSubmit = JSON.parse(commit.data);
    } catch (e) {
      // pass
    }
    return userSubmit;
  }, [commit]);

  console.log(contributionSubmissionContent, 'contributionSubmissionContent');

  useEffect(() => {
    if (!initialized && contributionSubmissionContent) {
      let userSubmit = {
        description: "",
        attachment: ""
      };
      try {
        userSubmit = JSON.parse(commit.data);
      } catch (e) {
        // pass
      }
      setValue("description", userSubmit.description);
      setValue("attachment", userSubmit.attachment);
      setInitialized(true);
    }
  }, [initialized, contributionSubmissionContent]);

  console.log(contributionSubmissionContent, 'contributionSubmissionContent');

  const [commitContribution, { error, isError, isSuccess, isLoading, reset }] =
    useCommitAnyContributionMutation();

  const onSubmit = () => {
    const description = getValues("description");
    const attachment = getValues("attachment");
    commitContribution({
      autSig: state.authSig,
      contribution,
      message: JSON.stringify({ description, attachment }),
      hubAddress
    });
  };

  const textRequiredTemplate = useMemo(() => {
    if (!contribution.properties.textRequired) return null;
    return (
      <Controller
        name="description"
        control={control}
        rules={{
          required: true,
          maxLength: 257
        }}
        render={({ field: { name, value, onChange } }) => {
          return (
            <AutTextField
              name={name}
              value={value || ""}
              sx={{ mb: "20px" }}
              onChange={onChange}
              variant="outlined"
              color="offWhite"
              multiline
              rows={5}
              placeholder={`Enter text here (required)`}
            />
          );
        }}
      />
    );
  }, [contribution.properties.textRequired]);

  const attachmentTypeTemplate = useMemo(() => {
    const attachmentType = contribution.properties.attachmentType;
    if (!attachmentType) return null;

    if (attachmentType === "url") {
      return (
        <>
          <Typography color="white" variant="body" textAlign="center" p="20px">
            URL
          </Typography>
          <Controller
            name="attachment"
            control={control}
            rules={{
              required: true,
              pattern:
                /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
            }}
            render={({ field: { name, value, onChange } }) => {
              return (
                <AutTextField
                  name={name}
                  value={value || ""}
                  sx={{ mt: "20px" }}
                  onChange={onChange}
                  variant="outlined"
                  color="offWhite"
                  required
                  rows={1}
                  placeholder="URL Link Here"
                  helperText={
                    <FormHelperText
                      value={value}
                      name={name}
                      errors={formState.errors}
                      errorTypes={errorTypes}
                    />
                  }
                />
              );
            }}
          />
        </>
      );
    } else if (attachmentType === "image" || attachmentType === "text") {
      return (
        <>
          <Typography color="white" variant="body" textAlign="center" p="20px">
            {`Upload a file ${
              attachmentType === "image"
                ? "(.png, .jpg, .jpeg)"
                : "(.doc, .docx, .txt, .pdf)"
            }`}
          </Typography>
          <Controller
            name="attachment"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange } }) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <TaskFileUpload
                    attachmentType={attachmentType}
                    color="offWhite"
                    fileChange={async (file) => {
                      if (file) {
                        onChange(file);
                      } else {
                        onChange(null);
                      }
                    }}
                  />
                </div>
              );
            }}
          />
        </>
      );
    }
  }, [contribution.properties.attachmentType]);

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
        message={error || "An error occurred"}
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
      ></SubmitDialog>

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
              flexDirection: "column"
            }}
          >
            <Typography
              color="white"
              variant="body"
              textAlign="center"
              p="20px"
            >
              {contribution?.description}
            </Typography>
            {textRequiredTemplate}
            {attachmentTypeTemplate}
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
              flexDirection: "column"
            }}
          >
            {/* this will be implemented once give contribution is completed */}
            {/* {contribution?.status === TaskStatus.Finished && (
              <Stack direction="column" alignItems="flex-end" mb="15px">
                <Chip label="Approved" color="success" size="small" />
              </Stack>
            )} */}
            <Stack direction="column" alignItems="center" mb="15px">
              <Typography
                color="white"
                variant="subtitle2"
                textAlign="center"
                p="5px"
              >
                {contributionSubmissionContent?.description}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Description
              </Typography>
            </Stack>

            {contribution?.properties?.attachmentRequired && (
              <Stack direction="column" alignItems="center">
                <Typography
                  color="white"
                  variant="body"
                  textAlign="center"
                  p="5px"
                >
                  <Link
                    color="primary"
                    sx={{
                      mt: 1,
                      cursor: "pointer"
                    }}
                    variant="subtitle2"
                    target="_blank"
                    //TODO: To uncomment when attachment ipfs url is correctly added to the metadata
                    // href={ipfsCIDToHttpUrl(
                    //   contributionSubmissionContent?.attachment
                    // )}
                  >
                    Open attachment
                  </Link>
                </Typography>
                <Typography variant="caption" className="text-secondary">
                  Attachment File
                </Typography>
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      <Stack
        sx={{
          margin: "0 auto",
          width: {
            xs: "100%",
            sm: "600px",
            xxl: "800px"
          }
        }}
      >
        {!commit && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              mb: 4,
              justifyContent: {
                xs: "center",
                sm: "flex-end"
              }
            }}
          >
            <AutOsButton
              type="button"
              color="primary"
              variant="outlined"
              sx={{
                width: "100px"
              }}
              disabled={!formState.isValid}
              onClick={handleSubmit(onSubmit)}
            >
              <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
                Submit
              </Typography>
            </AutOsButton>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

const OpenTask = ({
  contribution,
  commit
}: {
  contribution: OpenTaskContribution;
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
      <TaskDetails contribution={contribution} />
      <UserSubmitContent contribution={contribution} commit={commit} />
    </Container>
  );
};

export default memo(OpenTask);
