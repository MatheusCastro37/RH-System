import { useEffect, useState } from "react";
import Button from "../../Button";
import Typography from "../../Typography";
import { BodyWrapper, ListingContainer } from "./styles";
import { dataType } from "./types";

function convertNumberToReal(value: number) {
    const valueFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
    return valueFormatted;
}

function showData(data: dataType[]) {
    return data.map(value => (
        <tr>
            <td><Typography variant="body-XS">{value.nomeDoCargo}</Typography></td>
            <td><Typography variant="body-XS">{value.nivel}</Typography></td>
            <td><Typography variant="body-XS">{convertNumberToReal(value.salario)}</Typography></td>
            <td><Button variant="secondary" size="small">Editar</Button></td>
        </tr>
    ))
}

export default function Position() {
    const [salaryList, setSalaryList] = useState([]);

    useEffect(() => {
        async function getSalaryData() {
            const url = import.meta.env.VITE_SUPABASE_URL;
            const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
            const res = await fetch(`${url}/rest/v1/Cargo`, {
                headers: {
                    apiKey
                }
            })
    
            const data = await res.json();
            setSalaryList(data);
        };

        getSalaryData();

    }, [])

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
                            {showData(salaryList)}
                        </tbody>
                    </table>
                </ListingContainer>
            </BodyWrapper>
        </>
    );
}