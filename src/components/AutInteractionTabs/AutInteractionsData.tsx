import ethereum from "@assets/autos/interactions/ethereum.jpg";
import gnosis from "@assets/autos/interactions/gnosis.png";
import polygon from "@assets/autos/interactions/polygon.webp";
import uniswap from "@assets/autos/interactions/uniswap.png";
import inch from "@assets/autos/interactions/1inch.png";
import quickswap from "@assets/autos/interactions/quickswap.png";
import aave from "@assets/autos/interactions/aave.png";
import rarible from "@assets/autos/interactions/rarible.png";
import opensea from "@assets/autos/interactions/opensea.png";
import foundation from "@assets/autos/interactions/foundation.png";
import async from "@assets/autos/interactions/async.webp";
import superfluid from "@assets/autos/interactions/superfluid.jpg";
import snapshot from "@assets/autos/interactions/snapshot.png";
import clr from "@assets/autos/interactions/clr.png";
import giveth from "@assets/autos/interactions/giveth.png";
import gitcoin from "@assets/autos/interactions/gitcoin.png";
import kleros from "@assets/autos/interactions/kleros.png";
import aragon from "@assets/autos/interactions/aragon.png";
import daohaus from "@assets/autos/interactions/daohaus.png";
import colony from "@assets/autos/interactions/colony.png";
import wonderverse from "@assets/autos/interactions/wonderverse.avif";
import mirror from "@assets/autos/interactions/mirror.jpeg";
import renft from "@assets/autos/interactions/renft.avif";
import praise from "@assets/autos/interactions/praise.png";
import coordinape from "@assets/autos/interactions/coordinape.jpg";
import sourcecred from "@assets/autos/interactions/sourcecred.svg";
import optimism from "@assets/autos/interactions/optimism.png";
import ceramic from "@assets/autos/interactions/ceramic.jpeg";

export const AutOsInteractionTypes = {
  tech: [
    {
      protocol: "Ethereum",
      image: ethereum,
      description: "Wallet has deployed a contract"
    },
    {
      protocol: "Gnosis Chain",
      image: gnosis,
      description: "Wallet has deployed a contract"
    },
    {
      protocol: "Polygon",
      image: polygon,
      description: "Wallet has deployed a contract"
    },
    {
      protocol: "Ethereum",
      image: ethereum,
      description: "Wallet has contributed to EIP or PIP (wherever trackable)"
    },
    {
      protocol: "Polygon",
      image: polygon,
      description: "Wallet has contributed to EIP or PIP (wherever trackable)"
    },
    {
      protocol: "Gnosis Chain",
      image: gnosis,
      description: "Wallet has contributed to EIP or PIP (wherever trackable)"
    },
    {
      protocol: "Ethereum",
      image: ethereum,
      description: "Wallet has successfully completed an on-chain bounty"
    },
    {
      protocol: "Gnosis Chain",
      image: gnosis,
      description: "Wallet has successfully completed an on-chain bounty"
    },
    {
      protocol: "Polygon",
      image: polygon,
      description: "Wallet has successfully completed an on-chain bounty"
    },
    {
      protocol: "Ethereum",
      image: ethereum,
      description: "Runs a Node on Ethereum"
    },
    {
      protocol: "Ethereum",
      image: ethereum,
      description: "ETH 2.0 staker"
    }
  ],
  defi: [
    {
      protocol: "Uniswap",
      image: uniswap,
      description: "Created LP on Uniswap"
    },
    {
      protocol: "1Inch",
      image: inch,
      description: "Created LP on 1Inch"
    },
    {
      protocol: "Quickswap",
      image: quickswap,
      description: "Created LP on Quickswap (Polygon)"
    },
    {
      protocol: "AAVE",
      image: aave,
      description: "Created flash loans on AAVE (Polygon)"
    },
    {
      protocol: "Superfluid",
      image: superfluid,
      description: "Created a CFA on Superfluid"
    }
  ],
  governance: [
    {
      protocol: "Snapshot",
      image: snapshot,
      description: "Created a proposal on Snapshot"
    },
    {
      protocol: "clr.fund",
      image: clr,
      description: "Donated to clr.fund"
    },
    {
      protocol: "givETH",
      image: giveth,
      description: "Donated to givETH"
    },
    {
      protocol: "Gitcoin",
      image: gitcoin,
      description: "Participated in a Gitcoin Round"
    },
    {
      protocol: "Kleros",
      image: kleros,
      description: "Staked in Kleros Court"
    },
    {
      protocol: "Kleros",
      image: kleros,
      description: "Added entry to Kleros Curate"
    },
    {
      protocol: "Aragon",
      image: aragon,
      description: "Deployed a DAO on Aragon"
    },
    {
      protocol: "DAOHaus",
      image: daohaus,
      description: "Deployed a DAO on DAOHaus"
    },
    {
      protocol: "Colony",
      image: colony,
      description: "Deployed a DAO on Colony"
    },
    {
      protocol: "Wonderverse",
      image: wonderverse,
      description: "Deployed a DAO on Wonderverse"
    }
  ],
  art: [
    {
      protocol: "Rarible",
      image: rarible,
      description: "Created NFT collections on Rarible"
    },
    {
      protocol: "OpenSea",
      image: opensea,
      description: "Created NFT collections on OpenSea"
    },
    {
      protocol: "Foundation",
      image: foundation,
      description: "Created NFT collections on Foundation"
    },
    {
      protocol: "Async",
      image: async,
      description: "Created NFT collections on Async"
    },
    {
      protocol: "Rarible",
      image: rarible,
      description: "Sold NFTs on Rarible"
    },
    {
      protocol: "OpenSea",
      image: opensea,
      description: "Sold NFTs on OpenSea"
    },
    {
      protocol: "Foundation",
      image: foundation,
      description: "Sold NFTs on Foundation"
    },
    {
      protocol: "Async",
      image: async,
      description: "Sold NFTs on Async"
    },
    {
      protocol: "ReNFT",
      image: renft,
      description: "Borrowed or Lent an NFT on ReNFT"
    },
    {
      protocol: "Mirror",
      image: mirror,
      description: "Published or collected article on Mirror"
    }
  ],
  reputation: [
    {
      protocol: "Praise",
      image: praise,
      description: "Received Praise (CS)"
    },
    {
      protocol: "Coordinape",
      image: coordinape,
      description: "Received Give via Coordinape"
    },
    {
      protocol: "SourceCred",
      image: sourcecred,
      description: "Received Cred via SourceCred"
    },
    {
      protocol: "Ceramic",
      image: ceramic,
      description: "Ceramic DID"
    },
    {
      protocol: "Optimism",
      image: optimism,
      description: "Was granted a share of Optimism RetroPGF"
    }
  ]
};
