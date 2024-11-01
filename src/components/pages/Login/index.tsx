import styled from "styled-components";
import { theme } from "../../colors/colorts";
import Typography from "../../Typography";
import Input from "../../Input";
import Button from "../../Button";
import { useState } from "react";
import { supabase } from "../../supabase";
import Notification from "../../notfication";
import { NotificationType } from "../../notfication/types";

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

const NotificationControlDiv = styled.div<{ isVisible: boolean }>`
position: absolute;
left: 50%;
top: ${(props) => (props.isVisible ? "15%" : "-100%")};
transform: translate(-50%, -50%);
transition: 1s ease-in-out;
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationDescribe, setNotificationDescribe] = useState("");
  const [notificationHeader, setNotificationHeader] = useState("");
  const [notificationType, setNotificationType] =
    useState<NotificationType>("inform");
  const [notificationIsVisible, setNotificationIsVisible] = useState(false);

  async function login() {
    if (email == "" || password == "") {
      showNotification(
        "Preencha todos os campos antes de prosseguir.",
        "Erro ao realizar Autenticação",
        "error",
        3500
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showNotification(
          "Email ou senha inválidos",
          "Erro ao realizar Autenticação",
          "error",
          3500
        );
        return;
      }

      if (data) {
        showNotification(
          "Redirecionando...",
          "Autenticação realizada com sucesso",
          "success",
          2000
        );
      }
    } catch (error) {
      console.error(error);
    }
  }



  function showNotification(
    describe: string,
    header: string,
    type: NotificationType,
    time: number = 3000
  ) {
    setNotificationType(type);
    setNotificationHeader(header);
    setNotificationDescribe(describe);

    setNotificationIsVisible(true);
    setTimeout(() => setNotificationIsVisible(false), time);
  }

  return (
    <>
      <NotificationControlDiv isVisible={notificationIsVisible}>
        <Notification
          describe={notificationDescribe}
          header={notificationHeader}
          type={notificationType}
          model="informer"
        />
      </NotificationControlDiv>
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
