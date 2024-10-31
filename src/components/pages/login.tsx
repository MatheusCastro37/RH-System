import styled from "styled-components";
import { theme } from "../colors/colorts";
import Typography from "../Typography";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";
import { supabase } from "../supabase";
import Modal from "../Modal";
import ErrorImg from "../assets/line-error.svg";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginBox = styled.div`
  box-sizing: border-box;
  width: 450px;
  background-color: ${theme.grayscale.bgLightGrey};
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 25px 50px;
  gap: 25px;
`;

const InputBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  div {
    width: 100%;
  }

  input {
    width: 750%;
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  async function login() {
    if (email == "" || password == "") {
      console.log("Preencha todos os campos");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setModalMessage(`Erro ao realizar autenticação: ${error.message}`);
        openModal();
        return;
      }

      if (data) {
        alert("Login realizado com sucesso");
      }
    } catch (error) {
      console.error(error);
      setModalMessage("Ocorreu um erro, tente novamente.");
      openModal();
    }
  }

  function openModal() {
    setIsVisible(true);
  }

  function closeModal() {
    setIsVisible(false);
  }

  return (
    <>
      <Modal
        img={ErrorImg}
        isVisible={isVisible}
        action={
          <Button size="large" variant="secondary" onClick={closeModal}>
            <Typography variant="body-M-regular">Ok</Typography>
          </Button>
        }
        onClose={closeModal}
      >
        <Typography variant="body-L">{modalMessage}</Typography>
      </Modal>
      <Container>
        <LoginBox>
          <Typography variant="H2">Login</Typography>

          <InputBox>
            <Input
              value={email}
              height="small"
              placeholder="E-mail"
              textLabel={<Typography variant="body-M">E-mail</Typography>}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              value={password}
              height="small"
              placeholder="Senha"
              type="password"
              textLabel={<Typography variant="body-M">Senha</Typography>}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputBox>
          <Button size="large" variant="main" onClick={login}>
            <Typography variant="body-M-regular">Entrar</Typography>
          </Button>
        </LoginBox>
      </Container>
    </>
  );
}
