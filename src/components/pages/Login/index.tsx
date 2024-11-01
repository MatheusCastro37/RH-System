import Typography from "../../Typography";
import Input from "../../Input";
import Button from "../../Button";
import { useState } from "react";
import { supabase } from "../../supabase";
import Notification from "../../notfication";
import { NotificationType } from "../../notfication/types";
import * as Styles from './styles'


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
      <Styles.NotificationControlDiv isVisible={notificationIsVisible}>
        <Notification
          describe={notificationDescribe}
          header={notificationHeader}
          type={notificationType}
          model="informer"
        />
      </Styles.NotificationControlDiv>
      <Styles.Container>
        <Styles.LoginBox>
          <Typography variant="H2">Login</Typography>

          <Styles.InputBox>
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
          </Styles.InputBox>
          <Button size="large" variant="main" onClick={login}>
            <Typography variant="body-M-regular">Entrar</Typography>
          </Button>
        </Styles.LoginBox>
      </Styles.Container>
    </>
  );
}
