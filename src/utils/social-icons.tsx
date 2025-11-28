import DiscordIcon from "@assets/SocialIcons/DiscordIcon.svg?react";
import GitHubIcon from "@assets/SocialIcons/GitHubIcon.svg?react";
import LensfrensIcon from "@assets/SocialIcons/LensfrensIcon.svg?react";
import TelegramIcon from "@assets/SocialIcons/TelegramIcon.svg?react";
import TwitterIcon from "@assets/SocialIcons/TwitterIcon.svg?react";
import { AutSocial } from "@aut-labs/sdk";
import { FC, SVGProps } from "react";

export const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
};

export interface SocialWithIcon extends AutSocial {
  Icon: FC<SVGProps<SVGSVGElement>>;
}

export const socialsWithIcons = (socials: AutSocial[]): SocialWithIcon[] => {
  return socials.map((social, index) => {
    const AutIcon = socialIcons[Object.keys(socialIcons)[index]];
    return {
      ...social,
      Icon: AutIcon
    } as SocialWithIcon;
  });
};
