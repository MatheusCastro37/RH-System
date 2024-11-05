import { ChangeEvent, useEffect, useState } from "react";
import Button from "../../Button";
import Typography from "../../Typography";
import { BodyWrapper, ListingContainer } from "./styles";
import { dataType } from "./types";
import Modal from "../../Modal";
import Input from "../../Input";

function convertNumberToReal(value: number) {
    const valueFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
    return valueFormatted;
}

function showData(data: dataType[], actionButton: (a: boolean) => void) {
    return data.map(value => (
        <tr key={value.id}>
            <td><Typography variant="body-XS">{value.nomeDoCargo}</Typography></td>
            <td><Typography variant="body-XS">{value.nivel}</Typography></td>
            <td><Typography variant="body-XS">{convertNumberToReal(value.salario)}</Typography></td>
            <td><Button variant="secondary" size="small" onClick={() => actionButton(true)}>Editar</Button></td>
        </tr>
    ))
}

function formatSalary(event: ChangeEvent<HTMLInputElement>, setState: (valueState: React.SetStateAction<string>) => void){
    let value = event.target.value.replace(/\D/g, "");

    value = (parseFloat(value) / 100).toFixed(2).replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    setState("R$ " + value);
}

export default function Carrer() {
    const [salaryList, setSalaryList] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [salaryInput, setSalaryInput] = useState("R$ 0,00");

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

    }, []);

    return(
        <>
            <BodyWrapper>
                    <Modal isVisible={isOpenModal} onClose={() => {
                        setSalaryInput("R$ 0,00");
                        setIsOpenModal(false);
                    }}>
                        <Typography variant="H3">Adicionar</Typography>

                        <Input height="default" textLabel={<Typography variant="body-S">Nome do cargo:</Typography>} placeholder="Ex: desenvolvedor Front-End" />
                        <Input height="default" textLabel={<Typography variant="body-S">Nivel:</Typography>} placeholder="Ex: Junior" />
                        <Input
                        type="text"
                        height="default"
                        textLabel={<Typography variant="body-S">Salario:</Typography>}
                        placeholder="Ex: R$:1.800,00"
                        value={salaryInput}
                        onChange={(event) => formatSalary(event, setSalaryInput)}/>

                        <Button variant="main" size="large">Adicionar</Button>
                    </Modal>
                <ListingContainer>
                    <div>
                        <Typography variant="H4">Cargos</Typography>
                        <Button variant="main" size="medium" onClick={() => setIsOpenModal(true)}>Adicionar</Button>
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
                            {showData(salaryList, setIsOpenModal)}
                        </tbody>
                    </table>
                </ListingContainer>
            </BodyWrapper>
        </>
    );
}