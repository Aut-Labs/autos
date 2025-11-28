export const formatContributionType = (type: string) => {
  switch (type) {
    case "discord":
      return "Discord";
    case "open":
      return "Open Task";
    case "quiz":
      return "Quiz";
    case "github":
      return "GitHub";
    case "retweet":
      return "Retweet";
    case "commit":
      return "Commit";
    default:
      return type;
  }
};

export const getContributionTypeSubtitle = (type: string) => {
  switch (type) {
    case "discord":
      return "Join Discord Task";
    case "open":
      return "Open Task";
    case "quiz":
      return "Quiz Task";
    case "github":
      return "GitHub Task";
    case "retweet":
      return "Retweet Task";
    case "commit":
      return "Commit Task";
    default:
      return type;
  }
};
