import Typography from "../../Typography";
import { BodyContainer, CardContainer } from "./styles";

export default function Dashboard() {
    return(
        <BodyContainer>
            <CardContainer>
                <Typography variant="H4">Olá, bem vindo fulano de tal</Typography>
            </CardContainer>
            <CardContainer>
                <Typography variant="H4">Grafico 1</Typography>
            </CardContainer>
            <CardContainer>
                <Typography variant="H4">Grafico 2</Typography>
            </CardContainer>
        </BodyContainer>
    );
}