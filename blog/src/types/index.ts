export interface Lecture {
    id: string;
    title: string;
    content: string;
    date: string;
    module: string;
    order: number;
  }
  
  export type Module = {
    id: string;
    title: string;
    description: string;
    order: number;
  };
  
  export const MODULES: Module[] = [
    {
      id: "blockchain-history",
      title: "History and Development of Blockchain",
      description: "Introduction to blockchain technology and its historical development",
      order: 1
    },
    {
      id: "git",
      title: "Git",
      description: "Version control system and collaboration",
      order: 2
    },
    {
      id: "html",
      title: "HTML",
      description: "Structure and semantics of web pages",
      order: 3
    },
    {
      id: "css",
      title: "CSS",
      description: "Styling and layout for web applications",
      order: 4
    },
    {
      id: "javascript",
      title: "JavaScript",
      description: "Core programming language for web development",
      order: 5
    },
    {
      id: "dom",
      title: "DOM",
      description: "Document Object Model manipulation",
      order: 6
    },
    {
      id: "oop",
      title: "Object Oriented Programming",
      description: "OOP principles and patterns",
      order: 7
    },
    {
      id: "async",
      title: "Async",
      description: "Asynchronous programming in JavaScript",
      order: 8
    },
    {
      id: "react",
      title: "React",
      description: "Component-based UI library",
      order: 9
    },
    {
      id: "react-client",
      title: "React Client/Ajax request",
      description: "Client-side data fetching and state management",
      order: 10
    },
    {
      id: "http-network",
      title: "HTTP/Network",
      description: "Network protocols and web communication",
      order: 11
    },
    {
      id: "dapp",
      title: "Dapp",
      description: "Decentralized application architecture",
      order: 12
    },
    {
      id: "solidity",
      title: "Solidity",
      description: "Smart contract development language",
      order: 13
    },
    {
      id: "abi",
      title: "ABI",
      description: "Application Binary Interface for smart contracts",
      order: 14
    },
    {
      id: "erc20",
      title: "ERC-20",
      description: "Fungible token standard on Ethereum",
      order: 15
    },
    {
      id: "erc721",
      title: "ERC-721",
      description: "Non-fungible token standard on Ethereum",
      order: 16
    },
    {
      id: "nft-storage",
      title: "NFT Storage",
      description: "Storing metadata and assets for NFTs",
      order: 17
    },
    {
      id: "nft-minting",
      title: "NFT Minting",
      description: "Creating and deploying NFTs on blockchain",
      order: 18
    }
  ];