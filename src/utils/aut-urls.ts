import { EnvMode, environment } from "@api/environment";

interface ApiUrls {
  myAut: string;
  hub: string;
  launchpad: string;
}

const _autUrls = (): ApiUrls => {
  if (environment.env === EnvMode.Development) {
    return {
      myAut: "https://internal.os.aut.id/",
      hub: "https://internal.hub.sbs/",
      launchpad: "https://internal.launch.hub.sbs/"
    };
  }

  return {
    myAut: "https://os.aut.id/",
    hub: "https://hub.sbs/",
    launchpad: "https://launch.hub.sbs/"
  };
};

export const autUrls = _autUrls();
