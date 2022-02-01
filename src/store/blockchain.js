import { action, thunk } from 'easy-peasy';
import Web3 from 'web3';
import SmartContract from '../contracts/Daitos.json';
import constants from '../constants'

export default {
  loading: false,
  account: null,
  smartContract: null,
  web3: null,
  transactionId: null,
  canMintWithSashimono: null,
  errorMsg: "",
  setLoading: action((state, loading) => state.loading = loading),
  setAccount: action((state, account) => state.account = account),
  setSmartContract: action((state, smartContract) => state.smartContract = smartContract),
  setWeb3: action((state, web3) => state.web3 = web3),
  setTransactionId: action((state, transactionId) => state.transactionId = transactionId),
  setCanMintWithSashimono: action((state, canMintWithSashimono) => state.canMintWithSashimono = canMintWithSashimono),
  setErrorMsg: action((state, errorMsg) => st.errorMsg = errorMsg),
  connect: thunk(async (actions) => {
    actions.setLoading(true);
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await window.ethereum.request({
          method: "net_version",
        });

        if(networkId!==constants.chainId){
          actions.setErrorMsg("Please connect to the right network");
          actions.setLoading(false);
          return;
        }

        const SmartContractObj = new web3.eth.Contract(
          SmartContract,
          constants.contractAddress
        );

        actions.setAccount(accounts[0]);
        actions.setSmartContract(SmartContractObj);
        actions.setWeb3(web3);
        actions.setErrorMsg("");

        // Add listeners start
        window.ethereum.on("accountsChanged", (accounts) => {
          actions.setAccount(accounts[0]);
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });


      } catch (err) {
        console.log(err);
        actions.setErrorMsg("Something went wrong.");
      }
    } else {
      actions.setErrorMsg("Install Metamask.");
    }
    actions.setLoading(false);
  }),
  mintDaito: thunk(async (actions, bushidoIds, helpers) => {
    actions.setLoading(true);
    try{
      const receipt = await helpers.getState().smartContract.methods.mintDaito(bushidoIds).send({from: helpers.getState().account});
      actions.setTransactionId(receipt.transactionHash);
    } catch (e){
      console.log(e);
      actions.setErrorMsg("Error submitting transaction");
    }
    actions.setLoading(false);
  }),
  canMintWithBushido: thunk(async (actions, bushidoId, helpers) => {
    actions.setLoading(true);
    try{
      const canMintWithSashimono = await helpers.getState().smartContract.methods.canMintWithBushido(bushidoId).call();
      actions.setCanMintWithSashimono(canMintWithSashimono);
    } catch (e){
      console.log(e);
      actions.setErrorMsg("Error");
    }
    actions.setLoading(false);
  })
}
