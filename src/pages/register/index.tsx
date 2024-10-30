import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Typography from "../../components/Typography";
import { Container, ContainerButton, WrapperForm } from "./style";
import { supabase } from "../../supabase/supabase";

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

export default function Register(){
    const [errorName, setErrorName] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState("");

    function verify() {
        const inputName = document.querySelector("#input-name") as HTMLInputElement;
        const inputEmail = document.querySelector("#input-email") as HTMLInputElement;
        const inputPassword = document.querySelector("#input-password") as HTMLInputElement;
        const inputPasswordConfirm = document.querySelector("#input-password-confirm") as HTMLInputElement;
    
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

        registerUser(inputName.value, inputEmail.value, inputPassword.value);
    }

    async function registerUser(name: string, email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        console.log(data);
        console.log(error);
    }

    return (
        <Container>
            <WrapperForm>
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
                    <Button variant="main" size="medium" onClick={verify}>
                        Cadastrar
                    </Button>
                </ContainerButton>
            </WrapperForm>
        </Container>
    );
};