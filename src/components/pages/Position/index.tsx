import Button from "../../Button";
import Typography from "../../Typography";
import { BodyWrapper, ListingContainer } from "./style";

export default function Position() {
    return(
        <>
            <BodyWrapper>
                <ListingContainer>
                    <div>
                        <Typography variant="H4">Cargos</Typography>
                        <Button variant="main" size="medium">Adicionar</Button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th><Typography variant="body-S">Nome</Typography></th>
                                <th><Typography variant="body-S">Nível</Typography></th>
                                <th><Typography variant="body-S">Salario</Typography></th>
                                <th><Typography variant="body-S">Ação</Typography></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><Typography variant="body-XS">Front-end</Typography></td>
                                <td><Typography variant="body-XS">Junior</Typography></td>
                                <td><Typography variant="body-XS">R$:3.000,00</Typography></td>
                                <td><Button variant="secondary" size="small">Editar</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </ListingContainer>
            </BodyWrapper>
        </>
    );
}