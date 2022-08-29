import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  // thirdweb hooks
  const address = useAddress();
  const connectWithMetaMask = useMetamask();
  const network = useNetwork();
  console.log("👋 Address: ", address);

  // Initialize our editionDrop contact
  const editionDrop = useEditionDrop("0xBd69582b6D9c71FBAf986076ae15768Ac7cc2490");

  // Initialize our token contract
  const token = useToken("0xa7B9B6aAA2403e46eE93dEfad8Bb05CA28F5C798");

  // Initialize our vote contract
  const vote = useVote("0x08FD5407e878cB0751Dc44f8a1291D5c7292381F");

  // state variable to know if user has our NFT
  const [ hasClaimedNFT, setHasClaimedNFT ] = useState(false);
  // loading state while NFT is minting
  const [ isClaiming, setIsClaiming ] = useState(false);

  // Holds the amount of token each member has in state.
  const [ memberTokenAmounts, setMemberTokenAmounts ] = useState([]);
  // Array of all members addresses
  const [ memberAddresses, setMemberAddresses ] = useState([]);

  // Fancy function to shorten wallet address
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [ proposals, setProposals ] = useState([]);
  const [ isVoting, setIsVoting ] = useState(false);
  const [ hasVoted, setHasVoted ] = useState(false);


  // check if user has nft, if address is present.
  useEffect(() => {
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (err) {
        setHasClaimedNFT(false);
        console.log("Failed to get balance.", err);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  // get all addresses that own nft(one-for-all ERC-1155 NFT), if currentuser has claimed NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // get all users that hold NFT with tokenId 0
    const getAllAddresses = async () => {
      try {
        const addresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(addresses);
        console.log("🚀 Member addresses: ", addresses);
      } catch (err) {
        console.log("Failed to get member list", err);
      }
    };
    getAllAddresses();

  }, [hasClaimedNFT, editionDrop.history]);


  // get the number of tokens each user holds.(ERC-20 token)
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts: ", amounts);
      } catch (err) {
        console.log("Failed to get member balances.", err);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);


  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // call vote.getAll() to get the proposals
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals: ", proposals);
      } catch (err) {
        console.log("Failed to get proposals", err);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);


  // Check if the user has already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (err) {
        console.log("Failed to check if user has voted.", err);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, vote, proposals, address]);
  
  


  // combine the memberAddresses and the memberTokenAmounts into a single array.
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // if address is in memberTokenAmounts array, return amount the address has, else return 0. Not all NFT holders may have tokens.
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);
  console.log(memberList);
  
  
  
  const mintNFT = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (err) {
      setHasClaimedNFT(false);
      console.log("Failed to mint NFT", err);
    } finally {
      setIsClaiming(false);
    }
  };

  // Case when user hasnt connected wallet to app before
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to NarutoDAO</h1>
        <button onClick={connectWithMetaMask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (network?.[0].data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>This dapp only works on the Rinkeby network, please switch networks in your connected wallet.</p>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🍪 DAO member page</h1>
        <p>Congratulations on being a member!</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // before making async calls, we first disable button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    // make abstain default
                    vote: 2,
                  };

                  // find the checked option and assign it as the users choice for that proposal
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(proposal.proposalId + "-" + vote.type);

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });

                  return voteResult;  
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  // check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    // if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if its open for voting, we vote
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      console.log("Successfully voted.");           
                    } catch (error) {
                      console.error("Failed to execute votes", error);
                    }
                  } catch (error) {
                    console.error("Failed to vote", error);
                  }
                } catch (error) {
                  console.error("Failed to delegate tokens", error);
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button disabled={isVoting || hasVoted} type="submit">
                { isVoting ? "Voting..." : hasVoted ? "You already voted" : "Submit votes"}
              </button>

              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="landing">
      <h1>Mint your free 🍪DAO membership NFT</h1>
      <button disabled={isClaiming} onClick={mintNFT}>
        { isClaiming ? "Minting..." : "Mint your NFT (free)" }
      </button>
    </div>
  );
};

export default App;
