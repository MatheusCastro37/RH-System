import { ChangeEvent, useEffect, useState } from "react";
import Button from "../../Button";
import Typography from "../../Typography";
import { BodyWrapper, ListingContainer } from "./styles";
import { dataType, typeModal } from "./types";
import Modal from "../../Modal";
import Input from "../../Input";

function convertNumberToReal(value: number) {
    const valueFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
    return valueFormatted;
}

function validateName(name: string) {
    return name.length > 2;
}

function validateLevel(level: string) {
    return level.length > 5;
}

export default function Carrer() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState<typeModal>("create");

    const [titleModal, setTitleModal] = useState("Adicionar");
    const [salaryList, setSalaryList] = useState([]);
    const [salaryInput, setSalaryInput] = useState("R$ 0,00");
    const [valueInputName, setValueInputName] = useState("");
    const [valueInputLevel, setvalueInputLevel] = useState("");

    const [errorName, setErrorName] = useState("");
    const [errorLevel, setErrorLevel] = useState("");
    const [errorSalary, setErrorSalary] = useState("");

    const [editButton, setEditButton] = useState<Element>();

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

    useEffect(() => {
        if (typeModal === "edit" && editButton) {
            setSalaryInput(editButton.parentElement?.parentElement?.children[2]?.textContent ?? "R$ 0,00");
            setValueInputName(editButton!.parentElement!.parentElement!.firstElementChild!.textContent!);
            setvalueInputLevel(editButton!.parentElement!.parentElement!.children[1].textContent!);
            setTitleModal("editar");
        }
    }, [typeModal, editButton]);
    
    function showData(data: dataType[]) {
        return data.map(value => (
            <tr key={value.id}>
                <td><Typography variant="body-XS">{value.nomeDoCargo}</Typography></td>
                <td><Typography variant="body-XS">{value.nivel}</Typography></td>
                <td><Typography variant="body-XS">{convertNumberToReal(value.salario)}</Typography></td>
                <td><Button variant="secondary" size="small" onClick={(event) => {
                    setEditButton(event.currentTarget);
                    setIsOpenModal(true);
                    setTypeModal("edit");
                }}>Editar</Button></td>
            </tr>
        ))
    }


    function formatSalary(event: ChangeEvent<HTMLInputElement>){
        let value = event.target.value.replace(/\D/g, "");
    
        value = (parseFloat(value) / 100).toFixed(2).replace(".", ",");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    
        setSalaryInput("R$ " + value);
    }

    function editModal() {
        return (
            <>
                <Typography variant="H3">{titleModal}</Typography>

                <Input value={valueInputName} height="default" textLabel={<Typography variant="body-S">Nome do cargo:</Typography>} textError={errorName} placeholder="Ex: desenvolvedor Front-End" />
                <Input value={valueInputLevel} height="default" textLabel={<Typography variant="body-S">Nivel:</Typography>} textError={errorLevel} placeholder="Ex: Junior" />
                <Input
                type="text"
                height="default"
                textLabel={<Typography variant="body-S">Salario:</Typography>}
                placeholder="Ex: R$:1.800,00"
                value={salaryInput}
                onChange={formatSalary}/>

                <Button variant="main" size="large" onClick={() => verifyCarrer()}>{titleModal}</Button>
            </>
        );

    }

    function verifyCarrer() {
        const isNameValid = validateName(valueInputName);
        const isInputValid = validateLevel(valueInputLevel);

        if(!isNameValid) {
            return setErrorName("O nome do cargo deve ter mais que 2 caracteres!");
        };

        if(!isInputValid) {
            return setErrorLevel("O nivel deve ter mais que 5 caracteres!")
        }

        if(typeModal === "create") {
            alert("Cargo cadastrado!")
        } else {
            alert("Cargo editado!")
        }
    }

    return(
        <>
            <BodyWrapper>
                    <Modal isVisible={isOpenModal} onClose={() => {
                        setSalaryInput("R$ 0,00");
                        setIsOpenModal(false);
                    }}>{editModal()}</Modal>
                <ListingContainer>
                    <div>
                        <Typography variant="H4">Cargos</Typography>
                        <Button variant="main" size="medium" onClick={() => {
                            setIsOpenModal(true);
                            setTypeModal("create");
                            setTitleModal("adicionar");
                            setValueInputName("");
                            setvalueInputLevel("");
                        }}>
                            Adicionar
                        </Button>
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