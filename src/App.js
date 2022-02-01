import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { useForm } from "react-hook-form";


import { useStoreActions, useStoreState } from 'easy-peasy';

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const blockchain = useStoreState(state => state.blockchain);
  const connect = useStoreActions(actions => actions.blockchain.connect);
  const mintDaito = useStoreActions(actions => actions.blockchain.mintDaito);
  const canMintWithBushido = useStoreActions(actions => actions.blockchain.canMintWithBushido);


  const { register: registerMint, handleSubmit: handleSubmitMint } = useForm();
  const { register: registerCheck, handleSubmit: handleSubmitCheck } = useForm();

  const onSubmitCheck = (data) => console.log(data.bushidoId);
  const onSubmitMint = (data) => console.log(data.bushidosId);

  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <StyledButton className={"mint-option-generalcta w-button"}
            onClick={(e) => {
              e.preventDefault();
              connect();
            }}
          >
            CONNECT
          </StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
          <s.TextTitle style={{ textAlign: "center" }}>
            Welcome {blockchain.account}
          </s.TextTitle>
          <form onSubmit={handleSubmitCheck(onSubmitCheck)}>
            <input {...registerCheck("bushidoId")} placeholder="Bushido id" />
            <input type="submit" />
          </form>
          <form onSubmit={handleSubmitMint(onSubmitMint)}>
            <input {...registerMint("bushidosId")} placeholder="Bushidos id" />
            <input type="submit" />
          </form>
          {//  mintDaitos --> this will take an array of bushido ids
            // canMintWithBusido --> user inputs a single bushiDo id and returns true or false
          }
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
