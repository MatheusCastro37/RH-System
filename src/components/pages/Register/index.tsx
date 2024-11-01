import { useState } from "react";
import Button from "../../Button";
import Input from "../../Input";
import Typography from "../../Typography";
import { Container, ContainerButton, WrapperForm } from "./style";
import spinner from "../../assets/spinner.svg";
import { supabase } from "../../supabase";
import Notification from "../../notfication";
import { NotificationType } from "../../notfication/types";
import { notification } from "./type";

function validateName(name: string) {
    return name.length > 2;
}

function validateEmail(email: string) {
    // Expressão regular para validar o e-mail
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Testa o e-mail com a regex
    return regex.test(email);
}

function validatePassword(password: string) {
    return password.length > 6;
}

function validateSamePassword(password: string, passwordConfirm: string) {
    return password === passwordConfirm;
}

function showLoading(btnElement: HTMLButtonElement, textLoading: string) {
    btnElement.firstElementChild!.classList.add("show");

    const currentText = btnElement.textContent;
    btnElement.lastElementChild!.textContent = textLoading;

    setTimeout(() => {
        btnElement.lastElementChild!.textContent = currentText;
        btnElement.firstElementChild!.classList.remove("show");
    }, 1400)
}

export default function Register(){
    const [errorName, setErrorName] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState("");

    const [typeNotification, setTypeNotification] = useState<NotificationType>("warning");
    const [headerError, setHeaderError] = useState("");
    const [describeError, setDescribeError] = useState("");

    function verify() {
        const inputName = document.querySelector("#input-name") as HTMLInputElement;
        const inputEmail = document.querySelector("#input-email") as HTMLInputElement;
        const inputPassword = document.querySelector("#input-password") as HTMLInputElement;
        const inputPasswordConfirm = document.querySelector("#input-password-confirm") as HTMLInputElement;
        const btnRegister = document.querySelector("#btn-register") as HTMLButtonElement;

        const isNameValid = validateName(inputName.value);
        const isEmailValid = validateEmail(inputEmail.value);
        const isPasswordValid = validatePassword(inputPassword.value);
        const isSamePassword = validateSamePassword(inputPassword.value, inputPasswordConfirm.value);
    
        if(!isNameValid) {
            setErrorName("O nome precisa ter mais de 2 caracteres!");
        } else {
            setErrorName("");
        }

        if(!isEmailValid) {
            setErrorEmail("O email precisa ser verdadeiro!");
        } else {
            setErrorEmail("");
        }

        if(!isPasswordValid) {
            setErrorPassword("A senha precisa ter mais de 6 caracteres!");
        } else {
            setErrorPassword("");
        }

        if(!isSamePassword) {
            setErrorPasswordConfirm("As senhas não são idênticas");
        } else {
            setErrorPasswordConfirm("");
        }

        if(isNameValid && isEmailValid && isPasswordValid && isSamePassword) {
            btnRegister.setAttribute("disabled", "true");
            showLoading(btnRegister, "Cadastrando...");
            setTimeout(async () => {
                await registerUser(inputName.value, inputEmail.value, inputPassword.value);
                btnRegister.removeAttribute("disabled")
            }, 1500)
        }
    }

    function showNotification(type: notification) {
        const notification = document.querySelector("#notification") as Element;
        notification.classList.remove("close");
        notification.classList.add("open");

        setTimeout(() => {
            notification.classList.remove("open");
            notification.classList.add("close");
        }, 2000);

        if(type === "error") {
            setHeaderError("Aviso!");
            setDescribeError("Usuario já cadastrado!")
        } else {
            setTypeNotification("success");
            setHeaderError("Sucesso!");
            setDescribeError("Usuario cadastrado!");
        }
    }

    async function registerUser(name: string, email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if(error) {
            showNotification("error");
        } else {
            showNotification("success");
        }
    }

    return (
        <Container>
            <Notification id="notification" className="alert close" header={headerError} describe={describeError} model="informer" type={typeNotification}/>
            <WrapperForm className="form">
                <Typography variant="H3">Cadastre-se</Typography>
                <Input
                    id="input-name"
                    height="default"
                    type="text"
                    textLabel="Digite seu nome:"
                    textError={errorName}
                    placeholder="Ex: John Doe"
                />
                <Input
                    id="input-email"
                    height="default"
                    type="text"
                    textLabel="Digite seu e-mail:"
                    textError={errorEmail}
                    placeholder="Ex: example@example.com"
                />
                <Input
                    id="input-password"
                    height="default"
                    type="password"
                    textLabel="Digite sua senha:"
                    textError={errorPassword}
                    placeholder="Ex: 123456"
                />
                <Input
                    id="input-password-confirm"
                    height="default"
                    type="password"
                    textLabel="Digite sua senha novamente:"
                    textError={errorPasswordConfirm}
                    placeholder="Ex: 123456"
                />
                <ContainerButton>
                    <Button id="btn-register" variant="main" size="medium" onClick={verify} icon={spinner}>
                        <p>Cadastrar</p>
                    </Button>
                </ContainerButton>
            </WrapperForm>
        </Container>
    );
};